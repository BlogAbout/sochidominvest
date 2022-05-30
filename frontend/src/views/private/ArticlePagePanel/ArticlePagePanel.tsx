import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IArticle} from '../../../@types/IArticle'
import {IFilterBase, IFilterContent} from '../../../@types/IFilter'
import ArticleService from '../../../api/ArticleService'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import Title from '../../../components/ui/Title/Title'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import ArticleListContainer from '../../../components/container/ArticleListContainer/ArticleListContainer'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import openPopupArticleCreate from '../../../components/popup/PopupArticleCreate/PopupArticleCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './ArticlePagePanel.module.scss'

const ArticlePagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({})
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('articles'))
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {articles, fetching: fetchingArticle} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        if (isUpdate || !articles.length) {
            fetchArticleList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [articles, selectedType, filters])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!articles || !articles.length) {
            setFilterArticle([])
        }

        if (value !== '') {
            setFilterArticle(filterItemsHandler(articles.filter((article: IArticle) => {
                return (!selectedType.length || selectedType.includes(article.type)) && compareText(article.name, value)
            })))
        } else {
            setFilterArticle(filterItemsHandler(!selectedType.length ? articles : articles.filter((article: IArticle) => selectedType.includes(article.type))))
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('articles', value)
    }

    const onClickHandler = (article: IArticle) => {
        navigate('/panel/article/' + article.id)
    }

    const onAddHandler = () => {
        openPopupArticleCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование
    const onEditHandler = (article: IArticle) => {
        openPopupArticleCreate(document.body, {
            article: article,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (article: IArticle) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${article.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (article.id) {
                            setFetching(true)

                            ArticleService.removeArticle(article.id)
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
    const onContextMenu = (e: React.MouseEvent, article: IArticle) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(article)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(article)})
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
    const filterItemsHandler = (list: IArticle[]) => {
        if (!list || !list.length) {
            return []
        }

        return list
        // Todo: Придумать фильтры
        // return list.filter((item: IArticle) => {
        //     return filters.block.includes(String(item.block))
        // })
    }

    const filtersContent: IFilterContent[] = []

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'news',
            title: 'Новости',
            icon: 'bolt',
            active: selectedType.includes('news'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'action',
            title: 'Акции',
            icon: 'percent',
            active: selectedType.includes('action'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'article',
            title: 'Статьи',
            icon: 'star',
            active: selectedType.includes('article'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.ArticlePagePanel}>
            <PageInfo title='Статьи'/>

            <SidebarLeft filters={filtersContent}/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       layout={layout}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                       showChangeLayout
                >Статьи</Title>

                <ArticleListContainer articles={filterArticle}
                                      fetching={fetching || fetchingArticle}
                                      layout={layout}
                                      onClick={onClickHandler.bind(this)}
                                      onEdit={onEditHandler.bind(this)}
                                      onRemove={onRemoveHandler.bind(this)}
                                      onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

ArticlePagePanel.displayName = 'ArticlePagePanel'

export default ArticlePagePanel