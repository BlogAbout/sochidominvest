import React, {useEffect, useMemo} from 'react'
import {Map, MapState, Placemark, YMaps, ZoomControl} from 'react-yandex-maps'
import {configuration} from '../../../../helpers/utilHelper'
import {PopupDisplayOptions, PopupProps} from '../../../../@types/IPopup'
import {IBuilding} from '../../../../@types/IBuilding'
import {getPopupContainer, openPopup, removePopup} from '../../../../helpers/popupHelper'
import {Footer, Popup} from '../../../../components/popup/Popup/Popup'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import Button from '../../form/Button/Button'
import Empty from '../../ui/Empty/Empty'
import classes from './PopupMap.module.scss'

interface Props extends PopupProps {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const PopupMap: React.FC<Props> = (props): React.ReactElement => {
    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const closePopup = () => {
        removePopup(props.id ? props.id : '')
    }

    const coordinates = useMemo(() => {
        if (!props.building.coordinates) {
            return []
        }

        const coordinates = props.building.coordinates.split(',').map(Number)

        if (!coordinates || !coordinates.length || coordinates.length !== 2) {
            return []
        }

        return coordinates
    }, [props.building.coordinates])

    const mapState: MapState = useMemo(() => {
        return {
            center: coordinates.length ? coordinates : [55.76, 37.64],
            zoom: 10,
            controls: [],
            type: 'yandex#map'
        }
    }, [coordinates])

    const presetIcon = configuration.apiYandexMapIcon

    return (
        <Popup className={classes.PopupMap}>
            <div className={classes.content}>
                <div className={classes.map}>
                    {configuration.apiYandexMapKey ?
                        coordinates.length ?
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

                                    <Placemark geometry={coordinates}
                                               options={{
                                                   preset: presetIcon
                                               }}
                                    />
                                </Map>
                            </YMaps>
                            : <Empty message='Адрес объекта недвижимости указан некорректно!'/>
                        : <Empty message='API ключ для Yandex.Maps не указан. Карта не доступна!'/>
                    }
                </div>
            </div>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={closePopup.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupMap.defaultProps = defaultProps
PopupMap.displayName = 'PopupMap'

export default function openPopupMap(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupMap, popupProps, undefined, block, displayOptions)
}