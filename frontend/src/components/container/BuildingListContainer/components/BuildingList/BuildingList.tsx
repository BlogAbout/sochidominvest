import React, {useEffect} from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import {useActions} from '../../../../../hooks/useActions'
import Empty from '../../../../Empty/Empty'
import BuildingItem from './components/BuildingItem/BuildingItem'
import classes from './BuildingList.module.scss'
import BlockingElement from "../../../../ui/BlockingElement/BlockingElement";
import {IArticle} from "../../../../../@types/IArticle";
import ArticleItem from "../../../ArticleListContainer/components/ArticleList/components/ArticleItem/ArticleItem";

interface Props {
    buildings: IBuilding[]
    fetching: boolean
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
    buildings: [],
    fetching: false,
    isFavorite: false,
    compilationId: null,
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

const BuildingList: React.FC<Props> = (props) => {
    const {fetchTagList} = useActions()

    useEffect(() => {
        fetchTagList()
    }, [])

    return (
        <div className={classes.BuildingList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.author}>Автор</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.views}>Просмотры</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.buildings.map((building: IBuilding) => {
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
            </BlockingElement>
        </div>
    )
}

BuildingList.defaultProps = defaultProps
BuildingList.displayName = 'BuildingList'

export default BuildingList