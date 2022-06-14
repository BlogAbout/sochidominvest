import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useNavigate} from 'react-router-dom'
import {declension} from '../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import {IBuilding} from '../../../@types/IBuilding'
import {ISelector} from '../../../@types/ISelector'
import {IFilterParams} from '../../../@types/IFilter'
import {buildingTypes, getDistrictText, getPassedText} from '../../../helpers/buildingHelper'
import BuildingService from '../../../api/BuildingService'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import Button from '../../../components/form/Button/Button'
import openPopupBuildingFilter from '../../../components/popup/PopupBuildingFilter/PopupBuildingFilter'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import classes from './BuildingPage.module.scss'

const cx = classNames.bind(classes)

const BuildingPage: React.FC = () => {
    const navigate = useNavigate()

    const initState: IFilterParams = {
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
    }

    const [isUpdate, setIsUpdate] = useState(true)
    const [buildings, setBuildings] = useState<IBuilding[]>()
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)
    const [filters, setFilters] = useState<IFilterParams>(initState)

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

    useEffect(() => {
        onFilterBuildingHandler(filters)
    }, [buildings])

    const onFilterBuildingHandler = (filtersParams: IFilterParams) => {
        setFilters(filtersParams)

        if (!buildings || !buildings.length) {
            setFilterBuilding([])
        } else {
            const prepareBuildings: IBuilding[] = buildings.filter((item: IBuilding) => {
                return ((!filtersParams.houseClass || !filtersParams.houseClass.length) || (filtersParams.houseClass && item.houseClass && filtersParams.houseClass.includes(item.houseClass))) &&
                    ((!filtersParams.material || !filtersParams.material.length) || (filtersParams.material && item.material && filtersParams.material.includes(item.material))) &&
                    ((!filtersParams.houseType || !filtersParams.houseType.length) || (filtersParams.houseType && item.houseType && filtersParams.houseType.includes(item.houseType))) &&
                    ((!filtersParams.entranceHouse || !filtersParams.entranceHouse.length) || (filtersParams.entranceHouse && item.entranceHouse && filtersParams.entranceHouse.includes(item.entranceHouse))) &&
                    ((!filtersParams.parking || !filtersParams.parking.length) || (filtersParams.parking && item.parking && filtersParams.parking.includes(item.parking))) &&
                    ((!filtersParams.territory || !filtersParams.territory.length) || (filtersParams.territory && item.territory && filtersParams.territory.includes(item.territory))) &&
                    ((!filtersParams.gas || !filtersParams.gas.length) || (filtersParams.gas && item.gas && filtersParams.gas.includes(item.gas))) &&
                    ((!filtersParams.electricity || !filtersParams.electricity.length) || (filtersParams.electricity && item.electricity && filtersParams.electricity.includes(item.electricity))) &&
                    ((!filtersParams.sewerage || !filtersParams.sewerage.length) || (filtersParams.sewerage && item.sewerage && filtersParams.sewerage.includes(item.sewerage))) &&
                    ((!filtersParams.waterSupply || !filtersParams.waterSupply.length) || (filtersParams.waterSupply && item.waterSupply && filtersParams.waterSupply.includes(item.waterSupply)))
            })

            setFilterBuilding(prepareBuildings)
        }
    }

    const renderBuildingItem = (building: IBuilding) => {
        const buildingType = buildingTypes.find((item: ISelector) => item.key === building.type)
        const passedInfo = getPassedText(building.passed)
        const districtText = getDistrictText(building.district, building.districtZone)

        return (
            <div key={building.id} className={classes.item} onClick={() => navigate('/building/' + building.id)}>
                <div className={cx({'itemImage': true, 'noImage': !building.images || !building.images.length})}>
                    {building.avatar ?
                        <img src={'https://api.sochidominvest.ru/uploads/image/thumb/' + building.avatar}
                             alt={building.name}/>
                        : null
                    }
                </div>

                <div className={classes.itemContainer}>
                    <div className={classes.information}>
                        <div className={classes.icon} title={`Просмотры: ${building.views}`}>
                            <FontAwesomeIcon icon='eye'/>
                            <span>{building.views}</span>
                        </div>

                        <div className={classes.icon} title={`Дата публикации: ${building.dateCreated}`}>
                            <FontAwesomeIcon icon='calendar'/>
                            <span>{building.dateCreated}</span>
                        </div>
                    </div>

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
            <PageInfo title='Недвижимость'/>

            <div className={classes.Content}>
                <div className={classes.container}>
                    <Title type={1}
                           showButtonFilter={true}
                           onFilter={() => {
                               openPopupBuildingFilter(document.body, {
                                   filters: filters,
                                   onChange: onFilterBuildingHandler.bind(this)
                               })
                           }}
                    >Недвижимость</Title>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {filterBuilding && filterBuilding.length ?
                            filterBuilding.map((building: IBuilding) => renderBuildingItem(building))
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