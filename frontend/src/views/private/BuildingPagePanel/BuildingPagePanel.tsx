import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {compareText} from '../../../helpers/filterHelper'
import Button from '../../../components/form/Button/Button'
import openPopupBuildingCreate from '../../../components/PopupBuildingCreate/PopupBuildingCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import BuildingList from '../../../components/BuildingList/BuildingList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import {IBuilding} from '../../../@types/IBuilding'
import {IFilterContent} from '../../../@types/IFilter'
import {ISelector} from '../../../@types/ISelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
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

    const {role} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
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
    const onSave = () => {
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

    const addHandler = (type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage') => {
        openPopupBuildingCreate(document.body, {
            type: type,
            onSave: () => onSave()
        })
    }

    // Меню выбора создания объекта
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Жилой комплекс', onClick: () => addHandler('building')},
            {text: 'Квартиру', onClick: () => addHandler('apartment')},
            {text: 'Дом', onClick: () => addHandler('house')},
            {text: 'Земельный участок', onClick: () => addHandler('land')},
            {text: 'Коммерцию', onClick: () => addHandler('commerce')},
            {text: 'Гараж, машиноместо', onClick: () => addHandler('garage')}
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

    return (
        <main className={classes.BuildingPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Недвижимость - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <SidebarLeft filters={filtersContent}/>

            <div className={classes.filter}>
                <Button type={selectedType.includes('building') ? 'regular' : 'save'}
                        icon='building'
                        onClick={() => onClickFilterButtonHandler('building')}
                >ЖК</Button>

                <Button type={selectedType.includes('apartment') ? 'regular' : 'save'}
                        icon='house-user'
                        onClick={() => onClickFilterButtonHandler('apartment')}
                >Квартиры</Button>

                <Button type={selectedType.includes('house') ? 'regular' : 'save'}
                        icon='house'
                        onClick={() => onClickFilterButtonHandler('house')}
                >Дома</Button>

                <Button type={selectedType.includes('land') ? 'regular' : 'save'}
                        icon='tree'
                        onClick={() => onClickFilterButtonHandler('land')}
                >Участки</Button>

                <Button type={selectedType.includes('commerce') ? 'regular' : 'save'}
                        icon='cash-register'
                        onClick={() => onClickFilterButtonHandler('commerce')}
                >Коммерция</Button>

                <Button type={selectedType.includes('garage') ? 'regular' : 'save'}
                        icon='car'
                        onClick={() => onClickFilterButtonHandler('garage')}
                >Гаражи</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Недвижимость</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={onContextMenu.bind(this)}>Добавить</Button>
                        : null
                    }
                </h1>

                <BuildingList buildings={filterBuilding} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

BuildingPagePanel.displayName = 'BuildingPagePanel'

export default BuildingPagePanel