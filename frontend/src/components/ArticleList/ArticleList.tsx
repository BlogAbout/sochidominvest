import React from 'react'
import Empty from '../Empty/Empty'
import ArticleItem from './components/ArticleItem/ArticleItem'
import BlockingElement from '../BlockingElement/BlockingElement'
import {IArticle} from '../../@types/IArticle'
import classes from './ArticleList.module.scss'

interface Props {
    articles: IArticle[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    articles: [],
    fetching: false,
    onSave: () => {
        console.info('ArticleList onSave')
    }
}

const ArticleList: React.FC<Props> = (props) => {
    return (
        <div className={classes.ArticleList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Название</div>
                <div className={classes.author}>Автор</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.views}>Просмотры</div>
            </div>

            {props.articles.length ?
                (<BlockingElement fetching={props.fetching} className={classes.list}>
                    {props.articles.map((article: IArticle) => {
                        return (
                            <ArticleItem key={article.id} article={article} onSave={props.onSave.bind(this)}/>
                        )
                    })}
                </BlockingElement>)
                : <Empty message='Нет статей'/>
            }
        </div>
    )
}

ArticleList.defaultProps = defaultProps
ArticleList.displayName = 'ArticleList'

export default ArticleList