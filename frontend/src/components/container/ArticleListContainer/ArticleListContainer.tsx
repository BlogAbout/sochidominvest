import React from 'react'
import {IArticle} from '../../../@types/IArticle'
import Empty from '../../ui/Empty/Empty'
import ArticleList from './components/ArticleList/ArticleList'
import ArticleTill from './components/ArticleTill/ArticleTill'
import classes from './ArticleListContainer.module.scss'

interface Props {
    articles: IArticle[]
    fetching: boolean
    layout: 'list' | 'till'

    onClick(article: IArticle): void

    onEdit(article: IArticle): void

    onRemove(article: IArticle): void

    onContextMenu(e: React.MouseEvent, article: IArticle): void
}

const defaultProps: Props = {
    articles: [],
    fetching: false,
    layout: 'list',
    onClick: (article: IArticle) => {
        console.info('ArticleListContainer onClick', article)
    },
    onEdit: (article: IArticle) => {
        console.info('ArticleListContainer onEdit', article)
    },
    onRemove: (article: IArticle) => {
        console.info('ArticleListContainer onRemove', article)
    },
    onContextMenu: (e: React.MouseEvent, article: IArticle) => {
        console.info('ArticleListContainer onContextMenu', e, article)
    }
}

const ArticleListContainer: React.FC<Props> = (props) => {
    const renderList = () => {
        switch (props.layout) {
            case 'list':
                return (
                    <ArticleList articles={props.articles}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
                    />
                )
            case 'till':
                return (
                    <ArticleTill articles={props.articles}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
                    />
                )
        }
    }

    return (
        <div className={classes.ArticleListContainer}>
            {props.articles.length ? renderList() : <Empty message='Нет статей'/>}
        </div>
    )
}

ArticleListContainer.defaultProps = defaultProps
ArticleListContainer.displayName = 'ArticleListContainer'

export default ArticleListContainer