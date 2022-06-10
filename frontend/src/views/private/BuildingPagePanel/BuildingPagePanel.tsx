import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {compareText} from '../../../helpers/filterHelper'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import BuildingService from '../../../api/BuildingService'
import FavoriteService from '../../../api/FavoriteService'
import CompilationService from '../../../api/CompilationService'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import Title from '../../../components/ui/Title/Title'
import BuildingListContainer from '../../../components/container/BuildingListContainer/BuildingListContainer'
import {IBuilding} from '../../../@types/IBuilding'
import {IFilterBase, IFilterContent} from '../../../@types/IFilter'
import {ISelector} from '../../../@types/ISelector'
import {
    buildingClasses,
    buildingElectricity,
    buildingEntrance,
    buildingFormat,
    buildingGas,
    buildingHeating,
    buildingMaterials,
    buildingParking,
    buildingSewerage,
    buildingTerritory,
    buildingWaterSupply
} from '../../../helpers/buildingHelper'
import classes from './BuildingPagePanel.module.scss'

const BuildingPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({
        houseClass: buildingClasses.map((item: ISelector) => item.key),
        material: buildingMaterials.map((item: ISelector) => item.key),
        houseType: buildingFormat.map((item: ISelector) => item.key),
        entranceHouse: buildingEntrance.map((item: ISelector) => item.key),
        parking: buildingParking.map((item: ISelector) => item.key),
        territory: buildingTerritory.map((item: ISelector) => item.key),
        gas: buildingGas.map((item: ISelector) => item.key),
        heating: buildingHeating.map((item: ISelector) => item.key),
        electricity: buildingElectricity.map((item: ISelector) => item.key),
        sewerage: buildingSewerage.map((item: ISelector) => item.key),
        waterSupply: buildingWaterSupply.map((item: ISelector) => item.key)
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('buildings'))
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching: fetchingBuilding} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate || !buildings.length) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [buildings, selectedType, filters])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!buildings || !buildings.length) {
            setFilterBuilding([])
        }

        if (value !== '') {
            setFilterBuilding(filterItemsHandler(buildings.filter((building: IBuilding) => {
                return (!selectedType.length || selectedType.includes(building.type)) &&
                    (compareText(building.name, value) || (building.address && compareText(building.address, value)))
            })))
        } else {
            setFilterBuilding(filterItemsHandler(!selectedType.length ? buildings : buildings.filter((building: IBuilding) => selectedType.includes(building.type))))
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('buildings', value)
    }

    const onClickHandler = (building: IBuilding) => {
        navigate('/panel/building/' + building.id)
    }

    const onAddHandler = (type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage') => {
        openPopupBuildingCreate(document.body, {
            type: type,
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование объекта
    const onEditHandler = (building: IBuilding) => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление объекта
    const onRemoveHandler = (building: IBuilding) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${building.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (building.id) {
                            setFetching(true)

                            BuildingService.removeBuilding(building.id)
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

    // Удаление объекта из избранного
    const onRemoveBuildingFromFavoriteHandler = (building: IBuilding) => {
        if (building.id) {
            FavoriteService.removeFavorite(building.id)
                .then(() => {
                    onSaveHandler()
                })
                .catch((error: any) => {
                    console.error('Ошибка удаления из избранного', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }

    // Удаление объекта из подборки
    const onRemoveBuildingFromCompilationHandler = (building: IBuilding, compilationId?: number) => {
        if (compilationId && building.id) {
            CompilationService.removeBuildingFromCompilation(compilationId, building.id)
                .then(() => {
                    onSaveHandler()
                })
                .catch((error: any) => {
                    console.error('Ошибка удаления из подборки', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }

    // Открытие контекстного меню на элементе
    const onContextMenuItem = (e: React.MouseEvent, building: IBuilding) => {
        e.preventDefault()

        const menuItems = []

        // Todo
        // if (props.isFavorite) {
        //     menuItems.push({text: 'Удалить из избранного', onClick: () => removeBuildingFromFavorite()})
        // }
        //
        // if (props.compilationId && props.building.id) {
        //     menuItems.push({text: 'Удалить из подборки', onClick: () => removeBuildingFromCompilation()})
        // }

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(building)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(building)})
            }
        }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    // Меню выбора создания объекта
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Жилой комплекс', onClick: () => onAddHandler('building')},
            {text: 'Квартиру', onClick: () => onAddHandler('apartment')},
            {text: 'Дом', onClick: () => onAddHandler('house')},
            {text: 'Земельный участок', onClick: () => onAddHandler('land')},
            {text: 'Коммерцию', onClick: () => onAddHandler('commerce')},
            {text: 'Гараж, машиноместо', onClick: () => onAddHandler('garage')}
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
    const filterItemsHandler = (list: IBuilding[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IBuilding) => {
            return (!item.houseClass || filters.houseClass.includes(item.houseClass)) &&
                (!item.material || filters.material.includes(item.material)) &&
                (!item.houseType || filters.houseType.includes(item.houseType)) &&
                (!item.entranceHouse || filters.entranceHouse.includes(item.entranceHouse)) &&
                (!item.parking || filters.parking.includes(item.parking)) &&
                (!item.territory || filters.territory.includes(item.territory)) &&
                (!item.gas || filters.gas.includes(item.gas)) &&
                (!item.electricity || filters.electricity.includes(item.electricity)) &&
                (!item.sewerage || filters.sewerage.includes(item.sewerage)) &&
                (!item.waterSupply || filters.heating.includes(item.waterSupply))
        })
    }

    const filtersContent: IFilterContent[] = [
        {
            title: 'Класс дома',
            type: 'checker',
            multi: true,
            items: buildingClasses,
            selected: filters.houseClass,
            onSelect: (values: string[]) => {
                setFilters({...filters, houseClass: values})
            }
        },
        {
            title: 'Материал здания',
            type: 'checker',
            multi: true,
            items: buildingMaterials,
            selected: filters.material,
            onSelect: (values: string[]) => {
                setFilters({...filters, material: values})
            }
        },
        {
            title: 'Тип дома',
            type: 'checker',
            multi: true,
            items: buildingFormat,
            selected: filters.houseType,
            onSelect: (values: string[]) => {
                setFilters({...filters, houseType: values})
            }
        },
        {
            title: 'Территория',
            type: 'checker',
            multi: true,
            items: buildingEntrance,
            selected: filters.entranceHouse,
            onSelect: (values: string[]) => {
                setFilters({...filters, entranceHouse: values})
            }
        },
        {
            title: 'Паркинг',
            type: 'checker',
            multi: true,
            items: buildingParking,
            selected: filters.parking,
            onSelect: (values: string[]) => {
                setFilters({...filters, parking: values})
            }
        },
        {
            title: 'Подъезд к дому',
            type: 'checker',
            multi: true,
            items: buildingTerritory,
            selected: filters.territory,
            onSelect: (values: string[]) => {
                setFilters({...filters, territory: values})
            }
        },
        {
            title: 'Газ',
            type: 'checker',
            multi: true,
            items: buildingGas,
            selected: filters.gas,
            onSelect: (values: string[]) => {
                setFilters({...filters, gas: values})
            }
        },
        {
            title: 'Отопление',
            type: 'checker',
            multi: true,
            items: buildingHeating,
            selected: filters.heating,
            onSelect: (values: string[]) => {
                setFilters({...filters, heating: values})
            }
        },
        {
            title: 'Электричество',
            type: 'checker',
            multi: true,
            items: buildingElectricity,
            selected: filters.electricity,
            onSelect: (values: string[]) => {
                setFilters({...filters, electricity: values})
            }
        },
        {
            title: 'Канализация',
            type: 'checker',
            multi: true,
            items: buildingSewerage,
            selected: filters.sewerage,
            onSelect: (values: string[]) => {
                setFilters({...filters, sewerage: values})
            }
        },
        {
            title: 'Водоснабжение',
            type: 'checker',
            multi: true,
            items: buildingWaterSupply,
            selected: filters.waterSupply,
            onSelect: (values: string[]) => {
                setFilters({...filters, waterSupply: values})
            }
        }
    ]

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'building',
            title: 'ЖК',
            icon: 'building',
            active: selectedType.includes('building'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'apartment',
            title: 'Квартиры',
            icon: 'house-user',
            active: selectedType.includes('apartment'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'house',
            title: 'Дома',
            icon: 'house',
            active: selectedType.includes('house'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'land',
            title: 'Участки',
            icon: 'tree',
            active: selectedType.includes('land'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'commerce',
            title: 'Коммерция',
            icon: 'cash-register',
            active: selectedType.includes('commerce'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'garage',
            title: 'Гаражи',
            icon: 'car',
            active: selectedType.includes('garage'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.BuildingPagePanel}>
            <PageInfo title='Недвижимость'/>

            <SidebarLeft filters={filtersContent}/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       layout={layout}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onContextMenu.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                       showChangeLayout
                >Недвижимость</Title>

                <BuildingListContainer buildings={filterBuilding}
                                       fetching={fetching || fetchingBuilding}
                                       layout={layout}
                                       onClick={onClickHandler.bind(this)}
                                       onEdit={onEditHandler.bind(this)}
                                       onRemove={onRemoveHandler.bind(this)}
                                       onContextMenu={onContextMenuItem.bind(this)}
                                       onRemoveFromFavorite={onRemoveBuildingFromFavoriteHandler.bind(this)}
                                       onRemoveFromCompilation={onRemoveBuildingFromCompilationHandler.bind(this)}
                />
            </div>
        </main>
    )
}

BuildingPagePanel.displayName = 'BuildingPagePanel'

export default BuildingPagePanel