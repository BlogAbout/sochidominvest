import React, {useEffect, useMemo, useState} from 'react'
import {IFilter, IFilterContent} from '../../../@types/IFilter'
import {IDocument} from '../../../@types/IDocument'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {documentTypes} from '../../../helpers/documentHelper'
import {allowForTariff} from '../../helpers/accessHelper'
import {compareText} from '../../../helpers/filterHelper'
import DocumentService from '../../../api/DocumentService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import DocumentList from './components/DocumentList/DocumentList'
import openPopupDocumentCreate from '../../../components/popup/PopupDocumentCreate/PopupDocumentCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './DocumentsPage.module.scss'

const DocumentPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [documents, setDocuments] = useState<IDocument[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterDocument, setFilterDocument] = useState<IDocument[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        type: ['file', 'link', 'constructor']
    })

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchDocumentsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [documents, filters])

    const fetchDocumentsHandler = () => {
        setFetching(true)

        const filter: IFilter = {active: [0, 1]}

        if (user && user.id && user.role === 'subscriber' && allowForTariff(['base', 'business', 'effectivePlus'], user.tariff)) {
            filter.author = [user.id]
        }

        DocumentService.fetchDocuments(filter)
            .then((response: any) => setDocuments(response.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchDocumentsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!documents || !documents.length) {
            setFilterDocument([])
        }

        if (value !== '') {
            setFilterDocument(filterItemsHandler(documents.filter((document: IDocument) => {
                return compareText(document.name, value)
            })))
        } else {
            setFilterDocument(filterItemsHandler(documents))
        }
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IDocument[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IDocument) => {
            return filters.type.includes(item.type)
        })
    }

    // Меню выбора создания объекта
    const onContextMenuHandler = (e: React.MouseEvent) => {
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

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: documentTypes,
                selected: filters.type,
                onSelect: (values: string[]) => {
                    setFilters({...filters, type: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Документы'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onContextMenuHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Документы</Title>

                <DocumentList list={filterDocument} fetching={fetching} onSave={() => fetchDocumentsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

DocumentPage.displayName = 'DocumentPage'

export default React.memo(DocumentPage)