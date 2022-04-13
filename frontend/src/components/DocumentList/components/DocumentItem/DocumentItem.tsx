import React, {useEffect, useState} from 'react'
import {IDocument} from '../../../../@types/IDocument'
import {IBuilding} from '../../../../@types/IBuilding'
import DocumentService from '../../../../api/DocumentService'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupDocumentCreate from '../../../PopupDocumentCreate/PopupDocumentCreate'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import Preloader from '../../../Preloader/Preloader'
import {useTypedSelector} from '../../../../hooks/useTypedSelector'
import {useActions} from '../../../../hooks/useActions'
import classes from './DocumentItem.module.scss'

interface Props {
    document: IDocument

    onSave(): void
}

const defaultProps: Props = {
    document: {} as IDocument,
    onSave: () => {
        console.info('DocumentItem onSave')
    }
}

const DocumentItem: React.FC<Props> = (props) => {
    const [fetchingDocument, setFetchingDocument] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (props.document.id && (!buildings || !buildings.length)) {
            fetchBuildingList({active: [0, 1]})
        }
    }, [props.document])

    // Редактирование
    const updateHandler = (documentInfo: IDocument) => {
        openPopupDocumentCreate(document.body, {
            document: documentInfo,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление
    const removeHandler = (documentInfo: IDocument) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${documentInfo.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (documentInfo.id) {
                            setFetchingDocument(true)

                            DocumentService.removeDocument(documentInfo.id)
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
                                    setFetchingDocument(false)
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
            {
                text: 'Открыть',
                onClick: () => {
                    switch (props.document.type) {
                        case 'file':
                            window.open(`https://api.sochidominvest.ru/uploads/${props.document.content}`, '_blank')
                            break
                        case 'link':
                            window.open(props.document.content, '_blank')
                            break
                        case 'constructor':
                            // Todo
                            break
                    }
                }
            }
        ]

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => updateHandler(props.document)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(props.document)})
            }
        }

        openContextMenu(e, menuItems)
    }

    let objectInfo = ''

    if (props.document.objectType && props.document.objectId) {
        switch (props.document.objectType) {
            case 'building':
                if (buildings && buildings.length) {
                    const buildingInfo = buildings.find((building: IBuilding) => building.id === props.document.objectId)

                    if (buildingInfo) {
                        objectInfo = buildingInfo.name
                    }
                }
                break
        }
    }

    let type = ''
    switch (props.document.type) {
        case 'file':
            type = 'Файл'
            break
        case 'link':
            type = 'Ссылка'
            break
        case 'constructor':
            type = 'Конструктор'
            break
    }

    return (
        <div className={classes.DocumentItem} onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}>
            {fetchingDocument || fetching ? <Preloader/> : null}

            <div className={classes.id}>#{props.document.id}</div>
            <div className={classes.name}>{props.document.name}</div>
            <div className={classes.object}>{objectInfo}</div>
            <div className={classes.type}>{type}</div>
        </div>
    )
}

DocumentItem.defaultProps = defaultProps
DocumentItem.displayName = 'DocumentItem'

export default DocumentItem