import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {articleTypes} from '../../../helpers/articleHelper'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {allowForRole} from '../../helpers/accessHelper'
import {RouteNames} from '../../helpers/routerHelper'
import {IArticle} from '../../../@types/IArticle'
import {IFilterContent} from '../../../@types/IFilter'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import ArticleService from '../../../api/ArticleService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import ArticleList from './components/ArticleList/ArticleList'
import ArticleTill from './components/ArticleTill/ArticleTill'
import openPopupArticleCreate from '../../../components/popup/PopupArticleCreate/PopupArticleCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './ArticlesPanelPage.module.scss'

const ArticlesPanelPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [articles, setArticles] = useState<IArticle[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['article', 'action', 'news']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('articles'))

    useEffect(() => {
        fetchArticlesHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [articles, filters])

    const fetchArticlesHandler = () => {
        setFetching(true)

        ArticleService.fetchArticles({active: [0, 1]})
            .then((response: any) => setArticles(response.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchArticlesHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!articles || !articles.length) {
            setFilterArticle([])
        }

        if (value !== '') {
            setFilterArticle(filterItemsHandler(articles.filter((article: IArticle) => {
                return compareText(article.name, value)
            })))
        } else {
            setFilterArticle(filterItemsHandler(articles))
        }
    }

    const onClickHandler = (article: IArticle) => {
        navigate(`${RouteNames.ARTICLE}/${article.id}`)
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
            onSave: () => onSaveHandler()
        })
    }

    // Удаление
    const onRemoveHandler = (article: IArticle) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${article.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (article.id) {
                            setFetching(true)

                            ArticleService.removeArticle(article.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenuHandler = (article: IArticle, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(article)}]

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(article)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('articles', value)
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IArticle[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IArticle) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: articleTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Статьи'>
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
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Статьи</Title>

                {layout === 'till'
                    ? <ArticleTill list={filterArticle}
                                   fetching={fetching}
                                   onClick={(article: IArticle) => onClickHandler(article)}
                                   onContextMenu={(article: IArticle, e: React.MouseEvent) => onContextMenuHandler(article, e)}
                    />
                    : <ArticleList list={filterArticle}
                                   fetching={fetching}
                                   onClick={(article: IArticle) => onClickHandler(article)}
                                   onContextMenu={(article: IArticle, e: React.MouseEvent) => onContextMenuHandler(article, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

ArticlesPanelPage.displayName = 'ArticlesPanelPage'

export default React.memo(ArticlesPanelPage)