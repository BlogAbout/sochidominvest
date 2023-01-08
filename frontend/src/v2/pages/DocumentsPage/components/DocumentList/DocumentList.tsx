import React, {useState} from 'react'
import {IDocument} from '../../../../../@types/IDocument'
import {IBuilding} from '../../../../../@types/IBuilding'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {getDocumentTypeText} from '../../../../../helpers/documentHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import DocumentService from '../../../../../api/DocumentService'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupDocumentCreate from '../../../../../components/popup/PopupDocumentCreate/PopupDocumentCreate'
import classes from './DocumentList.module.scss'

interface Props {
    list: IDocument[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('DocumentList onSave')
    }
}

const DocumentList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)

    const {buildings} = useTypedSelector(state => state.buildingReducer)

    const getObjectInfo = (document: IDocument): string => {
        let objectInfo = ''

        if (document.objectType && document.objectId) {
            switch (document.objectType) {
                case 'building':
                    if (buildings && buildings.length) {
                        const buildingInfo = buildings.find((building: IBuilding) => building.id === document.objectId)

                        if (buildingInfo) {
                            objectInfo = buildingInfo.name
                        }
                    }
                    break
            }
        }

        return objectInfo
    }

    // Редактирование
    const onEditHandler = (documentInfo: IDocument) => {
        openPopupDocumentCreate(document.body, {
            document: documentInfo,
            onSave: () => props.onSave()
        })
    }

    // Удаление
    const onRemoveHandler = (documentInfo: IDocument) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${documentInfo.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (documentInfo.id) {
                            setFetching(true)

                            DocumentService.removeDocument(documentInfo.id)
                                .then(() => props.onSave())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenuHandler = (documentInfo: IDocument, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Открыть',
                onClick: () => {
                    switch (documentInfo.type) {
                        case 'file':
                            window.open(
                                `https://api.sochidominvest.ru/uploads/${documentInfo.type}/${documentInfo.content}`,
                                '_blank'
                            )
                            break
                        case 'link':
                            window.open(documentInfo.content, '_blank')
                            break
                        case 'constructor':
                            // Todo
                            break
                    }
                }
            }
        ]

        if (allowForRole(['director', 'administrator', 'manager'])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(documentInfo)})

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(documentInfo)})
            }
        }

        openContextMenu(e, menuItems)
    }

    return (
        <List className={classes.DocumentList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.object}>Объект</ListCell>
                <ListCell className={classes.cost}>Тип</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((document: IDocument) => {
                        return (
                            <ListRow key={document.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(document, e)}
                                     onClick={() => {
                                     }}
                            >
                                <ListCell className={classes.name}>{document.name}</ListCell>
                                <ListCell className={classes.object}>{getObjectInfo(document)}</ListCell>
                                <ListCell className={classes.type}>{getDocumentTypeText(document.type)}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет документов'/>
                }
            </ListBody>
        </List>
    )
}

DocumentList.defaultProps = defaultProps
DocumentList.displayName = 'DocumentList'

export default React.memo(DocumentList)