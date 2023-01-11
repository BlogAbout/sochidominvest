import React from 'react'
import ArticleItem from './components/ArticleItem/ArticleItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IArticle} from '../../../../../@types/IArticle'
import classes from './ArticleList.module.scss'

interface Props {
    articles: IArticle[]
    fetching: boolean

    onClick(article: IArticle): void

    onEdit(article: IArticle): void

    onRemove(article: IArticle): void

    onContextMenu(e: React.MouseEvent, article: IArticle): void
}

const defaultProps: Props = {
    articles: [],
    fetching: false,
    onClick: (article: IArticle) => {
        console.info('BuildingList onClick', article)
    },
    onEdit: (article: IArticle) => {
        console.info('BuildingList onEdit', article)
    },
    onRemove: (article: IArticle) => {
        console.info('BuildingList onRemove', article)
    },
    onContextMenu: (e: React.MouseEvent, article: IArticle) => {
        console.info('BuildingList onContextMenu', e, article)
    }
}

const ArticleList: React.FC<Props> = (props) => {
    return (
        <div className={classes.ArticleList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.author}>Автор</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.views}>Просмотры</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.articles.map((article: IArticle) => {
                    return (
                        <ArticleItem key={article.id}
                                     article={article}
                                     onClick={props.onClick}
                                     onEdit={props.onEdit}
                                     onRemove={props.onRemove}
                                     onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

ArticleList.defaultProps = defaultProps
ArticleList.displayName = 'ArticleList'

export default ArticleList