import React, {useEffect, useState} from 'react'
import Button from '../../components/Button/Button'
import openPopupBuildingCreate from '../../components/PopupBuildingCreate/PopupBuildingCreate'
import openContextMenu from '../../components/ContextMenu/ContextMenu'
import BuildingList from '../../components/BuildingList/BuildingList'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import classes from './BuildingPage.module.scss'

const BuildingPage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)

    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate || !buildings.length) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    const addHandler = (type: 'building' | 'apartment' | 'land' | 'commerce') => {
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
            {text: 'Участок', onClick: () => addHandler('land')},
            {text: 'Коммерцию', onClick: () => addHandler('commerce')}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <main className={classes.BuildingPage}>
            <div className={classes.filter}>
                <Button type='save' icon={'bolt'} onClick={() => console.log('add')}>Новинки</Button>

                <Button type='save' icon={'percent'} onClick={() => console.log('add')}>Акции</Button>

                <Button type='save' icon={'star'} onClick={() => console.log('add')}>Популярное</Button>

                <Button type='save' icon={'flag'} onClick={() => console.log('add')}>Незаконные</Button>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Недвижимость</span>
                    <Button type='apply' icon='plus' onClick={onContextMenu.bind(this)}>Добавить</Button>
                </h1>

                <BuildingList buildings={buildings} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

BuildingPage.displayName = 'BuildingPage'

export default BuildingPage