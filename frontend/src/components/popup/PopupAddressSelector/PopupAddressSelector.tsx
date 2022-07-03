import React, {useEffect, useState} from 'react'
import {Map, MapState, Placemark, SearchControl, YMaps, ZoomControl} from 'react-yandex-maps'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {getSetting} from '../../../helpers/utilHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import Empty from '../../Empty/Empty'
import Label from '../../form/Label/Label'
import TextBox from '../../form/TextBox/TextBox'
import classes from './PopupAddressSelector.module.scss'

interface Props extends PopupProps {
    address: string
    coordinates: string

    onSave(address: string, coordinates: string): void
}

const defaultProps: Props = {
    address: '',
    coordinates: '',
    onSave: (address: string, coordinates: string) => {
        console.info('PopupAddressSelector onSave', address, coordinates)
    }
}

const PopupAddressSelector: React.FC<Props> = (props) => {
    const [yMaps, setYMaps] = useState<any>(null)
    const [address, setAddress] = useState(props.address || '')
    const [coordinates, setCoordinates] = useState<number[]>(props.coordinates ? props.coordinates.split(',').map(Number) : [])
        const [apiKey, setApiKey] = useState('3ed788dc-edd5-4bce-8720-6cd8464b45bd')
    const [presetIcon, setPresetIcon] = useState('islands#blueIcon')

    const {settings} = useTypedSelector(state => state.administrationReducer)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (settings) {
            setApiKey(getSetting('map_api_key', settings))
            setPresetIcon(getSetting('map_icon_color', settings))
        }
    }, [settings])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        if (!coordinates.length) {
            props.onSave(address, '')
        } else {
            props.onSave(address, coordinates.join(','))
        }

        close()
    }

    const updateCoordinatesAndAddressHandler = (coordinatesArray: number[]) => {
        setCoordinates(coordinatesArray)

        if (yMaps) {
            yMaps.geocode(coordinatesArray, {results: 1})
                .then((response: any) => {
                    const geoObject = response.geoObjects.get(0)
                    const resultAddress = [
                        geoObject.getLocalities().length ? geoObject.getLocalities().join(', ') : geoObject.getAdministrativeAreas(),
                        geoObject.getThoroughfare() || geoObject.getPremise(),
                        geoObject.getPremiseNumber()
                    ].filter(Boolean).join(', ')

                    setAddress(resultAddress)
                })
                .catch((error: any) => {
                    console.error('Ошибка получения данных геокодирования.', error)
                })
        }
    }

    const mapState: MapState = {
        center: coordinates.length ? coordinates : [55.76, 37.64],
        zoom: 10,
        controls: [],
        type: 'yandex#map'
    }

    const renderContentBlock = () => {
        console.log('settings', settings)
        return (
            <div key='content' className={classes.blockContent}>
                <Title type={2}>Выбор адреса</Title>

                <div className={classes.field}>
                    <Label text='Адрес'/>

                    <TextBox value={address}
                             onChange={() => {
                             }}
                             placeHolder='Выберите адрес на карте ниже'
                             styleType='minimal'
                             readOnly
                    />
                </div>

                <div className={classes.map}>
                    {apiKey ?
                        <YMaps enterprise
                               query={{
                                   apikey: apiKey
                               }}
                        >
                            <Map state={mapState}
                                 width='100%'
                                 height='100%'
                                 modules={['ObjectManager', 'Placemark', 'geocode']}
                                 onClick={(result: any) => updateCoordinatesAndAddressHandler(result.get('coords'))}
                                 onLoad={(result: any) => setYMaps(result)}
                            >
                                <SearchControl
                                    onResultSelect={(result: any) => {
                                        setAddress(result.originalEvent.target.getRequestString())
                                        setCoordinates(result.originalEvent.target.getResultsArray()[0].geometry.getCoordinates())
                                    }}
                                />
                                <ZoomControl/>

                                {coordinates.length ?
                                    <Placemark
                                        geometry={coordinates}
                                        options={{
                                            preset: presetIcon,
                                            draggable: true
                                        }}
                                        onDragend={(result: any) => updateCoordinatesAndAddressHandler(result.originalEvent.target.geometry.getCoordinates())}
                                    />
                                    : null}
                            </Map>
                        </YMaps>
                        : <Empty message='API ключ для Yandex.Maps не указан. Карта не доступна!'/>}
                </div>
            </div>
        )
    }

    return (
        <Popup className={classes.PopupAddressSelector}>
            <div className={classes.content}>
                {renderContentBlock()}
            </div>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        title='Сохранить выбор'
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupAddressSelector.defaultProps = defaultProps
PopupAddressSelector.displayName = 'PopupAddressSelector'

export default function openPopupAddressSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupAddressSelector), popupProps, undefined, block, displayOptions)
}