import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import {IBuilding} from '../../@types/IBuilding'
import Button from '../../components/Button/Button'
import Empty from '../../components/Empty/Empty'
import BlockingElement from '../../components/BlockingElement/BlockingElement'
import openPopupBuildingCreate from '../../components/PopupBuildingCreate/PopupBuildingCreate'
import classes from './BuildingItemPage.module.scss'
import {declension} from "../../helpers/stringHelper";
import {
    buildingClasses,
    buildingEntrance,
    buildingFormat,
    buildingMaterials,
    buildingParking, buildingTerritory
} from "../../helpers/buildingHelper";

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
            const buildingInfo = buildings.find((building: IBuilding) => building.id === buildingId)

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

    // Вывод галереи
    const renderGallery = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.gallery}>
                <div className={classes.carousel}>
                    <a href='https://api.sochidominvest.ru/uploads/no-image.jpg'>
                        <img src='https://api.sochidominvest.ru/uploads/no-image.jpg' alt={building.name}/>
                    </a>
                </div>
            </BlockingElement>
        )
    }

    // Вывод базовой информации
    const renderInfo = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <h1>{building.name}</h1>
                <div className={classes.address}>{building.address}</div>

                <div className={classes.container}>
                    <div className={classes.row}>
                        <span>{building.countCheckers || 0}</span>
                        <span>{declension(building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], true)}</span>
                    </div>

                    <div className={classes.row}>
                        <span>{building.costMinUnit || 0} руб.</span>
                        <span>Мин. цена за м<sup>2</sup></span>
                    </div>

                    <div className={classes.row}>
                        <span>{building.costMin || 0} руб.</span>
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
                            <div className={classes.param}>{building.houseClass}</div>
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

                        <div className={classes.row}>
                            <div className={classes.label}>Газ:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>

                        <div className={classes.row}>
                            <div className={classes.label}>Отопление:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>

                        <div className={classes.row}>
                            <div className={classes.label}>Электричество:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>

                        <div className={classes.row}>
                            <div className={classes.label}>Канализация:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>

                        <div className={classes.row}>
                            <div className={classes.label}>Водоснабжение:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>
                    </div>

                    <div className={classes.col}>
                        <h2>Оформление</h2>

                        <div className={classes.row}>
                            <div className={classes.label}>Варианты оформления:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>

                        <div className={classes.row}>
                            <div className={classes.label}>Тип недвижимости:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>

                        <div className={classes.row}>
                            <div className={classes.label}>Сумма в договоре:</div>
                            <div className={classes.param}>В разработке</div>
                        </div>
                    </div>

                    <div className={classes.col}>
                        <h2>Оплата</h2>
                        <p>В разработке</p>
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
                    {building.advantages.map((item: string) => {
                        return (
                            <div className={classes.advantage}>
                                <span>{item}</span>
                            </div>
                        )
                    })}
                </div>
            </BlockingElement>
        )
    }

    // Вывод корпусов
    const renderHousing = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <h2>Корпуса (#)</h2>

                <p>В разработке</p>
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