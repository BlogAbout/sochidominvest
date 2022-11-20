import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {converter} from '../../../../helpers/utilHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {IArticle} from '../../../../../@types/IArticle'
import Avatar from '../../../../components/ui/Avatar/Avatar'
import Title from '../../../../components/ui/Title/Title'
import classes from './ArticleItem.module.scss'

interface Props {
    article: IArticle

    onClick(): void
}

const defaultProps: Props = {
    article: {} as IArticle,
    onClick: () => {
        console.info('ArticleItem onClick')
    }
}

const ArticleItem: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div key={props.article.id}
             className={classes.ArticleItem}
             onClick={() => props.onClick()}
        >
            <Avatar href={props.article.avatar}
                    alt={props.article.name}
                    width='100%'
                    height='100%'
                    withWrap
            />

            <div className={classes.itemContent}>
                <Title type='h3'
                       style='right'
                       className={classes.head}
                >{props.article.name}</Title>

                <div className={classes.description}
                     dangerouslySetInnerHTML={{__html: converter.makeHtml(props.article.description.substring(0, 150))}}
                />
            </div>

            <div className={classes.information}>
                <div className={classes.icon} title={`Просмотры: ${props.article.views}`}>
                    <FontAwesomeIcon icon='eye'/>
                    <span>{props.article.views}</span>
                </div>

                <div className={classes.icon} title={`Дата публикации: ${getFormatDate(props.article.dateCreated)}`}>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{getFormatDate(props.article.dateCreated)}</span>
                </div>
            </div>
        </div>
    )
}

ArticleItem.defaultProps = defaultProps
ArticleItem.displayName = 'ArticleItem'

export default React.memo(ArticleItem)