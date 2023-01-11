import React, {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {Map, MapState, YMaps, ZoomControl} from 'react-yandex-maps'
import {configuration} from '../../../../../helpers/utilHelper'
import {RouteNames} from '../../../../helpers/routerHelper'
import {IBuilding} from '../../../../../@types/IBuilding'
import Empty from '../../../../components/ui/Empty/Empty'
import BuildingPlacemark from '../../../BuildingsPage/components/BuildingPlacemark/BuildingPlacemark'
import classes from './BuildingMap.module.scss'

interface Props {
    list: IBuilding[]
    fetching: boolean
    isFavorite?: boolean
    compilationId?: number | null
    mapApiKey?: string
    mapPresetIcon?: string

    onClick(building: IBuilding): void

    onContextMenu(building: IBuilding, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    isFavorite: false,
    compilationId: null,
    onClick: (building: IBuilding) => {
        console.info('BuildingMap onClick', building)
    },
    onContextMenu: (building: IBuilding, e: React.MouseEvent) => {
        console.info('BuildingMap onClick', building, e)
    }
}

const BuildingMap: React.FC<Props> = (props) => {
    const navigate = useNavigate()

    const mapState: MapState = useMemo(() => {
        return {
            center: [55.76, 37.64],
            zoom: 10,
            controls: [],
            type: 'yandex#map'
        }
    }, [])

    return (
        <div className={classes.BuildingMap}>
            <div className={classes.map}>
                {configuration.apiYandexMapKey ?
                    <YMaps enterprise
                           query={{
                               apikey: configuration.apiYandexMapKey
                           }}
                    >
                        <Map state={mapState}
                             width='100%'
                             height='100%'
                             modules={['ObjectManager', 'Placemark']}
                        >
                            <ZoomControl/>

                            {props.list && props.list.length ?
                                props.list.map((building: IBuilding) => {
                                    return (
                                        <BuildingPlacemark key={building.id}
                                                           building={building}
                                                           onClick={() => navigate(`${RouteNames.BUILDING}/${building.id}`)}
                                        />
                                    )
                                })
                                : null
                            }
                        </Map>
                    </YMaps>
                    : <Empty message='API ключ для Yandex.Maps не указан. Карта не доступна!'/>
                }
            </div>
        </div>
    )
}

BuildingMap.defaultProps = defaultProps
BuildingMap.displayName = 'BuildingMap'

export default BuildingMap