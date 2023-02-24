import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {IDocument} from '../../../../../@types/IDocument'
import DocumentService from '../../../../../api/DocumentService'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../ui/Empty/Empty'
import openPopupAlert from '../../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import openPopupDocumentCreate from '../../../PopupDocumentCreate/PopupDocumentCreate'
import Preloader from '../../../../ui/Preloader/Preloader'
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

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate && props.buildingId) {
            DocumentService.fetchDocuments({active: [0, 1], objectId: [props.buildingId], objectType: 'building'})
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

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => updateHandler(document)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(document)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const onContextMenuCreate = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Загрузить документ',
                onClick: () => {
                    openPopupDocumentCreate(document.body, {
                        objectId: props.buildingId || undefined,
                        objectType: 'building',
                        type: 'file',
                        onSave: () => onSave()
                    })
                }
            },
            {
                text: 'Ссылка на документ',
                onClick: () => {
                    openPopupDocumentCreate(document.body, {
                        objectId: props.buildingId || undefined,
                        objectType: 'building',
                        type: 'link',
                        onSave: () => onSave()
                    })
                }
            },
            {
                text: 'Сгенерировать документ',
                onClick: () => {
                    // Todo
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.DocumentList}>
            {fetching && <Preloader/>}

            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.type}>Тип</div>
            </div>

            <div className={classes.addDocument} onClick={onContextMenuCreate.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetching} className={classes.list}>
                {documents && documents.length ?
                    documents.map((document: IDocument) => {
                        let type = ''
                        switch (document.type) {
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
                            <div key={document.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, document)}
                            >
                                <div className={classes.name}>{document.name}</div>
                                <div className={classes.type}>{type}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не содержит документов'/>
                }
            </BlockingElement>
        </div>
    )
}

DocumentList.defaultProps = defaultProps
DocumentList.displayName = 'DocumentList'

export default DocumentList