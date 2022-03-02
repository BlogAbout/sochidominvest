import React, {useEffect, useState} from 'react'
import Button from '../../components/Button/Button'
import openPopupBuildingCreate from '../../components/PopupBuildingCreate/PopupBuildingCreate'
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
            fetchBuildingList()

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    const onClickAddHandler = () => {
        openPopupBuildingCreate(document.body, {
            onSave: () => onSave()
        })
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
                    <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
                </h1>

                <BuildingList buildings={buildings} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

BuildingPage.displayName = 'BuildingPage'

export default BuildingPage