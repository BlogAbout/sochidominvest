import React from 'react'
import ArticleItem from './components/ArticleItem/ArticleItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IArticle} from '../../../../../@types/IArticle'
import classes from './ArticleTill.module.scss'

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
        console.info('BuildingTill onClick', article)
    },
    onEdit: (article: IArticle) => {
        console.info('BuildingTill onEdit', article)
    },
    onRemove: (article: IArticle) => {
        console.info('BuildingTill onRemove', article)
    },
    onContextMenu: (e: React.MouseEvent, article: IArticle) => {
        console.info('BuildingTill onContextMenu', e, article)
    }
}

const ArticleTill: React.FC<Props> = (props) => {
    return (
        <div className={classes.ArticleTill}>
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

ArticleTill.defaultProps = defaultProps
ArticleTill.displayName = 'ArticleTill'

export default ArticleTill