import React from 'react'
import classNames from 'classnames/bind'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import {getArticleTypeText} from '../../../../../../../helpers/articleHelper'
import {IArticle} from '../../../../../../../@types/IArticle'
import Avatar from '../../../../../../ui/Avatar/Avatar'
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
    let typeIcon: IconProp = 'bolt'
    switch (props.article.type) {
        case 'news':
            typeIcon = 'bolt'
            break
        case 'action':
            typeIcon = 'percent'
            break
        case 'article':
            typeIcon = 'star'
            break
    }

    return (
        <div className={cx({'ArticleItem': true, 'disabled': !props.article.active})}
             onClick={() => props.onClick(props.article)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.article)}
        >
            <Avatar href={props.article.avatar} alt={props.article.name} width={150} height={150}/>

            <div className={classes.itemContent}>
                <h2>{props.article.name}</h2>

                <div className={classes.row} title='Тип'>
                    <FontAwesomeIcon icon={typeIcon}/>
                    <span>{getArticleTypeText(props.article.type)}</span>
                </div>

                <div className={classes.row} title='Дата публикации'>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{getFormatDate(props.article.dateCreated)}</span>
                </div>

                {props.article.authorName ?
                    <div className={classes.row} title='Автор'>
                        <FontAwesomeIcon icon='user'/>
                        <span>{props.article.authorName}</span>
                    </div>
                    : null}

                <div className={classes.row} title={`Просмотры: ${props.article.views}`}>
                    <FontAwesomeIcon icon='eye'/>
                    <span>{props.article.views}</span>
                </div>
            </div>
        </div>
    )
}

ArticleItem.defaultProps = defaultProps
ArticleItem.displayName = 'ArticleItem'

export default ArticleItem