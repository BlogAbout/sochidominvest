import React, {useEffect} from 'react'
import {Map, MapState, Placemark, YMaps, ZoomControl} from 'react-yandex-maps'
import {IBuilding} from '../../../../../@types/IBuilding'
import {useActions} from '../../../../../hooks/useActions'
import Empty from '../../../../ui/Empty/Empty'
import openPopupBuildingInfo from '../../../../popup/PopupBuildingInfo/PopupBuildingInfo'
import classes from './BuildingMap.module.scss'

interface Props {
    buildings: IBuilding[]
    fetching: boolean
    isFavorite?: boolean
    compilationId?: number | null
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

const BuildingMap: React.FC<Props> = (props) => {
    const {fetchTagList} = useActions()

    useEffect(() => {
        fetchTagList()
    }, [])

    const mapState: MapState = {
        center: [55.76, 37.64],
        zoom: 10,
        controls: [],
        type: 'yandex#map'
    }

    const renderBuildingPlaceMark = (building: IBuilding) => {
        if (!building.coordinates) {
            return null
        }

        const coordinates = building.coordinates.split(',').map(Number)
        if (!coordinates || !coordinates.length || coordinates.length !== 2) {
            return null
        }

        return (
            <Placemark key={building.id}
                       geometry={coordinates}
                       options={{
                           preset: props.mapPresetIcon
                       }}
                       onClick={() => {
                           openPopupBuildingInfo(document.body, {
                               building: building,
                               onClick: props.onClick,
                               onEdit: props.onEdit,
                               onRemove: props.onRemove,
                               onContextMenu: props.onContextMenu,
                               onRemoveFromFavorite: props.onRemoveFromFavorite,
                               onRemoveFromCompilation: props.onRemoveFromCompilation
                           })
                       }}
            />
        )
    }

    return (
        <div className={classes.BuildingMap}>
            {props.mapApiKey ?
                <YMaps enterprise
                       query={{
                           apikey: props.mapApiKey
                       }}
                >
                    <Map state={mapState}
                         width='100%'
                         height='100%'
                         modules={['ObjectManager', 'Placemark']}
                    >
                        <ZoomControl/>

                        {props.buildings.length ?
                            props.buildings.map((building: IBuilding) => renderBuildingPlaceMark(building))
                            : null
                        }
                    </Map>
                </YMaps>
                : <Empty message='API ключ для Yandex.Maps не указан. Карта не доступна!'/>
            }
        </div>
    )
}

BuildingMap.defaultProps = defaultProps
BuildingMap.displayName = 'BuildingMap'

export default BuildingMap