import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IDocument} from '../../../../@types/IDocument'
import DocumentService from '../../../../api/DocumentService'
import Empty from '../../../Empty/Empty'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupDocumentCreate from '../../../PopupDocumentCreate/PopupDocumentCreate'
import Preloader from '../../../Preloader/Preloader'
import classes from './DocumentList.module.scss'

interface Props {
    buildingId: number | null
}

const defaultProps: Props = {
    buildingId: null
}

const DocumentList: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [documents, setDocuments] = useState<IDocument[]>([])

    useEffect(() => {
        if (isUpdate && props.buildingId) {
            DocumentService.fetchDocuments({active: [0, 1], objectId: props.buildingId, typeObject: 'building'})
                .then((response: any) => {
                    setFetching(false)
                    setDocuments(response.data)
                })
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })

                    setFetching(false)
                })

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление элемента
    const createHandler = () => {
        openPopupDocumentCreate(document.body, {
            objectId: props.buildingId || undefined,
            objectType: 'building',
            onSave: () => onSave()
        })
    }

    // Обновление элемента
    const updateHandler = (documentInfo: IDocument) => {
        openPopupDocumentCreate(document.body, {
            document: documentInfo,
            objectId: props.buildingId || undefined,
            objectType: 'building',
            onSave: onSave.bind(this)
        })
    }

    // Удаление элемента из списка
    const removeHandler = (documentInfo: IDocument) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${documentInfo.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (documentInfo.id) {
                            setFetching(true)

                            DocumentService.removeDocument(documentInfo.id)
                                .then(() => {
                                    onSave()
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
    const onContextMenu = (e: React.MouseEvent, document: IDocument) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: () => updateHandler(document)},
            {text: 'Удалить', onClick: () => removeHandler(document)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.DocumentList}>
            {fetching && <Preloader/>}

            <div className={classes.header}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Название</div>
                <div className={classes.type}>Тип</div>
            </div>

            <div className={classes.addDocument} onClick={createHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <div className={classes.list}>
                {documents && documents.length ?
                    documents.map((document: IDocument) => {
                        return (
                            <div key={document.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, document)}
                            >
                                <div className={classes.id}>#{document.id}</div>
                                <div className={classes.name}>{document.name}</div>
                                <div className={classes.type}>{document.type}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не содержит документов'/>
                }
            </div>
        </div>
    )
}

DocumentList.defaultProps = defaultProps
DocumentList.displayName = 'DocumentList'

export default DocumentList