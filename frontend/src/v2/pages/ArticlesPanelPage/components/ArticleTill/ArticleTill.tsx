import React from 'react'
import {IArticle} from '../../../../../@types/IArticle'
import {getArticleTypeText} from '../../../../../helpers/articleHelper'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import BlockItem from '../../../../components/ui/BlockItem/BlockItem'
import classes from './ArticleTill.module.scss'

interface Props {
    list: IArticle[]
    fetching: boolean

    onClick(article: IArticle): void

    onContextMenu(article: IArticle, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (article: IArticle) => {
        console.info('BuildingList onClick', article)
    },
    onContextMenu: (article: IArticle, e: React.MouseEvent) => {
        console.info('BuildingList onClick', article, e)
    }
}

const ArticleTill: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.ArticleTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((article: IArticle) => {
                        return (
                            <BlockItem key={article.id}
                                       title={article.name}
                                       avatar={article.avatar || ''}
                                       description={article.description}
                                       date={article.dateCreated || undefined}
                                       type={getArticleTypeText(article.type)}
                                       isDisabled={!article.active}
                                       onContextMenu={(e: React.MouseEvent) => props.onContextMenu(article, e)}
                                       onClick={() => props.onClick(article)}
                            />
                        )
                    })
                    : <Empty message='Нет статей'/>
                }
            </BlockingElement>
        </div>
    )
}

ArticleTill.defaultProps = defaultProps
ArticleTill.displayName = 'ArticleTill'

export default React.memo(ArticleTill)