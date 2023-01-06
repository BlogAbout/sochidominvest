import React, {useEffect, useMemo, useState} from 'react'
import {IFilterContent} from '../../../@types/IFilter'
import {IPost} from '../../../@types/IPost'
import {compareText} from '../../../helpers/filterHelper'
import {postTypes} from '../../../helpers/postHelper'
import PostService from '../../../api/PostService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import PostList from './components/PostList/PostList'
import openPopupPostCreate from '../../../components/popup/PopupPostCreate/PopupPostCreate'
import classes from './PostsPage.module.scss'

const PostsPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [posts, setPosts] = useState<IPost[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterPost, setFilterPost] = useState<IPost[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['main', 'common']
    })

    useEffect(() => {
        fetchPostsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [posts, filters])

    const fetchPostsHandler = () => {
        setFetching(true)

        PostService.fetchPosts({active: [0, 1]})
            .then((response: any) => {
                setPosts(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                setFetching(false)
            })
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

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchPostsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!posts || !posts.length) {
            setFilterPost([])
        }

        if (value !== '') {
            setFilterPost(filterItemsHandler(posts.filter((post: IPost) => {
                return compareText(post.name, value) || compareText(post.description, value)
            })))
        } else {
            setFilterPost(filterItemsHandler(sortingTreePosts()))
        }
    }

    const onAddHandler = () => {
        openPopupPostCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IPost[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IPost) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: postTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Должности'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Должности</Title>

                <PostList list={filterPost} fetching={fetching} onSave={() => fetchPostsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

PostsPage.displayName = 'PostsPage'

export default React.memo(PostsPage)