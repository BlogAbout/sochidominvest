import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {useNavigate} from 'react-router-dom'
import {declension} from '../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import {IBuilding} from '../../../@types/IBuilding'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import HeaderDefault from '../../../components/HeaderDefault/HeaderDefault'
import FooterDefault from '../../../components/FooterDefault/FooterDefault'
import Empty from '../../../components/Empty/Empty'
import classes from './BuildingListPage.module.scss'

const cx = classNames.bind(classes)

const BuildingListPage: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)

    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate) {
            fetchBuildingList({active: [1], publish: 1})

            setIsUpdate(false)
        }
    }, [isUpdate])

    const renderBuildingItem = (building: IBuilding) => {
        return (
            <div key={building.id} className={classes.item} onClick={() => navigate('/building/' + building.id)}>
                <div className={cx({'itemImage': true, 'noImage': !building.images || !building.images.length})}>
                    {building.images && building.images.length ?
                        <img src={'https://api.sochidominvest.ru' + building.images[0].value} alt={building.name}/>
                        : null
                    }
                </div>

                <div className={classes.itemContainer}>
                    <div className={classes.itemContent}>
                        <h2>{building.name}</h2>
                        <div className={classes.address}>{building.address}</div>
                    </div>

                    <div className={classes.itemInfo}>
                        <div className={classes.counter}>
                            {declension(building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], false)} от {numberWithSpaces(round(building.costMin || 0, 0))} руб.
                        </div>

                        <div className={classes.area}>
                            <h3>Площади</h3>
                            <div>{building.areaMin || 0} м<sup>2</sup> - {building.areaMax || 0} м<sup>2</sup></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className={classes.BuildingListPage}>
            <div className={classes.Content}>
                <HeaderDefault/>

                <div className={classes.container}>
                    <h1>
                        <span>Недвижимость</span>
                    </h1>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {buildings && buildings.length ?
                            buildings.map((building: IBuilding) => renderBuildingItem(building))
                            : <Empty message='Нет объектов недвижимости'/>
                        }
                    </BlockingElement>
                </div>

                <FooterDefault/>
            </div>
        </main>
    )
}

BuildingListPage.displayName = 'BuildingListPage'

export default BuildingListPage