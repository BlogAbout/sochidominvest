import React from 'react'
import Empty from '../Empty/Empty'
import ArticleItem from './components/ArticleItem/ArticleItem'
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
        <div className={classes.DeveloperList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Имя</div>
                <div className={classes.type}>Тип</div>
            </div>

            {props.articles.length ?
                props.articles.map((article: IArticle) => {
                    return (
                        <ArticleItem key={article.id} article={article} onSave={props.onSave.bind(this)}/>
                    )
                })
                : <Empty message='Нет статей'/>
            }
        </div>
    )
}

ArticleList.defaultProps = defaultProps
ArticleList.displayName = 'ArticleList'

export default ArticleList