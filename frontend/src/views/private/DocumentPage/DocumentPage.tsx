import React, {useEffect, useState} from 'react'
import openPopupDocumentCreate from '../../../components/PopupDocumentCreate/PopupDocumentCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import Button from '../../../components/Button/Button'
import DocumentList from '../../../components/DocumentList/DocumentList'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './DocumentPage.module.scss'

const DocumentPage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)

    const {documents, fetching} = useTypedSelector(state => state.documentReducer)
    const {fetchDocumentList} = useActions()

    useEffect(() => {
        if (isUpdate || !documents.length) {
            fetchDocumentList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Меню выбора создания объекта
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Загрузить документ',
                onClick: () => openPopupDocumentCreate(document.body, {
                    type: 'file',
                    onSave: () => {
                        onSave()
                    }
                })
            },
            {
                text: 'Ссылка на документ',
                onClick: () => openPopupDocumentCreate(document.body, {
                    type: 'link',
                    onSave: () => {
                        onSave()
                    }
                })
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
        <main className={classes.DocumentPage}>
            <div className={classes.Content}>
                <h1>
                    <span>Документы</span>
                    <Button type='apply' icon='plus' onClick={onContextMenu.bind(this)}>Добавить</Button>
                </h1>

                <DocumentList documents={documents} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

DocumentPage.displayName = 'DocumentPage'

export default DocumentPage