import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import Button from '../../../components/Button/Button'
import openPopupBuildingCreate from '../../../components/PopupBuildingCreate/PopupBuildingCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import BuildingList from '../../../components/BuildingList/BuildingList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import {IBuilding} from '../../../@types/IBuilding'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './BuildingPagePanel.module.scss'

const BuildingPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])

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
    }, [buildings, selectedType])

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
            setFilterBuilding(buildings.filter((building: IBuilding) => {
                return (!selectedType.length || selectedType.includes(building.type)) &&
                    (building.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    (building.address && building.address.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1))
            }))
        } else {
            setFilterBuilding(!selectedType.length ? buildings : buildings.filter((building: IBuilding) => selectedType.includes(building.type)))
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

    return (
        <main className={classes.BuildingPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Недвижимость - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type={selectedType.includes('building') ? 'regular' : 'save'}
                        icon={'building'}
                        onClick={() => onClickFilterButtonHandler('building')}
                >ЖК</Button>

                <Button type={selectedType.includes('apartment') ? 'regular' : 'save'}
                        icon={'house-user'}
                        onClick={() => onClickFilterButtonHandler('apartment')}
                >Квартиры</Button>

                <Button type={selectedType.includes('house') ? 'regular' : 'save'}
                        icon={'house'}
                        onClick={() => onClickFilterButtonHandler('house')}
                >Дома</Button>

                <Button type={selectedType.includes('land') ? 'regular' : 'save'}
                        icon={'tree'}
                        onClick={() => onClickFilterButtonHandler('land')}
                >Участки</Button>

                <Button type={selectedType.includes('commerce') ? 'regular' : 'save'}
                        icon={'cash-register'}
                        onClick={() => onClickFilterButtonHandler('commerce')}
                >Коммерция</Button>

                <Button type={selectedType.includes('garage') ? 'regular' : 'save'}
                        icon={'car'}
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