import React, {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IPost} from '../../../../../@types/IPost'
import {getPostTypeText} from '../../../../../helpers/postHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import PostService from '../../../../../api/PostService'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupPostCreate from '../../../../../components/popup/PopupPostCreate/PopupPostCreate'
import classes from './PostList.module.scss'

interface Props {
    list: IPost[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('AgentList onSave')
    }
}

const PostList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)

    // Редактирование
    const onEditHandler = (post: IPost) => {
        openPopupPostCreate(document.body, {
            post: post,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (post: IPost) => {
        // Todo: Проверить, что не содержит дочерние
        // Todo: При удалении предлагать переназначить должности пользователям
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${post.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (post.id) {
                            setFetching(true)

                            PostService.removePost(post.id)
                                .then(() => {
                                    props.onSave()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => {
                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (post: IPost, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = []

        if (allowForRole(['director', 'administrator', 'manager'])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(post)})

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(post)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const renderArrowTree = (post: IPost): React.ReactElement | null => {
        if (!post.hasChild) {
            return null
        }

        return (
            <span className={classes.arrow}>
                <FontAwesomeIcon icon={post.isOpen ? 'angle-up' : 'angle-down'}/>
            </span>
        )
    }

    return (
        <List className={classes.PostList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.author}>Автор</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((post: IPost) => {
                        return (
                            <ListRow key={post.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenu(post, e)}
                                     onClick={() => {
                                         // Todo: Должен раскрываться список дочерних
                                     }}
                                     style={{
                                         marginLeft: post.spaces ? 30 * post.spaces : 0,
                                         width: post.spaces ? (`calc(100% - ${30 * post.spaces}px`) : '100%'
                                     }}
                                     isDisabled={!post.active}
                            >
                                <ListCell className={classes.name}>
                                    {renderArrowTree(post)}
                                    {post.name}
                                </ListCell>
                                <ListCell className={classes.author}>{post.authorName}</ListCell>
                                <ListCell className={classes.type}>{getPostTypeText(post.type)}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет должностей'/>
                }
            </ListBody>
        </List>
    )
}

PostList.defaultProps = defaultProps
PostList.displayName = 'PostList'

export default React.memo(PostList)