import moment from 'moment'
import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {bookingStatuses} from '../../../helpers/bookingHelper'
import BookingService from '../../../api/BookingService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBooking} from '../../../@types/IBooking'
import {getFormatDate} from '../../../helpers/dateHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import BuildingBox from '../../form/BuildingBox/BuildingBox'
import {DatePickerBox} from '../../form/DatePickerBox/DatePickerBox'
import classes from './PopupBookingCreate.module.scss'

interface Props extends PopupProps {
    booking?: IBooking | null

    onSave(): void
}

const defaultProps: Props = {
    booking: null,
    onSave: () => {
        console.info('PopupBookingCreate onSave')
    }
}

const PopupBookingCreate: React.FC<Props> = (props) => {
    const {userId} = useTypedSelector(state => state.userReducer)

    const [booking, setBooking] = useState<IBooking>(props.booking || {
        dateStart: moment().format('L'),
        dateFinish: moment().format('L'),
        status: 'new',
        buildingId: 0,
        buildingName: '',
        userId: userId
    })

    const [busyBooking, setBusyBooking] = useState<IBooking[]>([])
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (booking.dateStart && booking.dateFinish && booking.buildingId && booking.dateStart != booking.dateFinish) {
            setFetching(true)

            BookingService.fetchBookings({
                dateStart: moment(booking.dateStart).format('YYYY-MM-DD 00:00:00'),
                dateFinish: moment(booking.dateFinish).format('YYYY-MM-DD 00:00:00'),
                buildingId: [booking.buildingId]
            })
                .then((response: any) => {
                    setBusyBooking(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка!', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }, [booking.dateStart, booking.dateFinish, booking.buildingId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        const saveBooking = {
            dateStart: moment(booking.dateStart).format('YYYY-MM-DD 00:00:00'),
            dateFinish: moment(booking.dateFinish).format('YYYY-MM-DD 00:00:00'),
            status: booking.status,
            buildingId: booking.buildingId,
            buildingName: booking.buildingName,
            userId: booking.userId
        }

        BookingService.saveBooking(saveBooking)
            .then((response: any) => {
                setBooking(response.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                console.error('Ошибка!', error)

                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Проверка доступности кнопок
    const checkDisabled = (): boolean => {
        if (fetching || booking.dateStart.trim() === '' || booking.dateFinish.trim() === '' || booking.buildingId === 0 || booking.dateStart >= booking.dateFinish) {
            return true
        }

        return !!busyBooking.length;
    }

    const renderBusyBooking = () => {
        if (!busyBooking.length) {
            return null
        }

        return (
            <>
                <Title type={2}>Даты, занятые в выбранный период</Title>

                <div className={classes.busyList}>
                    {busyBooking.map((booking: IBooking, index: number) => {
                        return (
                            <div key={index} className={classes.item}>
                                {`${getFormatDate(booking.dateStart, 'date')} - ${getFormatDate(booking.dateFinish, 'date')}`}
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }

    return (
        <Popup className={classes.PopupBookingCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о бронировании</Title>

                    <div className={classes.field}>
                        <Label text='Дата заезда'/>

                        <DatePickerBox date={booking.dateStart}
                                       onSelect={(value: string) => setBooking({
                                           ...booking,
                                           dateStart: value
                                       })}
                                       placeHolder='Выберите дату заезда'
                                       styleType='minimal'
                                       error={booking.dateStart == booking.dateFinish}
                                       errorText='Дата заезда и дата выезда не могут быть одинаковыми'
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
                                       error={booking.dateStart >= booking.dateFinish}
                                       errorText={booking.dateStart == booking.dateFinish ? 'Дата заезда и дата выезда не могут быть одинаковыми' : 'Дата выезда не может быть раньше даты заезда'}
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Объект недвижимости'/>

                        <BuildingBox buildings={booking.buildingId ? [booking.buildingId] : []}
                                     onSelect={(value: number[]) => setBooking({...booking, buildingId: value[0]})}
                                     placeHolder='Выберите объект недвижимости'
                                     styleType='minimal'
                                     onlyRent
                                     showRequired
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Статус бронирования'/>

                        <ComboBox selected={booking.status}
                                  items={Object.values(bookingStatuses)}
                                  onSelect={(value: string) => setBooking({...booking, status: value})}
                                  placeHolder='Выберите статус бронирования'
                                  styleType='minimal'
                        />
                    </div>

                    {renderBusyBooking()}
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={checkDisabled()}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={checkDisabled()}
                        className='marginLeft'
                        title='Сохранить'
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

PopupBookingCreate.defaultProps = defaultProps
PopupBookingCreate.displayName = 'PopupBookingCreate'

export default function openPopupBookingCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBookingCreate), popupProps, undefined, block, displayOptions)
}