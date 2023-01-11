import React from 'react'
import {IArticle} from '../../../../../@types/IArticle'
import {getArticleTypeText} from '../../../../../helpers/articleHelper'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import classes from './ArticleList.module.scss'

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
        console.info('BuildingList onContextMenu', article, e)
    }
}

const ArticleList: React.FC<Props> = (props): React.ReactElement => {
    return (
        <List className={classes.ArticleList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.author}>Автор</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
                <ListCell className={classes.views}>Просмотры</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching}>
                {props.list && props.list.length ?
                    props.list.map((article: IArticle) => {
                        return (
                            <ListRow key={article.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(article, e)}
                                     onClick={() => props.onClick(article)}
                                     isDisabled={!article.active}
                            >
                                <ListCell className={classes.name}>{article.name}</ListCell>
                                <ListCell className={classes.author}>{article.authorName || ''}</ListCell>
                                <ListCell className={classes.type}>{getArticleTypeText(article.type)}</ListCell>
                                <ListCell className={classes.views}>{article.views}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет статей'/>
                }
            </ListBody>
        </List>
    )
}

ArticleList.defaultProps = defaultProps
ArticleList.displayName = 'ArticleList'

export default React.memo(ArticleList)