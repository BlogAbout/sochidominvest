import React from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import {ISelector} from '../../../../../@types/ISelector'
import {
    formalizationList,
    getBuildingAmountContractText,
    getBuildingClassesText,
    getBuildingElectricityText,
    getBuildingEntranceText,
    getBuildingFormatText,
    getBuildingGasText,
    getBuildingHeatingText,
    getBuildingMaterialsText,
    getBuildingParkingText,
    getBuildingSewerageText,
    getBuildingTerritoryText,
    getBuildingTypesText,
    getBuildingWaterSupplyText,
    paymentsList
} from '../../../../../helpers/buildingHelper'
import Title from '../../../../components/ui/Title/Title'
import classes from './BuildingAdvancedBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingAdvancedBlock: React.FC<Props> = (props): React.ReactElement => {
    const houseClass = getBuildingClassesText(props.building.houseClass)
    const material = getBuildingMaterialsText(props.building.material)
    const houseType = getBuildingFormatText(props.building.houseType)
    const entranceHouse = getBuildingEntranceText(props.building.entranceHouse)
    const parking = getBuildingParkingText(props.building.parking)
    const territory = getBuildingTerritoryText(props.building.territory)
    const gas = getBuildingGasText(props.building.gas)
    const heating = getBuildingHeatingText(props.building.heating)
    const electricity = getBuildingElectricityText(props.building.electricity)
    const sewerage = getBuildingSewerageText(props.building.sewerage)
    const waterSupply = getBuildingWaterSupplyText(props.building.waterSupply)
    const contract = getBuildingAmountContractText(props.building.amountContract)
    const type = getBuildingTypesText(props.building.type)

    let payments: string[] = paymentsList.filter((item: ISelector) => props.building.payments?.includes(item.key)).map((item: ISelector) => item.text)
    let formalizations: string[] = formalizationList.filter((item: ISelector) => props.building.formalization?.includes(item.key)).map((item: ISelector) => item.text)

    return (
        <div className={classes.BuildingAdvancedBlock}>
            <div className={classes.info}>
                <div className={classes.col}>
                    <Title type='h2'>Общие характеристики</Title>

                    {houseClass && <div className={classes.row}>
                        <div className={classes.label}>Класс дома:</div>
                        <div className={classes.param}>{houseClass}</div>
                    </div>}

                    {material && <div className={classes.row}>
                        <div className={classes.label}>Материал здания:</div>
                        <div className={classes.param}>{material}</div>
                    </div>}

                    {houseType && <div className={classes.row}>
                        <div className={classes.label}>Тип дома:</div>
                        <div className={classes.param}>{houseType}</div>
                    </div>}

                    {parking && <div className={classes.row}>
                        <div className={classes.label}>Паркинг:</div>
                        <div className={classes.param}>{parking}</div>
                    </div>}

                    {territory && <div className={classes.row}>
                        <div className={classes.label}>Территория:</div>
                        <div className={classes.param}>{territory}</div>
                    </div>}

                    {entranceHouse && <div className={classes.row}>
                        <div className={classes.label}>Подъезд к дому:</div>
                        <div className={classes.param}>{entranceHouse}</div>
                    </div>}

                    {props.building.ceilingHeight && props.building.ceilingHeight > 0 ?
                        <div className={classes.row}>
                            <div className={classes.label}>Высота потолков:</div>
                            <div className={classes.param}>{props.building.ceilingHeight} м.</div>
                        </div>
                        : null
                    }

                    {props.building.maintenanceCost && props.building.maintenanceCost > 0 ?
                        <div className={classes.row}>
                            <div className={classes.label}>Стоимость обслуживания:</div>
                            <div className={classes.param}>{props.building.maintenanceCost} руб./м<sup>2</sup></div>
                        </div>
                        : null
                    }

                    {props.building.distanceSea && props.building.distanceSea > 0 ?
                        <div className={classes.row}>
                            <div className={classes.label}>Расстояние до моря:</div>
                            <div className={classes.param}>{props.building.distanceSea} м.</div>
                        </div>
                        : null
                    }
                </div>

                <div className={classes.col}>
                    <Title type='h2'>Коммуникации</Title>

                    {gas ?
                        <div className={classes.row}>
                            <div className={classes.label}>Газ:</div>
                            <div className={classes.param}>{gas}</div>
                        </div>
                        : null
                    }

                    {heating ?
                        <div className={classes.row}>
                            <div className={classes.label}>Отопление:</div>
                            <div className={classes.param}>{heating}</div>
                        </div>
                        : null
                    }

                    {electricity ?
                        <div className={classes.row}>
                            <div className={classes.label}>Электричество:</div>
                            <div className={classes.param}>{electricity}</div>
                        </div>
                        : null
                    }

                    {sewerage ?
                        <div className={classes.row}>
                            <div className={classes.label}>Канализация:</div>
                            <div className={classes.param}>{sewerage}</div>
                        </div>
                        : null
                    }

                    {waterSupply ?
                        <div className={classes.row}>
                            <div className={classes.label}>Водоснабжение:</div>
                            <div className={classes.param}>{waterSupply}</div>
                        </div>
                        : null
                    }
                </div>

                <div className={classes.col}>
                    <Title type='h2'>Оформление</Title>

                    {formalizations.length ?
                        <div className={classes.row}>
                            <div className={classes.label}>Варианты оформления:</div>
                            <div className={classes.param}>{formalizations.join(', ')}</div>
                        </div>
                        : null
                    }

                    {type ?
                        <div className={classes.row}>
                            <div className={classes.label}>Тип недвижимости:</div>
                            <div className={classes.param}>{type}</div>
                        </div>
                        : null
                    }

                    {contract ?
                        <div className={classes.row}>
                            <div className={classes.label}>Сумма в договоре:</div>
                            <div className={classes.param}>{contract}</div>
                        </div>
                        : null
                    }

                    <div className={classes.row}>
                        <div className={classes.label}>Продажа для нерезидентов России:</div>
                        <div className={classes.param}>
                            {!!props.building.saleNoResident ? 'Доступно' : 'Не доступно'}
                        </div>
                    </div>
                </div>

                <div className={classes.col}>
                    <Title type='h2'>Оплата</Title>

                    {payments.length ?
                        <div className={classes.row}>
                            <div className={classes.label}>Варианты оплаты:</div>
                            <div className={classes.param}>{payments.join(', ')}</div>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

BuildingAdvancedBlock.defaultProps = defaultProps
BuildingAdvancedBlock.displayName = 'BuildingAdvancedBlock'

export default BuildingAdvancedBlock