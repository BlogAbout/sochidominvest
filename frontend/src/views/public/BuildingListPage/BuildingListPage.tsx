import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {useNavigate} from 'react-router-dom'
import {declension} from '../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import {IBuilding} from '../../../@types/IBuilding'
import BuildingService from '../../../api/BuildingService'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import classes from './BuildingListPage.module.scss'
import {buildingTypes} from "../../../helpers/buildingHelper";
import {ISelector} from "../../../@types/ISelector";

const cx = classNames.bind(classes)

const BuildingListPage: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [buildings, setBuildings] = useState<IBuilding[]>()
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        setFetching(true)

        BuildingService.fetchBuildings({active: [1], publish: 1})
            .then((response: any) => {
                setBuildings(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                setFetching(false)
                setIsUpdate(false)
            })
    }, [isUpdate])

    const renderBuildingItem = (building: IBuilding) => {
        const buildingType = buildingTypes.find((item: ISelector) => item.key === building.type)

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
                        {buildingType && <div className={classes.type}>{buildingType.text}</div>}

                        {building.type === 'building' ?
                            <div className={classes.counter}>
                                {declension(building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], false)} от {numberWithSpaces(round(building.costMin || 0, 0))} руб.
                            </div>
                            :
                            <div className={classes.counter}>
                                {numberWithSpaces(round(building.cost || 0, 0))} руб.
                            </div>
                        }

                        {building.type === 'building' ?
                            <div className={classes.area}>
                                <h3>Площади</h3>
                                <div>{building.areaMin || 0} м<sup>2</sup> - {building.areaMax || 0} м<sup>2</sup></div>
                            </div>
                            :
                            <div className={classes.area}>
                                <h3>Площадь</h3>
                                <div>{building.area || 0} м<sup>2</sup></div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className={classes.BuildingListPage}>
            <div className={classes.Content}>
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
            </div>
        </main>
    )
}

BuildingListPage.displayName = 'BuildingListPage'

export default BuildingListPage