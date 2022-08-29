import React from 'react'
import {Text, View} from '@react-pdf/renderer'
import {IBuilding} from '../../../../@types/IBuilding'
import {ISelector} from '../../../../@types/ISelector'
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
    getDistrictText,
    getPassedText,
    paymentsList
} from '../../../../helpers/buildingHelper'
import {declension} from '../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../helpers/numberHelper'

interface Props {
    building: IBuilding
    styles: any
}

const defaultProps: Props = {
    building: {} as IBuilding,
    styles: {}
}

const DocumentBuilding: React.FC<Props> = ({building, styles}) => {
    const passedInfo = getPassedText(building.passed)
    const districtText = getDistrictText(building.district, building.districtZone)
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

    let payments: string[] = paymentsList.filter((item: ISelector) => building.payments?.includes(item.key)).map((item: ISelector) => item.text)
    let formalizations: string[] = formalizationList.filter((item: ISelector) => building.formalization?.includes(item.key)).map((item: ISelector) => item.text)

    return (
        <View style={styles.content}>
            <View style={styles.block}>
                <Text style={styles.textBig}>{building.name}</Text>
                <Text style={styles.textMiddle}>{passedInfo}</Text>
                {districtText !== '' ? <Text style={styles.textDefault}>{districtText}</Text> : null}
                <Text style={styles.textDefault}>{building.address}</Text>
            </View>

            <View style={styles.block}>
                {building.type === 'building' ?
                    <>
                        <Text style={styles.textMiddle}>
                            {building.countCheckers || 0} {declension(building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], true)}
                        </Text>
                        <Text style={styles.textMiddle}>
                            Мин. цена за м&sup2;: {numberWithSpaces(round(building.costMinUnit || 0, 0))} руб.
                        </Text>
                        <Text style={styles.textMiddle}>
                            Мин. цена: {numberWithSpaces(round(building.costMin || 0, 0))} руб.
                        </Text>
                        <Text style={styles.textMiddle}>
                            Площади, м&sup2;: {building.areaMin || 0} - {building.areaMax || 0}
                        </Text>
                    </>
                    :
                    <>
                        <Text style={styles.textMiddle}>
                            Цена за
                            м&sup2;: {numberWithSpaces(round(building.area && building.cost ? building.cost / building.area : 0, 0))} руб.
                        </Text>
                        <Text style={styles.textMiddle}>
                            Цена: {numberWithSpaces(round(building.cost || 0, 0))} руб.
                        </Text>
                        <Text style={styles.textMiddle}>Площадь, м&sup2;: {building.area || 0}</Text>
                    </>
                }
            </View>

            <View style={styles.block}>
                <Text style={{...styles.textMiddle, color: '#075ea5'}}>Общие характеристики</Text>
                {houseClass ? <Text style={styles.textDefault}>Класс дома: {houseClass.text}</Text> : null}
                {material ? <Text style={styles.textDefault}>Материал здания: {material.text}</Text> : null}
                {houseType ? <Text style={styles.textDefault}>Тип дома: {houseType.text}</Text> : null}
                {parking ? <Text style={styles.textDefault}>Паркинг: {parking.text}</Text> : null}
                {territory ? <Text style={styles.textDefault}>Территория: {territory.text}</Text> : null}
                {entranceHouse ? <Text style={styles.textDefault}>Подъезд к дому: {entranceHouse.text}</Text> : null}
                {building.ceilingHeight ?
                    <Text style={styles.textDefault}>Высота потолков: {building.ceilingHeight} м.</Text>
                    : null}
                {building.maintenanceCost && building.maintenanceCost > 0 ?
                    <Text style={styles.textDefault}>Стоимость
                        обслуживания: {building.maintenanceCost} руб./м&sup2;</Text>
                    : null
                }
                {building.distanceSea && building.distanceSea > 0 ?
                    <Text style={styles.textDefault}>Расстояние до моря: {building.distanceSea} м.</Text>
                    : null
                }
            </View>

            <View style={styles.block}>
                <Text style={{...styles.textMiddle, color: '#075ea5'}}>Коммуникации</Text>
                {gas ? <Text style={styles.textDefault}>Газ: {gas.text}</Text> : null}
                {heating ? <Text style={styles.textDefault}>Отопление: {heating.text}</Text> : null}
                {electricity ? <Text style={styles.textDefault}>Электричество: {electricity.text}</Text> : null}
                {sewerage ? <Text style={styles.textDefault}>Канализация: {sewerage.text}</Text> : null}
                {waterSupply ? <Text style={styles.textDefault}>Водоснабжение: {waterSupply.text}</Text> : null}
            </View>

            <View style={styles.block}>
                <Text style={{...styles.textMiddle, color: '#075ea5'}}>Оформление</Text>
                {formalizations && formalizations.length ?
                    <Text style={styles.textDefault}>Варианты оформления: {formalizations.join(', ')}</Text>
                    : null
                }
                {type ? <Text style={styles.textDefault}>Тип недвижимости: {type.text}</Text> : null}
                {contract ? <Text style={styles.textDefault}>Сумма в договоре: {contract.text}</Text> : null}
                <Text style={styles.textDefault}>Продажа для нерезидентов
                    России: {!!building.saleNoResident ? 'Доступно' : 'Не доступно'}</Text>
            </View>

            {payments.length ?
                <View style={styles.block}>
                    <Text style={{...styles.textMiddle, color: '#075ea5'}}>Оплата</Text>
                    <Text style={styles.textDefault}>Варианты оплаты: {payments.join(', ')}</Text>
                </View>
                : null
            }

            {building.advantages ?
                <View style={styles.block}>
                    <Text style={{...styles.textMiddle, color: '#075ea5'}}>Преимущества</Text>
                    <Text style={styles.textDefault}>{building.advantages.map((item: string) => {
                        const advantage = buildingAdvantages.find(element => element.key === item)

                        if (!advantage) {
                            return null
                        }

                        return advantage.text + ', '
                    })}</Text>
                </View>
                : null
            }
        </View>
    )
}

DocumentBuilding.defaultProps = defaultProps
DocumentBuilding.displayName = 'DocumentBuilding'

export default DocumentBuilding