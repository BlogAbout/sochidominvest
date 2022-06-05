import React from 'react'
import classNames from 'classnames/bind'
import {getBuildingTypesText, getDistrictText, getPassedText} from '../../../../../../../helpers/buildingHelper'
import {IBuilding} from '../../../../../../../@types/IBuilding'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import classes from './BuildingItem.module.scss'

interface Props {
    building: IBuilding
    isFavorite?: boolean
    compilationId?: number | null

    onClick(building: IBuilding): void

    onEdit(building: IBuilding): void

    onRemove(building: IBuilding): void

    onContextMenu(e: React.MouseEvent, building: IBuilding): void

    onRemoveFromFavorite(building: IBuilding): void

    onRemoveFromCompilation(building: IBuilding): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    isFavorite: false,
    compilationId: null,
    onClick: (building: IBuilding) => {
        console.info('BuildingItem onClick', building)
    },
    onEdit: (building: IBuilding) => {
        console.info('BuildingItem onEdit', building)
    },
    onRemove: (building: IBuilding) => {
        console.info('BuildingItem onRemove', building)
    },
    onContextMenu: (e: React.MouseEvent, building: IBuilding) => {
        console.info('BuildingItem onContextMenu', e, building)
    },
    onRemoveFromFavorite: (building: IBuilding) => {
        console.info('BuildingItem onRemoveFromFavorite', building)
    },
    onRemoveFromCompilation: (building: IBuilding, compilationId?: number) => {
        console.info('BuildingItem onRemoveFromCompilation', building, compilationId)
    }
}

const cx = classNames.bind(classes)

const BuildingItem: React.FC<Props> = (props) => {
    const {tags} = useTypedSelector(state => state.tagReducer)

    const buildingType = getBuildingTypesText(props.building.type)
    const passedInfo = getPassedText(props.building.passed)
    const districtText = getDistrictText(props.building.district, props.building.districtZone)

    return (
        <div className={cx({'BuildingItem': true, 'disabled': !props.building.active})}
             onClick={() => props.onClick(props.building)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.building)}
        >
            <div className={classes.name}>{props.building.name}</div>
            <div className={classes.author}>{props.building.authorName || ''}</div>
            <div className={classes.type}>{buildingType}</div>
            <div className={classes.views}>{props.building.views}</div>
        </div>
    )
}

BuildingItem.defaultProps = defaultProps
BuildingItem.displayName = 'BuildingItem'

export default BuildingItem