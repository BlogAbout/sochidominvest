import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import openPopupDocumentCreate from '../../../components/PopupDocumentCreate/PopupDocumentCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import Button from '../../../components/Button/Button'
import DocumentList from '../../../components/DocumentList/DocumentList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import {IDocument} from '../../../@types/IDocument'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './DocumentPagePanel.module.scss'

const DocumentPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDocument, setFilterDocument] = useState<IDocument[]>([])

    const {role} = useTypedSelector(state => state.userReducer)
    const {documents, fetching} = useTypedSelector(state => state.documentReducer)
    const {fetchDocumentList} = useActions()

    useEffect(() => {
        if (isUpdate || !documents.length) {
            fetchDocumentList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [documents])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!documents || !documents.length) {
            setFilterDocument([])
        }

        if (value !== '') {
            setFilterDocument(documents.filter((document: IDocument) => {
                return document.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterDocument(documents)
        }
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
        <main className={classes.DocumentPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Документы - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type='save' icon='file-lines' onClick={() => console.log('add')}>Файлы</Button>

                <Button type='save' icon='link' onClick={() => console.log('add')}>Ссылки</Button>

                <Button type='save' icon='file-invoice' onClick={() => console.log('add')}>Конструктор</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Документы</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={onContextMenu.bind(this)}>Добавить</Button>
                        : null
                    }
                </h1>

                <DocumentList documents={filterDocument} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

DocumentPagePanel.displayName = 'DocumentPagePanel'

export default DocumentPagePanel