import React from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import {getBuildingTypesText, getDistrictText, getPassedText} from '../../../../../helpers/buildingHelper'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import BlockItem from '../../../../components/ui/BlockItem/BlockItem'
import classes from './BuildingTill.module.scss'

interface Props {
    list: IBuilding[]
    fetching: boolean
    isFavorite?: boolean
    compilationId?: number | null
    refScrollerContainer?: React.MutableRefObject<any>
    refContainerMore?: React.MutableRefObject<any>
    currentPage?: number
    countPerPage?: number

    onClick(building: IBuilding): void

    onContextMenu(building: IBuilding, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    isFavorite: false,
    compilationId: null,
    currentPage: 1,
    countPerPage: 20,
    onClick: (building: IBuilding) => {
        console.info('BuildingList onClick', building)
    },
    onContextMenu: (building: IBuilding, e: React.MouseEvent) => {
        console.info('BuildingList onClick', building, e)
    }
}

const BuildingTill: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.BuildingTill} ref={props.refScrollerContainer}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((building: IBuilding, index: number) => {
                        if (props.currentPage && props.countPerPage && index >= props.currentPage * props.countPerPage) {
                            return null
                        }

                        return (
                            <BlockItem key={building.id}
                                       title={building.name}
                                       avatar={building.avatar || ''}
                                       address={building.address || ''}
                                       districtText={getDistrictText(building.district, building.districtZone)}
                                       date={building.dateCreated || undefined}
                                       type={getBuildingTypesText(building.type)}
                                       passed={getPassedText(building.passed)}
                                       isPassed={!!(building.passed && building.passed.is)}
                                       rentType={building.rentData ? building.rentData.type === 'short' ? '/в сутки' : '/в месяц' : undefined}
                                       rentCost={building.rentData && building.rentData.cost ? building.rentData.cost : undefined}
                                       countCheckers={building.countCheckers || undefined}
                                       buildingType={building.type}
                                       cost={building.type === 'building' ? (building.costMin || 0) : (building.cost || 0)}
                                       areaMin={building.type === 'building' ? (building.areaMin || 0) : (building.area || 0)}
                                       areaMax={building.type === 'building' ? (building.areaMax || 0) : undefined}
                                       isDisabled={!building.active}
                                       onContextMenu={(e: React.MouseEvent) => props.onContextMenu(building, e)}
                                       onClick={() => props.onClick(building)}
                            />
                        )
                    })
                    : <Empty message='Нет объектов недвижимости'/>
                }

                {props.list.length && props.refContainerMore ? <div ref={props.refContainerMore}/> : null}
            </BlockingElement>
        </div>
    )
}

BuildingTill.defaultProps = defaultProps
BuildingTill.displayName = 'BuildingTill'

export default React.memo(BuildingTill)