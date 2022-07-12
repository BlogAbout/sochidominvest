import React, {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import {compareText} from '../../../helpers/filterHelper'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import BuildingService from '../../../api/BuildingService'
import FavoriteService from '../../../api/FavoriteService'
import CompilationService from '../../../api/CompilationService'
import {changeLayout, getLayout, getSetting} from '../../../helpers/utilHelper'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import BuildingListContainer from '../../../components/container/BuildingListContainer/BuildingListContainer'
import {IBuilding} from '../../../@types/IBuilding'
import {IFilterContent} from '../../../@types/IFilter'
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
    buildingTypes,
    buildingWaterSupply,
    checkBuildingByDistrict,
    checkBuildingByRangeArea,
    checkBuildingByRangeCost
} from '../../../helpers/buildingHelper'
import classes from './BuildingPagePanel.module.scss'

const BuildingPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const refScrollerContainer = useRef(null)

    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState<any>({
        buildingCost: {min: 0, max: 0},
        buildingArea: {min: 0, max: 0},
        buildingDistrictZone: [],
        buildingType: [],
        houseClass: [],
        material: [],
        houseType: [],
        entranceHouse: [],
        parking: [],
        territory: [],
        gas: [],
        heating: [],
        electricity: [],
        sewerage: [],
        waterSupply: []
    })
    const [layout, setLayout] = useState<'list' | 'till' | 'map'>(getLayout('buildings'))
    const [fetching, setFetching] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [countPerPage, setCountPerPage] = useState(20)
    const [apiKey, setApiKey] = useState('3ed788dc-edd5-4bce-8720-6cd8464b45bd')
    const [presetIcon, setPresetIcon] = useState('islands#blueIcon')

    const {role} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching: fetchingBuilding} = useTypedSelector(state => state.buildingReducer)
    const {settings} = useTypedSelector(state => state.administrationReducer)
    const {fetchBuildingList} = useActions()

    const [readMoreElementRef] = useInfiniteScroll(
        currentPage * countPerPage < buildings.length
            ? () => setCurrentPage(currentPage + 1)
            : () => {
            },
        fetching
    )

    useEffect(() => {
        if (isUpdate || !buildings.length) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [buildings, filters])

    useEffect(() => {
        if (settings) {
            setCountPerPage(parseInt(getSetting('count_items_admin', settings)))
            setApiKey(getSetting('map_api_key', settings))
            setPresetIcon(getSetting('map_icon_color', settings))
        }
    }, [settings])

    useEffect(() => {
        onScrollContainerTopHandler(refScrollerContainer)
    }, [countPerPage, filterBuilding])

    const onScrollContainerTopHandler = (refElement: React.MutableRefObject<any>) => {
        if (refElement && currentPage > 1) {
            refElement.current.scrollTop = 0
            setCurrentPage(1)
        }
    }

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
                return compareText(building.name, value) || (building.address && compareText(building.address, value))
            })))
        } else {
            setFilterBuilding(filterItemsHandler(buildings))
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till' | 'map') => {
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

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IBuilding[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IBuilding) => {
            return checkBuildingByRangeCost(item, filters) &&
                checkBuildingByRangeArea(item, filters) &&
                checkBuildingByDistrict(item, filters) &&
                ((!filters.buildingType || !filters.buildingType.length) || (filters.buildingType && item.type && filters.buildingType.includes(item.type))) &&
                ((!filters.houseClass || !filters.houseClass.length) || (filters.houseClass && item.houseClass && filters.houseClass.includes(item.houseClass))) &&
                ((!filters.material || !filters.material.length) || (filters.material && item.material && filters.material.includes(item.material))) &&
                ((!filters.houseType || !filters.houseType.length) || (filters.houseType && item.houseType && filters.houseType.includes(item.houseType))) &&
                ((!filters.entranceHouse || !filters.entranceHouse.length) || (filters.entranceHouse && item.entranceHouse && filters.entranceHouse.includes(item.entranceHouse))) &&
                ((!filters.parking || !filters.parking.length) || (filters.parking && item.parking && filters.parking.includes(item.parking))) &&
                ((!filters.territory || !filters.territory.length) || (filters.territory && item.territory && filters.territory.includes(item.territory))) &&
                ((!filters.gas || !filters.gas.length) || (filters.gas && item.gas && filters.gas.includes(item.gas))) &&
                ((!filters.electricity || !filters.electricity.length) || (filters.electricity && item.electricity && filters.electricity.includes(item.electricity))) &&
                ((!filters.sewerage || !filters.sewerage.length) || (filters.sewerage && item.sewerage && filters.sewerage.includes(item.sewerage))) &&
                ((!filters.waterSupply || !filters.waterSupply.length) || (filters.waterSupply && item.waterSupply && filters.waterSupply.includes(item.waterSupply)))
        })
    }

    const filtersContent: IFilterContent[] = [
        {
            title: 'Стоимость',
            type: 'ranger',
            rangerParams: {
                suffix: 'руб.',
                step: 1,
                max: 999999999,
                afterComma: 0
            },
            multi: false,
            selected: filters.buildingCost,
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingCost: values})
            }
        },
        {
            title: 'Площадь',
            type: 'ranger',
            rangerParams: {
                suffix: 'м2.',
                step: 0.01,
                max: 999,
                afterComma: 2
            },
            multi: false,
            selected: filters.buildingArea,
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingArea: values})
            }
        },
        {
            title: 'Район',
            type: 'district',
            multi: true,
            selected: filters.buildingDistrictZone,
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingDistrictZone: values})
            }
        },
        {
            title: 'Тип недвижимости',
            type: 'checker',
            multi: true,
            items: buildingTypes,
            selected: filters.buildingType,
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingType: values})
            }
        },
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

    return (
        <main className={classes.BuildingPagePanel}
              style={{height: layout === 'map' ? '100%' : undefined}}
        >
            <PageInfo title='Недвижимость'/>

            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <div className={classes.Content} style={{height: layout === 'map' ? '100%' : undefined}}>
                <Title type={1}
                       activeLayout={layout}
                       layouts={['list', 'till', 'map']}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onContextMenu.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                       showFilter
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       showSearch
                       valueSearch={searchText}
                       onSearch={search.bind(this)}
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
                                       refScrollerContainer={refScrollerContainer}
                                       refContainerMore={readMoreElementRef}
                                       currentPage={currentPage}
                                       countPerPage={countPerPage}
                                       mapApiKey={apiKey}
                                       mapPresetIcon={presetIcon}
                />
            </div>
        </main>
    )
}

BuildingPagePanel.displayName = 'BuildingPagePanel'

export default BuildingPagePanel