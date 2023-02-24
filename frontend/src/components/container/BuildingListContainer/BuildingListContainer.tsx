import React, {useEffect} from 'react'
import {useActions} from '../../../hooks/useActions'
import {IBuilding} from '../../../@types/IBuilding'
import Empty from '../../ui/Empty/Empty'
import BuildingList from './components/BuildingList/BuildingList'
import BuildingTill from './components/BuildingTill/BuildingTill'
import BuildingMap from './components/BuildingMap/BuildingMap'
import classes from './BuildingListContainer.module.scss'

interface Props {
    buildings: IBuilding[]
    fetching: boolean
    layout: 'list' | 'till' | 'map'
    refScrollerContainer?: React.MutableRefObject<any>
    refContainerMore?: any
    currentPage?: number
    countPerPage?: number
    mapApiKey?: string
    mapPresetIcon?: string

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
    layout: 'list',
    currentPage: 1,
    onClick: (building: IBuilding) => {
        console.info('BuildingListContainer onClick', building)
    },
    onEdit: (building: IBuilding) => {
        console.info('BuildingListContainer onEdit', building)
    },
    onRemove: (building: IBuilding) => {
        console.info('BuildingListContainer onRemove', building)
    },
    onContextMenu: (e: React.MouseEvent, building: IBuilding) => {
        console.info('BuildingListContainer onContextMenu', e, building)
    },
    onRemoveFromFavorite: (building: IBuilding) => {
        console.info('BuildingListContainer onRemoveFromFavorite', building)
    },
    onRemoveFromCompilation: (building: IBuilding, compilationId?: number) => {
        console.info('BuildingListContainer onRemoveFromCompilation', building, compilationId)
    }
}

const BuildingListContainer: React.FC<Props> = (props) => {
    const {fetchTagList} = useActions()

    useEffect(() => {
        fetchTagList()
    }, [])

    const renderList = () => {
        switch (props.layout) {
            case 'list':
                return (
                    <BuildingList buildings={props.buildings}
                                  fetching={props.fetching}
                                  onClick={props.onClick}
                                  onEdit={props.onEdit}
                                  onRemove={props.onRemove}
                                  onContextMenu={props.onContextMenu}
                                  onRemoveFromFavorite={props.onRemoveFromFavorite}
                                  onRemoveFromCompilation={props.onRemoveFromCompilation}
                                  refScrollerContainer={props.refScrollerContainer}
                                  refContainerMore={props.refContainerMore}
                                  currentPage={props.currentPage}
                                  countPerPage={props.countPerPage}
                    />
                )
            case 'till':
                return (
                    <BuildingTill buildings={props.buildings}
                                  fetching={props.fetching}
                                  onClick={props.onClick}
                                  onEdit={props.onEdit}
                                  onRemove={props.onRemove}
                                  onContextMenu={props.onContextMenu}
                                  onRemoveFromFavorite={props.onRemoveFromFavorite}
                                  onRemoveFromCompilation={props.onRemoveFromCompilation}
                                  refScrollerContainer={props.refScrollerContainer}
                                  refContainerMore={props.refContainerMore}
                                  currentPage={props.currentPage}
                                  countPerPage={props.countPerPage}
                    />
                )
            case 'map':
                return (
                    <BuildingMap buildings={props.buildings}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
                                 onRemoveFromFavorite={props.onRemoveFromFavorite}
                                 onRemoveFromCompilation={props.onRemoveFromCompilation}
                                 mapApiKey={props.mapApiKey}
                                 mapPresetIcon={props.mapPresetIcon}
                    />
                )
        }
    }

    return (
        <div className={classes.BuildingListContainer}>
            {props.buildings.length ? renderList() : <Empty message='Нет объектов недвижимости'/>}
        </div>
    )
}

BuildingListContainer.defaultProps = defaultProps
BuildingListContainer.displayName = 'BuildingListContainer'

export default BuildingListContainer