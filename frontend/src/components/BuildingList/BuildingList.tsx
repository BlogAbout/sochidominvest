import React from 'react'
import Empty from '../Empty/Empty'
import BuildingItem from './components/BuildingItem/BuildingItem'
import {IBuilding} from '../../@types/IBuilding'
import classes from './BuildingList.module.scss'

interface Props {
    buildings: IBuilding[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    buildings: [],
    fetching: false,
    onSave: () => {
        console.info('BuildingList onSave')
    }
}

const BuildingList: React.FC<Props> = (props) => {
    return (
        <div className={classes.BuildingList}>
            {props.buildings.length ?
                props.buildings.map((building: IBuilding) => {
                    return (
                        <BuildingItem key={building.id} building={building} onSave={props.onSave.bind(this)}/>
                    )
                })
                : <Empty message='Нет объектов недвижимости'/>
            }
        </div>
    )
}

BuildingList.defaultProps = defaultProps
BuildingList.displayName = 'BuildingList'

export default BuildingList