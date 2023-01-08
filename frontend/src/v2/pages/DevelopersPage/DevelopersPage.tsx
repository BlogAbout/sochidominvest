import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {developerTypes} from '../../../helpers/developerHelper'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {allowForRole, allowForTariff} from '../../helpers/accessHelper'
import {RouteNames} from '../../helpers/routerHelper'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IFilter, IFilterContent} from '../../../@types/IFilter'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import DeveloperService from '../../../api/DeveloperService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import DeveloperList from './components/DeveloperList/DeveloperList'
import DeveloperTill from './components/DeveloperTill/DeveloperTill'
import openPopupDeveloperCreate from '../../../components/popup/PopupDeveloperCreate/PopupDeveloperCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './DevelopersPage.module.scss'

const DevelopersPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [developers, setDevelopers] = useState<IDeveloper[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterDeveloper, setFilterDeveloper] = useState<IDeveloper[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['constructionCompany']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('developers'))

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchDevelopersHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [developers, filters])

    const fetchDevelopersHandler = () => {
        setFetching(true)

        const filter: IFilter = {active: [0, 1]}

        if (user && user.id && user.role === 'subscriber' && allowForTariff(['base', 'business', 'effectivePlus'], user.tariff)) {
            filter.author = [user.id]
        }

        DeveloperService.fetchDevelopers(filter)
            .then((response: any) => setDevelopers(response.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchDevelopersHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!developers || !developers.length) {
            setFilterDeveloper([])
        }

        if (value !== '') {
            setFilterDeveloper(filterItemsHandler(developers.filter((developer: IDeveloper) => {
                return compareText(developer.name, value) || compareText(developer.address, value) || compareText(developer.phone, value.toLocaleLowerCase())
            })))
        } else {
            setFilterDeveloper(filterItemsHandler(developers))
        }
    }

    const onClickHandler = (developer: IDeveloper) => {
        navigate(`${RouteNames.P_DEVELOPER}/${developer.id}`)
    }

    const onAddHandler = () => {
        openPopupDeveloperCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование
    const onEditHandler = (developer: IDeveloper) => {
        openPopupDeveloperCreate(document.body, {
            developer: developer,
            onSave: () => onSaveHandler()
        })
    }

    // Удаление
    const onRemoveHandler = (developer: IDeveloper) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${developer.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (developer.id) {
                            setFetching(true)

                            DeveloperService.removeDeveloper(developer.id)
                                .then(() => onSaveHandler())
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
    const onContextMenuHandler = (developer: IDeveloper, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [{text: 'Открыть', onClick: () => navigate('/developer/' + developer.id)}]

        if (allowForRole(['director', 'administrator', 'manager'])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(developer)})

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(developer)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('developers', value)
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IDeveloper[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IDeveloper) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: developerTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Застройщики'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Застройщики</Title>

                {layout === 'till'
                    ? <DeveloperTill list={filterDeveloper}
                                     fetching={fetching}
                                     onClick={(developer: IDeveloper) => onClickHandler(developer)}
                                     onContextMenu={(developer: IDeveloper, e: React.MouseEvent) => onContextMenuHandler(developer, e)}
                    />
                    : <DeveloperList list={filterDeveloper}
                                     fetching={fetching}
                                     onClick={(developer: IDeveloper) => onClickHandler(developer)}
                                     onContextMenu={(developer: IDeveloper, e: React.MouseEvent) => onContextMenuHandler(developer, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

DevelopersPage.displayName = 'DevelopersPage'

export default React.memo(DevelopersPage)