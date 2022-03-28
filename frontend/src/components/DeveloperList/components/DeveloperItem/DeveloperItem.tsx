import React, {useState} from 'react'
import {IDeveloper} from '../../../../@types/IDeveloper'
import {developerTypes} from '../../../../helpers/developerHelper'
import DeveloperService from '../../../../api/DeveloperService'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupDeveloperCreate from '../../../PopupDeveloperCreate/PopupDeveloperCreate'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import openPopupDeveloperInfo from '../../../PopupDeveloperInfo/PopupDeveloperInfo'
import Preloader from '../../../Preloader/Preloader'
import classes from './DeveloperItem.module.scss'

interface Props {
    developer: IDeveloper

    onSave(): void
}

const defaultProps: Props = {
    developer: {} as IDeveloper,
    onSave: () => {
        console.info('DeveloperItem onSave')
    }
}

const DeveloperItem: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)

    // Редактирование
    const updateHandler = (developer: IDeveloper) => {
        openPopupDeveloperCreate(document.body, {
            developer: developer,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление
    const removeHandler = (developer: IDeveloper) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${developer.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (developer.id) {
                            setFetching(true)

                            DeveloperService.removeDeveloper(developer.id)
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
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: () => updateHandler(props.developer)},
            {text: 'Удалить', onClick: () => removeHandler(props.developer)}
        ]

        openContextMenu(e, menuItems)
    }

    const developerType = developerTypes.find(item => item.key === props.developer.type)

    return (
        <div className={classes.DeveloperItem}
             onClick={(e: React.MouseEvent) => openPopupDeveloperInfo(e, {
                 developer: props.developer
             })}
             onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
        >
            {fetching && <Preloader/>}

            <div className={classes.id}>#{props.developer.id}</div>
            <div className={classes.name}>{props.developer.name}</div>
            <div className={classes.type}>{developerType ? developerType.text : ''}</div>
            <div className={classes.phone}>{props.developer.phone}</div>
        </div>
    )
}

DeveloperItem.defaultProps = defaultProps
DeveloperItem.displayName = 'DeveloperItem'

export default DeveloperItem