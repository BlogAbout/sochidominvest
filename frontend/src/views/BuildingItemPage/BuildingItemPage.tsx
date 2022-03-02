import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import {IBuilding} from '../../@types/IBuilding'
import Button from '../../components/Button/Button'
import Empty from '../../components/Empty/Empty'
import Preloader from '../../components/Preloader/Preloader'
import BlockingElement from '../../components/BlockingElement/BlockingElement'
import openPopupBuildingCreate from '../../components/PopupBuildingCreate/PopupBuildingCreate'
import classes from './BuildingItemPage.module.scss'

type BuildingItemPageParams = {
    id: string
}

const BuildingItemPage: React.FC = (props) => {
    const params = useParams<BuildingItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [building, setBuilding] = useState<IBuilding>({} as IBuilding)

    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate || !buildings.length) {
            fetchBuildingList()

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const buildingId = parseInt(params.id)
            const buildingInfo = buildings.find((user: IBuilding) => building.id === buildingId)

            if (buildingInfo) {
                setBuilding(buildingInfo)
            }
        }
    }, [buildings])

    // Редактирование объекта
    const onClickEditHandler = () => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    return (
        <div className={classes.BuildingItemPage}>
            <div className={classes.Content}>
                {fetching && <Preloader/>}

                <h1>
                    <span>{building.name}</span>
                    <Button type='apply' icon='plus' onClick={onClickEditHandler.bind(this)}>Редактировать</Button>
                </h1>

                <div className={classes.information}>
                    {!building || !building.id ?
                        <Empty message='Объект недвижимости не найден'/>
                        :
                        <BlockingElement fetching={fetching} className={classes.container}>

                        </BlockingElement>
                    }
                </div>
            </div>
        </div>
    )
}

BuildingItemPage.displayName = 'BuildingItemPage'

export default BuildingItemPage