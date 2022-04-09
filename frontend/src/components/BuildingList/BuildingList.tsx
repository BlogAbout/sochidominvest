import React, {useEffect} from 'react'
import {IBuilding} from '../../@types/IBuilding'
import {useActions} from '../../hooks/useActions'
import Empty from '../Empty/Empty'
import BuildingItem from './components/BuildingItem/BuildingItem'
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
        console.info('InfoList onSave')
    }
}

const BuildingList: React.FC<Props> = (props) => {
    const {fetchTagList} = useActions()

    useEffect(() => {
        fetchTagList()
    }, [])

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