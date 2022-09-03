import React, {useEffect, useState} from 'react'
import moment from 'moment'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBooking} from '../../../@types/IBooking'
import {bookingStatuses} from '../../../helpers/bookingHelper'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import BookingService from '../../../api/BookingService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Empty from '../../Empty/Empty'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import {DatePickerBox} from '../../form/DatePickerBox/DatePickerBox'
import BuildingBox from '../../form/BuildingBox/BuildingBox'
import ComboBox from '../../ComboBox/ComboBox'
import UserBox from '../../form/UserBox/UserBox'
import classes from './PopupBookingInfo.module.scss'

interface Props extends PopupProps {
    bookingId?: number | null
    booking?: IBooking | null
}

const defaultProps: Props = {
    bookingId: null,
}

const PopupBookingInfo: React.FC<Props> = (props) => {
    const {userId} = useTypedSelector(state => state.userReducer)

    const [booking, setBooking] = useState<IBooking>({
        id: null,
        dateStart: moment().format('L'),
        dateFinish: moment().format('L'),
        status: 'new',
        buildingId: 0,
        buildingName: '',
        userId: userId
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.booking) {
            setBooking(props.booking)
        } else if (props.bookingId) {
            setFetching(true)

            BookingService.fetchBookingById(props.bookingId)
                .then((response: any) => {
                    setBooking(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки данных!', error)
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }, [props.bookingId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const renderBookingInformation = () => {
        return (
            <>
                <Title type={2}>{`Бронь #${booking.id}`}</Title>

                <div className={classes.field}>
                    <Label text='Дата заезда'/>

                    <DatePickerBox date={booking.dateStart}
                                   onSelect={(value: string) => setBooking({
                                       ...booking,
                                       dateStart: value
                                   })}
                                   placeHolder='Выберите дату заезда'
                                   styleType='minimal'
                                   readOnly
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Дата выезда'/>

                    <DatePickerBox date={booking.dateFinish}
                                   onSelect={(value: string) => setBooking({
                                       ...booking,
                                       dateFinish: value
                                   })}
                                   placeHolder='Выберите дату выезда'
                                   styleType='minimal'
                                   readOnly
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Объект недвижимости'/>

                    <BuildingBox buildings={booking.buildingId ? [booking.buildingId] : []}
                                 onSelect={(value: number[]) => setBooking({...booking, buildingId: value[0]})}
                                 placeHolder='Выберите объект недвижимости'
                                 styleType='minimal'
                                 readOnly
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Статус бронирования'/>

                    <ComboBox selected={booking.status}
                              items={Object.values(bookingStatuses)}
                              onSelect={(value: string) => setBooking({...booking, status: value})}
                              placeHolder='Выберите статус бронирования'
                              styleType='minimal'
                              readOnly
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Пользователь'/>

                    <UserBox users={booking.userId ? [booking.userId] : []}
                             onSelect={(value: number[]) => {
                                 setBooking({
                                     ...booking,
                                     userId: value.length ? value[0] : 0
                                 })
                             }}
                             placeHolder='Выберите пользователя'
                             styleType='minimal'
                             readOnly
                    />
                </div>
            </>
        )
    }

    return (
        <Popup className={classes.PopupBookingInfo}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    {!booking.id ? <Empty message='Бронь не найдена'/> : renderBookingInformation()}
                </div>
            </BlockingElement>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={close.bind(this)}
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupBookingInfo.defaultProps = defaultProps
PopupBookingInfo.displayName = 'PopupBookingInfo'

export default function openPopupBookingInfo(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBookingInfo), popupProps, undefined, block, displayOptions)
}