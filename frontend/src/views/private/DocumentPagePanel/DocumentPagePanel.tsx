import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {compareText} from '../../../helpers/filterHelper'
import openPopupDocumentCreate from '../../../components/PopupDocumentCreate/PopupDocumentCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import Button from '../../../components/form/Button/Button'
import DocumentList from '../../../components/DocumentList/DocumentList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import {IDocument} from '../../../@types/IDocument'
import {IFilterContent} from '../../../@types/IFilter'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './DocumentPagePanel.module.scss'

const DocumentPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDocument, setFilterDocument] = useState<IDocument[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({})

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
    }, [documents, selectedType, filters])

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
            setFilterDocument(filterItemsHandler(documents.filter((document: IDocument) => {
                return (!selectedType.length || selectedType.includes(document.type)) && compareText(document.name, value)
            })))
        } else {
            setFilterDocument(filterItemsHandler(!selectedType.length ? documents : documents.filter((document: IDocument) => selectedType.includes(document.type))))
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

        openContextMenu(e.currentTarget, menuItems)
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IDocument[]) => {
        if (!list || !list.length) {
            return []
        }

        return list
        // Todo: Придумать фильтры
        // return list.filter((item: IDocument) => {
        //     return filters.block.includes(String(item.block))
        // })
    }

    const filtersContent: IFilterContent[] = []

    return (
        <main className={classes.DocumentPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Документы - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <SidebarLeft filters={filtersContent}/>

            <div className={classes.filter}>
                <Button type={selectedType.includes('file') ? 'regular' : 'save'}
                        icon='file-lines'
                        onClick={() => onClickFilterButtonHandler('file')}
                >Файлы</Button>

                <Button type={selectedType.includes('link') ? 'regular' : 'save'}
                        icon='link'
                        onClick={() => onClickFilterButtonHandler('link')}
                >Ссылки</Button>

                <Button type={selectedType.includes('constructor') ? 'regular' : 'save'}
                        icon='file-invoice'
                        onClick={() => onClickFilterButtonHandler('constructor')}
                >Конструктор</Button>

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