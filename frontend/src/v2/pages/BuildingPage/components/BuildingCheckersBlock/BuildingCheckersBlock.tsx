import React, {useEffect, useState} from 'react'
import {IBuilding, IBuildingChecker, IBuildingHousing} from '../../../../../@types/IBuilding'
import CheckerService from '../../../../../api/CheckerService'
import {declension} from '../../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import openPopupCheckerInfo from '../../../../../components/PopupCheckerInfo/PopupCheckerInfo'
import classes from './BuildingCheckersBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingCheckersBlock: React.FC<Props> = (props): React.ReactElement | null => {
    const [fetchingCheckers, setFetchingCheckers] = useState(false)
    const [checkers, setCheckers] = useState<IBuildingChecker[]>([])

    useEffect(() => {
        onFetchCheckers()
    }, [props.building])

    // Загрузка квартир объекта недвижимости
    const onFetchCheckers = (): void => {
        if (props.building.id && props.building.type === 'building') {
            setFetchingCheckers(true)

            CheckerService.fetchCheckers(props.building.id)
                .then((response) => {
                    setCheckers(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки квартир объекта недвижимости', error)
                })
                .finally(() => {
                    setFetchingCheckers(false)
                })
        }
    }

    // Вывод корпусов
    const renderHousing = () => {
        if (!checkers || !checkers.length) {
            return null
        }

        const housingIds: number[] = Array.from(new Set(checkers.map((checker: IBuildingChecker) => checker.housing)))
        const housingList: IBuildingHousing = {} as IBuildingHousing

        housingIds.forEach((housingId: number) => {
            housingList[housingId] = checkers.filter((checker: IBuildingChecker) => checker.housing === housingId)
        })

        return (
            <div className={classes.BuildingCheckersBlock}>
                <BlockingElement fetching={fetchingCheckers} className={classes.block}>
                    <h2>Корпуса ({housingIds.length})</h2>

                    {Object.keys(housingList).map((key: string) => {
                        const housingId: number = parseInt(key)
                        let minCost = 0
                        let minCostUnit = 0

                        housingList[housingId].forEach((checker: IBuildingChecker) => {
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
                            <div key={key}
                                 className={classes.housing}
                                 onClick={() => openPopupCheckerInfo(document.body, {
                                     buildingName: props.building.name,
                                     list: housingList,
                                     housing: housingId,
                                     fetching: fetchingCheckers,
                                     housingList: housingIds
                                 })}
                            >
                                <div className={classes.title}>Корпус #{key}</div>
                                <div className={classes.counter}>
                                    {declension(housingList[housingId].length, ['квартира', 'квартиры', 'квартир'], false)},
                                    от {numberWithSpaces(round(minCost, 0))} рублей,
                                    от {numberWithSpaces(round(minCostUnit, 0))} рублей за м<sup>2</sup>
                                </div>
                            </div>
                        )
                    })}
                </BlockingElement>
            </div>
        )
    }

    return props.building.type === 'building' ? renderHousing() : null
}

BuildingCheckersBlock.defaultProps = defaultProps
BuildingCheckersBlock.displayName = 'BuildingCheckersBlock'

export default BuildingCheckersBlock