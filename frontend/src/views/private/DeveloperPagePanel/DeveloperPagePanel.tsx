import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IFilterBase, IFilterContent} from '../../../@types/IFilter'
import DeveloperService from '../../../api/DeveloperService'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import Title from '../../../components/ui/Title/Title'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import DeveloperListContainer from '../../../components/container/DeveloperListContainer/DeveloperListContainer'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupDeveloperCreate from '../../../components/popup/PopupDeveloperCreate/PopupDeveloperCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './DeveloperPagePanel.module.scss'

const DeveloperPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDeveloper, setFilterDeveloper] = useState<IDeveloper[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({})
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('developers'))
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {developers, fetching: fetchingDeveloper} = useTypedSelector(state => state.developerReducer)
    const {fetchDeveloperList} = useActions()

    useEffect(() => {
        if (isUpdate || !developers.length) {
            fetchDeveloperList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [developers, selectedType, filters])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!developers || !developers.length) {
            setFilterDeveloper([])
        }

        if (value !== '') {
            setFilterDeveloper(filterItemsHandler(developers.filter((developer: IDeveloper) => {
                return (!selectedType.length || selectedType.includes(developer.type)) &&
                    (compareText(developer.name, value) || compareText(developer.address, value) || compareText(developer.phone, value.toLocaleLowerCase()))
            })))
        } else {
            setFilterDeveloper(filterItemsHandler(!selectedType.length ? developers : developers.filter((developer: IDeveloper) => selectedType.includes(developer.type))))
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('developers', value)
    }

    const onClickHandler = (developer: IDeveloper) => {
        navigate('/panel/developer/' + developer.id)
    }

    // Добавление нового застройщика
    const onAddHandler = () => {
        openPopupDeveloperCreate(document.body, {
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Редактирование
    const onEditHandler = (developer: IDeveloper) => {
        openPopupDeveloperCreate(document.body, {
            developer: developer,
            onSave: () => {
                onSaveHandler()
            }
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
    const onContextMenu = (e: React.MouseEvent, developer: IDeveloper) => {
        e.preventDefault()

        const menuItems = [{text: 'Открыть', onClick: () => navigate('/panel/developer/' + developer.id)}]

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(developer)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(developer)})
            }

            openContextMenu(e, menuItems)
        }
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
    const filterItemsHandler = (list: IDeveloper[]) => {
        if (!list || !list.length) {
            return []
        }

        return list
        // Todo: Придумать фильтры
        // return list.filter((item: IDeveloper) => {
        //     return filters.block.includes(String(item.block))
        // })
    }

    const filtersContent: IFilterContent[] = []

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'constructionCompany',
            title: 'Строительные компании',
            icon: 'building-columns',
            active: selectedType.includes('constructionCompany'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.DeveloperPagePanel}>
            <PageInfo title='Застройщики'/>

            <SidebarLeft filters={filtersContent}/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       layout={layout}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                       showChangeLayout
                >Застройщики</Title>

                <DeveloperListContainer developers={filterDeveloper}
                                        fetching={fetching || fetchingDeveloper}
                                        layout={layout}
                                        onClick={onClickHandler.bind(this)}
                                        onEdit={onEditHandler.bind(this)}
                                        onRemove={onRemoveHandler.bind(this)}
                                        onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

DeveloperPagePanel.displayName = 'DeveloperPagePanel'

export default DeveloperPagePanel