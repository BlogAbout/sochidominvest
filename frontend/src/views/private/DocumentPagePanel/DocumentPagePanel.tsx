import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IDocument} from '../../../@types/IDocument'
import {IFilterBase, IFilterContent} from '../../../@types/IFilter'
import DocumentService from '../../../api/DocumentService'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import Title from '../../../components/ui/Title/Title'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import DocumentListContainer from '../../../components/container/DocumentListContainer/DocumentListContainer'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupDocumentCreate from '../../../components/popup/PopupDocumentCreate/PopupDocumentCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import classes from './DocumentPagePanel.module.scss'

const DocumentPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDocument, setFilterDocument] = useState<IDocument[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({})
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('documents'))
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {documents, fetching: fetchingDocument} = useTypedSelector(state => state.documentReducer)
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
    const onSaveHandler = () => {
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

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('documents', value)
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
                        onSaveHandler()
                    }
                })
            },
            {
                text: 'Ссылка на документ',
                onClick: () => openPopupDocumentCreate(document.body, {
                    type: 'link',
                    onSave: () => {
                        onSaveHandler()
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

    // Редактирование
    const onEditHandler = (documentInfo: IDocument) => {
        openPopupDocumentCreate(document.body, {
            document: documentInfo,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (documentInfo: IDocument) => {
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
                                    onSaveHandler()
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
    const onContextMenuItem = (e: React.MouseEvent, documentInfo: IDocument) => {
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

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(documentInfo)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(documentInfo)})
            }
        }

        openContextMenu(e, menuItems)
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

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'file',
            title: 'Файлы',
            icon: 'file-lines',
            active: selectedType.includes('file'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'link',
            title: 'Ссылки',
            icon: 'link',
            active: selectedType.includes('link'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'constructor',
            title: 'Конструктор',
            icon: 'file-invoice',
            active: selectedType.includes('constructor'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.DocumentPagePanel}>
            <PageInfo title='Документы'/>

            <SidebarLeft filters={filtersContent}/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       activeLayout={layout}
                       layouts={['list', 'till']}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onContextMenu.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Документы</Title>

                <DocumentListContainer documents={filterDocument}
                                       fetching={fetching || fetchingDocument}
                                       layout={layout}
                                       onClick={() => {
                                       }}
                                       onEdit={onEditHandler.bind(this)}
                                       onRemove={onRemoveHandler.bind(this)}
                                       onContextMenu={onContextMenuItem.bind(this)}
                />
            </div>
        </main>
    )
}

DocumentPagePanel.displayName = 'DocumentPagePanel'

export default DocumentPagePanel