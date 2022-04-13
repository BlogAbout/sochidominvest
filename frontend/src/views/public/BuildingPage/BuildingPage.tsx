import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useNavigate} from 'react-router-dom'
import {declension} from '../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import {IBuilding} from '../../../@types/IBuilding'
import {ISelector} from '../../../@types/ISelector'
import {buildingTypes, getDistrictText, getPassedText} from '../../../helpers/buildingHelper'
import BuildingService from '../../../api/BuildingService'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import classes from './BuildingPage.module.scss'

const cx = classNames.bind(classes)

const BuildingPage: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [buildings, setBuildings] = useState<IBuilding[]>()
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if (isUpdate) {
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
        }
    }, [isUpdate])

    const renderBuildingItem = (building: IBuilding) => {
        const buildingType = buildingTypes.find((item: ISelector) => item.key === building.type)
        const passedInfo = getPassedText(building.passed)
        const districtText = getDistrictText(building.district, building.districtZone)

        return (
            <div key={building.id} className={classes.item} onClick={() => navigate('/building/' + building.id)}>
                <div className={cx({'itemImage': true, 'noImage': !building.images || !building.images.length})}>
                    {building.avatar ?
                        <img src={'https://api.sochidominvest.ru/uploads/thumbs/400/' + building.avatar} alt={building.name}/>
                        : null
                    }
                </div>

                <div className={classes.itemContainer}>
                    <span className={classes.views} title={`Просмотров: ${building.views}`}>
                        <FontAwesomeIcon icon='eye'/> {building.views}
                    </span>

                    <div className={classes.itemContent}>
                        <h2>{building.name}</h2>

                        <div className={classes.address}>
                            {districtText !== '' && <span>{districtText}</span>}
                            <span>{building.address}</span>
                        </div>
                    </div>

                    <div className={classes.itemInfo}>
                        {buildingType && <div className={classes.type}>{buildingType.text}</div>}

                        {passedInfo !== '' &&
                        <div className={cx({
                            'passed': true,
                            'is': building.passed && building.passed.is
                        })}>
                            <span>{passedInfo}</span>
                        </div>}

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
        <main className={classes.BuildingPage}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Недвижимость - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

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

BuildingPage.displayName = 'BuildingPage'

export default BuildingPage