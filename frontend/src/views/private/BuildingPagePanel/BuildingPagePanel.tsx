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
    }, [buildings])

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
                return building.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    (building.address && building.address.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1)
            }))
        } else {
            setFilterBuilding(buildings)
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

    return (
        <main className={classes.BuildingPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Недвижимость - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type='save' icon={'building'} onClick={() => console.log('add')}>ЖК</Button>

                <Button type='save' icon={'house-user'} onClick={() => console.log('add')}>Квартиры</Button>

                <Button type='save' icon={'house'} onClick={() => console.log('add')}>Дома</Button>

                <Button type='save' icon={'tree'} onClick={() => console.log('add')}>Участки</Button>

                <Button type='save' icon={'cash-register'} onClick={() => console.log('add')}>Коммерция</Button>

                <Button type='save' icon={'car'} onClick={() => console.log('add')}>Гаражи</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Недвижимость</span>
                    <Button type='apply' icon='plus' onClick={onContextMenu.bind(this)}>Добавить</Button>
                </h1>

                <BuildingList buildings={filterBuilding} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

BuildingPagePanel.displayName = 'BuildingPagePanel'

export default BuildingPagePanel