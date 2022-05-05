import React from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {IArticle} from '../../../../../@types/IArticle'
import {IBuilding} from '../../../../../@types/IBuilding'
import {ILog} from '../../../../../@types/ILog'
import classes from './InfoItem.module.scss'

interface Props {
    article?: IArticle
    building?: IBuilding
    log?: ILog
    type: 'article' | 'building' | 'log'

    onSave(): void
}

const defaultProps: Props = {
    type: 'article',
    onSave: () => {
        console.info('InfoItem onSave')
    }
}

const InfoItem: React.FC<Props> = (props) => {
    const {role} = useTypedSelector(state => state.userReducer)

    // Редактирование
    const updateHandler = () => {
        // Todo
        // openPopupArticleCreate(document.body, {
        //     article: article,
        //     onSave: () => {
        //         props.onSave()
        //     }
        // })
    }

    // Удаление
    const removeHandler = () => {
        // Todo
        // openPopupAlert(document.body, {
        //     text: `Вы действительно хотите удалить ${article.name}?`,
        //     buttons: [
        //         {
        //             text: 'Удалить',
        //             onClick: () => {
        //                 if (article.id) {
        //                     setFetching(true)
        //
        //                     ArticleService.removeArticle(article.id)
        //                         .then(() => {
        //                             props.onSave()
        //                         })
        //                         .catch((error: any) => {
        //                             openPopupAlert(document.body, {
        //                                 title: 'Ошибка!',
        //                                 text: error.data
        //                             })
        //                         })
        //                         .finally(() => {
        //                             setFetching(false)
        //                         })
        //                 }
        //             }
        //         },
        //         {text: 'Отмена'}
        //     ]
        // })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        // Todo
        // if (['director', 'administrator', 'manager'].includes(role)) {
        //     const menuItems = [{text: 'Редактировать', onClick: () => updateHandler(props.article)}]
        //
        //     if (['director', 'administrator'].includes(role)) {
        //         menuItems.push({text: 'Удалить', onClick: () => removeHandler(props.article)})
        //     }
        //
        //     openContextMenu(e, menuItems)
        // }
    }

    const renderArticle = () => {
        if (!props.article) {
            return null
        }

        return (
            <div className={classes.InfoItem}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
            >
                <div className={classes.name}>{props.article.name}</div>
                <div className={classes.date}>{props.article.dateCreated}</div>
            </div>
        )
    }

    const renderBuilding = () => {
        if (!props.building) {
            return null
        }

        return (
            <div className={classes.InfoItem}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
            >
                <div className={classes.name}>{props.building.name}</div>
                <div className={classes.date}>{props.building.dateCreated}</div>
            </div>
        )
    }

    const renderLog = () => {
        if (!props.log) {
            return null
        }

        let textContent = ''

        switch (props.log.type) {
            case 'create':
                textContent = 'Создано: '
                break
            case 'update':
                textContent = 'Обновлено: '
                break
            case 'remove':
                textContent = 'Удалено: '
                break
        }

        switch (props.log.objectType) {
            case 'article':
                textContent += 'статья. '
                break
            case 'building':
                textContent += 'объект недвижимости. '
                break
            case 'checker':
                textContent += 'шахматка. '
                break
            case 'developer':
                textContent += 'застройщик. '
                break
            case 'document':
                textContent += 'документ. '
                break
            case 'tag':
                textContent += 'тег. '
                break
            case 'feed':
                textContent += 'заявка. '
                break
            case 'user':
                textContent += 'пользователь. '
                break
            case 'attachment':
                textContent += 'вложение. '
                break
            case 'notify':
                textContent += 'уведомление. '
                break
            case 'widget':
                textContent += 'виджет. '
                break
            case 'partner':
                textContent += 'партнер. '
                break
        }

        return (
            <div className={classes.InfoItem}>
                <div className={classes.name}>{textContent + props.log.content}</div>
                <div className={classes.date}>{props.log.dateCreated}</div>
            </div>
        )
    }

    return (
        props.type === 'article' ? renderArticle()
            : props.type === 'building' ? renderBuilding()
            : renderLog()
    )
}

InfoItem.defaultProps = defaultProps
InfoItem.displayName = 'InfoItem'

export default InfoItem