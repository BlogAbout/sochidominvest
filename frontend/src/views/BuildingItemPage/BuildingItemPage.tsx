import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import {declension} from '../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../helpers/numberHelper'
import CheckerService from '../../api/CheckerService'
import {IBuilding, IBuildingChecker, IBuildingHousing} from '../../@types/IBuilding'
import {IImageCarousel} from '../../@types/IImageCarousel'
import {IImageDb} from '../../@types/IImage'
import {ISelector} from '../../@types/ISelector'
import {ITag} from '../../@types/ITag'
import Button from '../../components/Button/Button'
import Empty from '../../components/Empty/Empty'
import BlockingElement from '../../components/BlockingElement/BlockingElement'
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel'
import openPopupBuildingCreate from '../../components/PopupBuildingCreate/PopupBuildingCreate'
import {
    amountContract,
    buildingAdvantages,
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
    buildingTypes,
    buildingWaterSupply,
    formalizationList,
    paymentsList
} from '../../helpers/buildingHelper'
import classes from './BuildingItemPage.module.scss'

type BuildingItemPageParams = {
    id: string
}

const BuildingItemPage: React.FC = (props) => {
    const params = useParams<BuildingItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [building, setBuilding] = useState<IBuilding>({} as IBuilding)
    const [checkers, setCheckers] = useState<IBuildingChecker[]>([])
    const [fetchingCheckers, setFetchingCheckers] = useState(false)

    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {tags} = useTypedSelector(state => state.tagReducer)
    const {fetchBuildingList, fetchTagList} = useActions()

    useEffect(() => {
        if (isUpdate || !buildings.length) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const buildingId = parseInt(params.id)
            const buildingInfo = buildings.find((building: IBuilding) => building.id === buildingId)

            if (buildingInfo) {
                setBuilding(buildingInfo)
            }
        }
    }, [buildings])

    useEffect(() => {
        if (building.id) {
            setFetchingCheckers(true)

            CheckerService.fetchCheckers(building.id)
                .then((response) => {
                    setCheckers(response.data)

                    fetchTagList()
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки шахматки', error)
                })
                .finally(() => {
                    setFetchingCheckers(false)
                })
        }
    }, [building])

    // Редактирование объекта
    const onClickEditHandler = () => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Вывод галереи
    const renderGallery = () => {
        let listImages: IImageCarousel[] = []
        if (building.images && building.images.length) {
            listImages = building.images.filter((image: IImageDb) => image.active).map((image: IImageDb) => {
                return {
                    image: 'https://api.sochidominvest.ru' + image.value,
                    alt: building.name
                }
            })
        }

        return (
            <BlockingElement fetching={fetching} className={classes.gallery}>
                <div className={classes.carousel}>
                    {listImages.length ?
                        <ImageCarousel images={listImages} alt={building.name} fancy/>
                        : <img src='https://api.sochidominvest.ru/uploads/no-image.jpg' alt={building.name}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    // Вывод базовой информации
    const renderInfo = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                {tags && tags.length && building.tags && building.tags.length ?
                    <div className={classes.tags}>
                        {building.tags.map((id: number) => {
                            const findTag = tags.find((tag: ITag) => tag.id === id)

                            return findTag ? <div key={findTag.id}>{findTag.name}</div> : null
                        })}
                    </div>
                    : null
                }

                <h1>{building.name}</h1>
                <div className={classes.address}>{building.address}</div>

                <div className={classes.container}>
                    <div className={classes.row}>
                        <span>{building.countCheckers || 0}</span>
                        <span>{declension(building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], true)}</span>
                    </div>

                    <div className={classes.row}>
                        <span>{numberWithSpaces(round(building.costMinUnit || 0, 0))} руб.</span>
                        <span>Мин. цена за м<sup>2</sup></span>
                    </div>

                    <div className={classes.row}>
                        <span>{numberWithSpaces(round(building.costMin || 0, 0))} руб.</span>
                        <span>Мин. цена</span>
                    </div>

                    <div className={classes.row}>
                        <span>{building.areaMin || 0} - {building.areaMax || 0}</span>
                        <span>Площади, м<sup>2</sup></span>
                    </div>
                </div>

                <div className={classes.container}>
                    <Button type='apply'
                            icon='pen-to-square'
                            onClick={onClickEditHandler.bind(this)}
                            className='marginRight'
                            title='Редактировать'
                    />
                    <Button type='regular'
                            icon='plus'
                            onClick={onClickEditHandler.bind(this)}
                            className='marginRight'
                            title='Добавить в подборку'
                    />
                    <Button type='regular'
                            icon='heart'
                            onClick={onClickEditHandler.bind(this)}
                            className='marginRight'
                            title='Добавить в избранное'
                    />
                    <Button type='regular'
                            icon='arrow-up-from-bracket'
                            onClick={onClickEditHandler.bind(this)}
                            className='marginRight'
                            title='Поделиться ссылкой'
                    />
                    <Button type='regular'
                            icon='print'
                            onClick={onClickEditHandler.bind(this)}
                            title='Печать информации'
                    />
                </div>
            </BlockingElement>
        )
    }

    // Вывод подробной информации
    const renderAdvanced = () => {
        const houseClass = buildingClasses.find(item => item.key === building.houseClass)
        const material = buildingMaterials.find(item => item.key === building.material)
        const houseType = buildingFormat.find(item => item.key === building.houseType)
        const entranceHouse = buildingEntrance.find(item => item.key === building.entranceHouse)
        const parking = buildingParking.find(item => item.key === building.parking)
        const territory = buildingTerritory.find(item => item.key === building.territory)
        const gas = buildingGas.find(item => item.key === building.gas)
        const heating = buildingHeating.find(item => item.key === building.heating)
        const electricity = buildingElectricity.find(item => item.key === building.electricity)
        const sewerage = buildingSewerage.find(item => item.key === building.sewerage)
        const waterSupply = buildingWaterSupply.find(item => item.key === building.waterSupply)
        const contract = amountContract.find(item => item.key === building.amountContract)
        const type = buildingTypes.find(item => item.key === building.type)

        const payments: string[] = []
        const formalizations: string[] = []

        if (building.payments && building.payments.length) {
            building.payments.map((payment: string) => {
                const paymentInfo = paymentsList.find((item: ISelector) => item.key === payment)

                if (paymentInfo) {
                    payments.push(paymentInfo.text)
                }
            })
        }

        if (building.formalization && building.formalization.length) {
            building.formalization.map((formalization: string) => {
                const formalizationInfo = formalizationList.find((item: ISelector) => item.key === formalization)

                if (formalizationInfo) {
                    formalizations.push(formalizationInfo.text)
                }
            })
        }

        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <div className={classes.container}>
                    <div className={classes.col}>
                        <h2>Общие характеристики</h2>

                        {houseClass && <div className={classes.row}>
                            <div className={classes.label}>Класс дома:</div>
                            <div className={classes.param}>{houseClass.text}</div>
                        </div>}

                        {material && <div className={classes.row}>
                            <div className={classes.label}>Материал здания:</div>
                            <div className={classes.param}>{material.text}</div>
                        </div>}

                        {houseType && <div className={classes.row}>
                            <div className={classes.label}>Тип дома:</div>
                            <div className={classes.param}>{houseType.text}</div>
                        </div>}

                        {parking && <div className={classes.row}>
                            <div className={classes.label}>Паркинг:</div>
                            <div className={classes.param}>{parking.text}</div>
                        </div>}

                        {territory && <div className={classes.row}>
                            <div className={classes.label}>Территория:</div>
                            <div className={classes.param}>{territory.text}</div>
                        </div>}

                        {entranceHouse && <div className={classes.row}>
                            <div className={classes.label}>Подъезд к дому:</div>
                            <div className={classes.param}>{entranceHouse.text}</div>
                        </div>}

                        {building.ceilingHeight && building.ceilingHeight > 0 ?
                            <div className={classes.row}>
                                <div className={classes.label}>Высота потолков:</div>
                                <div className={classes.param}>{building.ceilingHeight} м.</div>
                            </div>
                            : null}

                        {building.maintenanceCost && building.maintenanceCost > 0 ?
                            <div className={classes.row}>
                                <div className={classes.label}>Стоимость обслуживания:</div>
                                <div className={classes.param}>{building.maintenanceCost} руб./м<sup>2</sup></div>
                            </div>
                            : null}

                        {building.distanceSea && building.distanceSea > 0 ?
                            <div className={classes.row}>
                                <div className={classes.label}>Расстояние до моря:</div>
                                <div className={classes.param}>{building.distanceSea} м.</div>
                            </div>
                            : null}
                    </div>

                    <div className={classes.col}>
                        <h2>Коммуникации</h2>

                        {gas && <div className={classes.row}>
                            <div className={classes.label}>Газ:</div>
                            <div className={classes.param}>{gas.text}</div>
                        </div>}

                        {heating && <div className={classes.row}>
                            <div className={classes.label}>Отопление:</div>
                            <div className={classes.param}>{heating.text}</div>
                        </div>}

                        {electricity && <div className={classes.row}>
                            <div className={classes.label}>Электричество:</div>
                            <div className={classes.param}>{electricity.text}</div>
                        </div>}

                        {sewerage && <div className={classes.row}>
                            <div className={classes.label}>Канализация:</div>
                            <div className={classes.param}>{sewerage.text}</div>
                        </div>}

                        {waterSupply && <div className={classes.row}>
                            <div className={classes.label}>Водоснабжение:</div>
                            <div className={classes.param}>{waterSupply.text}</div>
                        </div>}
                    </div>

                    <div className={classes.col}>
                        <h2>Оформление</h2>

                        {payments.length &&
                        <div className={classes.row}>
                            <div className={classes.label}>Варианты оформления:</div>
                            <div className={classes.param}>{payments.join(', ')}</div>
                        </div>
                        }

                        {type && <div className={classes.row}>
                            <div className={classes.label}>Тип недвижимости:</div>
                            <div className={classes.param}>{type.text}</div>
                        </div>}

                        {contract && <div className={classes.row}>
                            <div className={classes.label}>Сумма в договоре:</div>
                            <div className={classes.param}>{contract.text}</div>
                        </div>}

                        <div className={classes.row}>
                            <div className={classes.label}>Продажа для нерезидентов России:</div>
                            <div className={classes.param}>{!!building.saleNoResident ? 'Доступно' : 'Не доступно'}</div>
                        </div>
                    </div>

                    <div className={classes.col}>
                        <h2>Оплата</h2>
                        {formalizations.length ? formalizations.map((item: string, index: number) => {
                            return <div key={index} className={classes.row}>{item}</div>
                        }) : null}
                    </div>
                </div>
            </BlockingElement>
        )
    }

    // Вывод описания
    const renderDescription = () => {
        if (!building.description || building.description.trim() === '') {
            return null
        }

        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <h2>О ЖК</h2>

                <div className={classes.text}>
                    {building.description}
                </div>
            </BlockingElement>
        )
    }

    // Вывод особенностей
    const renderAdvantages = () => {
        if (!building.advantages || !building.advantages.length) {
            return null
        }

        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <h2>Преимущества</h2>

                <div className={classes.container}>
                    {building.advantages.map((item: string, index: number) => {
                        const advantage = buildingAdvantages.find(element => element.key === item)

                        if (!advantage) {
                            return null
                        }

                        return (
                            <div key={index} className={classes.advantage}>
                                <span>{advantage.text}</span>
                            </div>
                        )
                    })}
                </div>
            </BlockingElement>
        )
    }

    // Вывод корпусов
    const renderHousing = () => {
        if (!checkers || !checkers.length) {
            return null
        }

        const housingIds: number[] = Array.from(new Set(checkers.map((checker: IBuildingChecker) => checker.housing)))
        const housingList: IBuildingHousing = {} as IBuildingHousing

        housingIds.map((housingId: number) => {
            housingList[housingId] = checkers.filter((checker: IBuildingChecker) => checker.housing === housingId)
        })

        return (
            <BlockingElement fetching={fetchingCheckers} className={classes.block}>
                <h2>Корпуса ({housingIds.length})</h2>

                {Object.keys(housingList).map((key: string) => {
                    let minCost = 0
                    let minCostUnit = 0

                    housingList[parseInt(key)].map((checker: IBuildingChecker) => {
                        const cost = checker.cost && checker.cost ? checker.cost : 0
                        const costUnit = checker.cost && checker.area ? checker.cost / checker.area : 0

                        if (minCost === 0 || (checker.cost && cost < minCost)) {
                            minCost = cost
                        }

                        if (minCostUnit === 0 || costUnit < minCostUnit) {
                            minCostUnit = costUnit
                        }
                    })

                    return (
                        <div key={key} className={classes.housing}>
                            <div className={classes.title}>Корпус #{key}</div>
                            <div className={classes.counter}>
                                {declension(housingList[parseInt(key)].length, ['квартира', 'квартиры', 'квартир'], false)},
                                от {numberWithSpaces(round(minCost, 0))} рублей,
                                от {numberWithSpaces(round(minCostUnit, 0))} рублей за м<sup>2</sup>
                            </div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    // Вывод служебной/специальной информации
    const renderSpecialInfo = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <h2>Застройщик</h2>
                <p>В разработке</p>
                <h2>Контакты</h2>
                <p>В разработке</p>
                <h2>Документы</h2>
                <p>В разработке</p>
            </BlockingElement>
        )
    }

    return (
        <div className={classes.BuildingItemPage}>
            <div className={classes.Content}>
                <div className={classes.information}>
                    {!building || !building.id ?
                        <Empty message='Объект недвижимости не найден'/>
                        :
                        <div className={classes.container}>
                            <div className={classes.leftColumn}>
                                {renderGallery()}
                                {renderDescription()}
                                {renderAdvantages()}
                                {renderAdvanced()}
                                {renderHousing()}
                            </div>

                            <div className={classes.rightColumn}>
                                {renderInfo()}
                                {renderSpecialInfo()}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

BuildingItemPage.displayName = 'BuildingItemPage'

export default BuildingItemPage