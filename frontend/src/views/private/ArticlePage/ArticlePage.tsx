import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import Button from '../../../components/Button/Button'
import openPopupArticleCreate from '../../../components/PopupArticleCreate/PopupArticleCreate'
import ArticleList from '../../../components/ArticleList/ArticleList'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './ArticlePage.module.scss'

const ArticlePage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)

    const {articles, fetching} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        if (isUpdate || !articles.length) {
            fetchArticleList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    const addHandler = () => {
        openPopupArticleCreate(document.body, {
            onSave: () => onSave()
        })
    }

    return (
        <main className={classes.ArticlePage}>
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
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Статьи</span>
                    <Button type='apply' icon='plus' onClick={addHandler.bind(this)}>Добавить</Button>
                </h1>

                <ArticleList articles={articles} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

ArticlePage.displayName = 'ArticlePage'

export default ArticlePage