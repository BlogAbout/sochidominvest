import React from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import BuildingItem from './components/BuildingItem/BuildingItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import classes from './BuildingTill.module.scss'

interface Props {
    buildings: IBuilding[]
    fetching: boolean
    isFavorite?: boolean
    compilationId?: number | null
    refScrollerContainer?: React.MutableRefObject<any>
    refContainerMore?: React.MutableRefObject<any>
    currentPage?: number
    countPerPage?: number

    onClick(building: IBuilding): void

    onEdit(building: IBuilding): void

    onRemove(building: IBuilding): void

    onContextMenu(e: React.MouseEvent, building: IBuilding): void

    onRemoveFromFavorite(building: IBuilding): void

    onRemoveFromCompilation(building: IBuilding): void
}

const defaultProps: Props = {
    buildings: [],
    fetching: false,
    isFavorite: false,
    compilationId: null,
    currentPage: 1,
    countPerPage: 20,
    onClick: (building: IBuilding) => {
        console.info('BuildingTill onClick', building)
    },
    onEdit: (building: IBuilding) => {
        console.info('BuildingTill onEdit', building)
    },
    onRemove: (building: IBuilding) => {
        console.info('BuildingTill onRemove', building)
    },
    onContextMenu: (e: React.MouseEvent, building: IBuilding) => {
        console.info('BuildingTill onContextMenu', e, building)
    },
    onRemoveFromFavorite: (building: IBuilding) => {
        console.info('BuildingTill onRemoveFromFavorite', building)
    },
    onRemoveFromCompilation: (building: IBuilding, compilationId?: number) => {
        console.info('BuildingTill onRemoveFromCompilation', building, compilationId)
    }
}

const BuildingTill: React.FC<Props> = (props) => {
    return (
        <div className={classes.BuildingTill} ref={props.refScrollerContainer}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.buildings.map((building: IBuilding, index: number) => {
                    if (props.currentPage && props.countPerPage && index >= props.currentPage * props.countPerPage) {
                        return null
                    }

                    return (
                        <BuildingItem key={building.id}
                                      building={building}
                                      isFavorite={props.isFavorite}
                                      compilationId={props.compilationId}
                                      onClick={props.onClick}
                                      onEdit={props.onEdit}
                                      onRemove={props.onRemove}
                                      onContextMenu={props.onContextMenu}
                                      onRemoveFromFavorite={props.onRemoveFromFavorite}
                                      onRemoveFromCompilation={props.onRemoveFromCompilation}
                        />
                    )
                })}

                {props.buildings.length && props.refContainerMore ? <div ref={props.refContainerMore}/> : null}
            </BlockingElement>
        </div>
    )
}

BuildingTill.defaultProps = defaultProps
BuildingTill.displayName = 'BuildingTill'

export default BuildingTill