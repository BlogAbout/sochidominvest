import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {compareText} from '../../../helpers/filterHelper'
import Button from '../../../components/Button/Button'
import openPopupArticleCreate from '../../../components/PopupArticleCreate/PopupArticleCreate'
import ArticleList from '../../../components/ArticleList/ArticleList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import {IArticle} from '../../../@types/IArticle'
import {IFilterContent} from '../../../@types/IFilter'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './ArticlePagePanel.module.scss'
import {IUser} from "../../../@types/IUser";

const ArticlePagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({

    })

    const {role} = useTypedSelector(state => state.userReducer)
    const {articles, fetching} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        if (isUpdate || !articles.length) {
            fetchArticleList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [articles, selectedType])

    // Обработчик изменений
    const onSave = () => {
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

    const addHandler = () => {
        openPopupArticleCreate(document.body, {
            onSave: () => onSave()
        })
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

    const filtersContent: IFilterContent[] = [

    ]

    return (
        <main className={classes.ArticlePagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Статьи - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <SidebarLeft filters={filtersContent}/>

            <div className={classes.filter}>
                <Button type={selectedType.includes('news') ? 'regular' : 'save'}
                        icon={'bolt'}
                        onClick={() => onClickFilterButtonHandler('news')}
                >Новости</Button>

                <Button type={selectedType.includes('action') ? 'regular' : 'save'}
                        icon={'percent'}
                        onClick={() => onClickFilterButtonHandler('action')}
                >Акции</Button>

                <Button type={selectedType.includes('article') ? 'regular' : 'save'}
                        icon={'star'}
                        onClick={() => onClickFilterButtonHandler('article')}
                >Статьи</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Статьи</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={addHandler.bind(this)}>Добавить</Button>
                        : null
                    }
                </h1>

                <ArticleList articles={filterArticle} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

ArticlePagePanel.displayName = 'ArticlePagePanel'

export default ArticlePagePanel