import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import Button from '../../../components/Button/Button'
import openPopupArticleCreate from '../../../components/PopupArticleCreate/PopupArticleCreate'
import ArticleList from '../../../components/ArticleList/ArticleList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import {IArticle} from '../../../@types/IArticle'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './ArticlePagePanel.module.scss'

const ArticlePagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])

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
    }, [articles])

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
            setFilterArticle(articles.filter((article: IArticle) => {
                return article.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterArticle(articles)
        }
    }

    const addHandler = () => {
        openPopupArticleCreate(document.body, {
            onSave: () => onSave()
        })
    }

    return (
        <main className={classes.ArticlePagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Статьи - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type='save' icon={'bolt'} onClick={() => console.log('add')}>Новости</Button>

                <Button type='save' icon={'percent'} onClick={() => console.log('add')}>Акции</Button>

                <Button type='save' icon={'star'} onClick={() => console.log('add')}>Статьи</Button>

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