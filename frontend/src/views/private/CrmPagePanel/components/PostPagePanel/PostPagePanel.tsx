import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IPost} from '../../../../../@types/IPost'
import {IFilterBase, IFilterContent} from '../../../../../@types/IFilter'
import PostService from '../../../../../api/PostService'
import {compareText} from '../../../../../helpers/filterHelper'
import Title from '../../../../../components/ui/Title/Title'
import FilterBase from '../../../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import PostListContainer from '../../../../../components/container/PostListContainer/PostListContainer'
import SidebarLeft from '../../../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupPostCreate from '../../../../../components/popup/PopupPostCreate/PopupPostCreate'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './PostPagePanel.module.scss'

const PostPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterPost, setFilterPost] = useState<IPost[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({})
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {posts, fetching: fetchingPost} = useTypedSelector(state => state.postReducer)
    const {fetchPostList} = useActions()

    useEffect(() => {
        if (isUpdate || !posts.length) {
            fetchPostList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [posts, selectedType, filters])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Рекурсия для древовидного списка
    const recursiveThree = (sortingArray: IPost[], parentId: number | null, items: IPost[], level: number): IPost[] => {
        for (const item of sortingArray) {
            if (item.postId == null) {
                item.postId = 0
            }

            if (item.postId == parentId) {
                item.spaces = level
                items.push(item)
                recursiveThree(sortingArray, item.id, items, level + 1)
            }
        }

        return items
    }

    // Построение древовидного списка
    const sortingTreePosts = (): IPost[] => {
        const items: IPost[] = []
        recursiveThree(JSON.parse(JSON.stringify(posts)), 0, items, 0)

        return items
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!posts || !posts.length) {
            setFilterPost([])
        }

        if (value !== '') {
            console.log('net',posts)
            setFilterPost(filterItemsHandler(posts.filter((post: IPost) => {
                return (!selectedType.length || selectedType.includes(post.type)) &&
                    (compareText(post.name, value) || compareText(post.description, value))
            })))
        } else {
            console.log('da')
            setFilterPost(filterItemsHandler(!selectedType.length ? sortingTreePosts() : posts.filter((post: IPost) => selectedType.includes(post.type))))
        }
    }

    const onClickHandler = (post: IPost) => {
        // Todo: Должен раскрываться список дочерних
    }

    // Добавление нового застройщика
    const onAddHandler = () => {
        openPopupPostCreate(document.body, {
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Редактирование
    const onEditHandler = (post: IPost) => {
        openPopupPostCreate(document.body, {
            post: post,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (post: IPost) => {
        // Todo: Проверить, что не содержит дочерние
        // Todo: При удалении предлагать переназначить должности пользователям
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${post.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (post.id) {
                            setFetching(true)

                            PostService.removePost(post.id)
                                .then(() => {
                                    onSaveHandler()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => {
                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, post: IPost) => {
        e.preventDefault()

        const menuItems = []

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(post)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(post)})
            }

            openContextMenu(e, menuItems)
        }
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IPost[]) => {
        if (!list || !list.length) {
            return []
        }

        return list
        // Todo: Придумать фильтры
        // return list.filter((item: IPost) => {
        //     return filters.block.includes(String(item.block))
        // })
    }

    const filtersContent: IFilterContent[] = []

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'main',
            title: 'Главные',
            icon: 'user-gear',
            active: selectedType.includes('main'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'common',
            title: 'Общие',
            icon: 'user',
            active: selectedType.includes('common'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.PostPagePanel}>
            <PageInfo title='Должности'/>

            <SidebarLeft filters={filtersContent}/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Должности</Title>

                <PostListContainer posts={filterPost}
                                   fetching={fetching || fetchingPost}
                                   onClick={onClickHandler.bind(this)}
                                   onEdit={onEditHandler.bind(this)}
                                   onRemove={onRemoveHandler.bind(this)}
                                   onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

PostPagePanel.displayName = 'PostPagePanel'

export default PostPagePanel