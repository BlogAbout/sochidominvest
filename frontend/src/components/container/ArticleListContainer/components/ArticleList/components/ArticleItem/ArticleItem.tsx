import React from 'react'
import classNames from 'classnames/bind'
import {IArticle} from '../../../../../../../@types/IArticle'
import {getArticleTypeText} from '../../../../../../../helpers/articleHelper'
import classes from './ArticleItem.module.scss'

interface Props {
    article: IArticle

    onClick(article: IArticle): void

    onEdit(article: IArticle): void

    onRemove(article: IArticle): void

    onContextMenu(e: React.MouseEvent, article: IArticle): void
}

const defaultProps: Props = {
    article: {} as IArticle,
    onClick: (article: IArticle) => {
        console.info('ArticleItem onClick', article)
    },
    onEdit: (article: IArticle) => {
        console.info('ArticleItem onEdit', article)
    },
    onRemove: (article: IArticle) => {
        console.info('ArticleItem onRemove', article)
    },
    onContextMenu: (e: React.MouseEvent, article: IArticle) => {
        console.info('ArticleItem onContextMenu', e, article)
    }
}

const cx = classNames.bind(classes)

const ArticleItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'ArticleItem': true, 'disabled': !props.article.active})}
             onClick={() => props.onClick(props.article)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.article)}
        >
            <div className={classes.name}>{props.article.name}</div>
            <div className={classes.author}>{props.article.authorName || ''}</div>
            <div className={classes.type}>{getArticleTypeText(props.article.type)}</div>
            <div className={classes.views}>{props.article.views}</div>
        </div>
    )
}

ArticleItem.defaultProps = defaultProps
ArticleItem.displayName = 'ArticleItem'

export default ArticleItem