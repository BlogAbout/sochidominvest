import React from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import {getBuildingTypesText} from '../../../../../helpers/buildingHelper'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import classes from './BuildingList.module.scss'

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
        console.info('BuildingList onContextMenu', building, e)
    }
}

const BuildingList: React.FC<Props> = (props): React.ReactElement => {
    return (
        <List className={classes.BuildingList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.author}>Автор</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
                <ListCell className={classes.views}>Просмотры</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching} ref={props.refScrollerContainer}>
                {props.list && props.list.length ?
                    props.list.map((building: IBuilding, index: number) => {
                        if (props.currentPage && props.countPerPage && index >= props.currentPage * props.countPerPage) {
                            return null
                        }

                        return (
                            <ListRow key={building.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(building, e)}
                                     onClick={() => props.onClick(building)}
                                     isDisabled={!building.active}
                            >
                                <ListCell className={classes.name}>{building.name}</ListCell>
                                <ListCell className={classes.author}>{building.authorName || ''}</ListCell>
                                <ListCell className={classes.type}>{getBuildingTypesText(building.type)}</ListCell>
                                <ListCell className={classes.views}>{building.views}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет объектов недвижимости'/>
                }

                {props.list.length && props.refContainerMore ? <div ref={props.refContainerMore}/> : null}
            </ListBody>
        </List>
    )
}

BuildingList.defaultProps = defaultProps
BuildingList.displayName = 'BuildingList'

export default React.memo(BuildingList)