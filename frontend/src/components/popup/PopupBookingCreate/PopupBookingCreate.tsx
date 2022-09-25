import React, {useEffect, useState} from 'react'
import moment, {Moment} from 'moment'
import classNames from 'classnames/bind'
import withStore from '../../../hoc/withStore'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {bookingStatuses} from '../../../helpers/bookingHelper'
import BookingService from '../../../api/BookingService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBooking} from '../../../@types/IBooking'
import {IFilter} from '../../../@types/IFilter'
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
    buildingId?: number

    onSave(): void
}

const defaultProps: Props = {
    booking: null,
    onSave: () => {
        console.info('PopupBookingCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupBookingCreate: React.FC<Props> = (props) => {
    const {userId} = useTypedSelector(state => state.userReducer)

    const [booking, setBooking] = useState<IBooking>({
        id: null,
        dateStart: moment().format('L'),
        dateFinish: moment().format('L'),
        status: 'new',
        buildingId: props.buildingId || 0,
        buildingName: '',
        userId: userId
    })

    const [isBusy, setIsBusy] = useState(false)
    const [busyDays, setBusyDays] = useState<Moment[]>([])
    const [fetching, setFetching] = useState(false)

    const today = moment().format('L')

    useEffect(() => {
        if (props.booking) {
            setBooking({
                ...props.booking,
                dateStart: moment(props.booking.dateStart).format('L'),
                dateFinish: moment(props.booking.dateFinish).format('L')
            })
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        checkFreeDates()
    }, [booking.id, booking.dateStart, booking.dateFinish, booking.buildingId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        const saveBooking = {
            id: booking.id,
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

    const checkFreeDates = () => {
        if (
            today <= booking.dateStart &&
            today < booking.dateFinish &&
            booking.dateStart &&
            booking.dateFinish &&
            booking.buildingId &&
            booking.dateStart !== booking.dateFinish
        ) {
            setIsBusy(false)
            setFetching(true)

            const dateStart = moment(booking.dateStart)
            const dateFinish = moment(booking.dateFinish)
            const findDateStart = moment(booking.dateStart).add(-3, 'days')
            const findDateFinish = moment(booking.dateFinish).add(3, 'days')

            const filter: IFilter = {
                dateStart: findDateStart.format('YYYY-MM-DD 00:00:00'),
                dateFinish: findDateFinish.format('YYYY-MM-DD 00:00:00'),
                buildingId: [booking.buildingId],
                status: ['new', 'process', 'finish']
            }

            if (booking.id) {
                filter.id = [booking.id]
            }

            BookingService.fetchBookings(filter)
                .then((response: any) => {
                    const todayDate = moment()
                    const bookingList: IBooking[] = response.data
                    const dates: Moment[] = []

                    if (bookingList && bookingList.length) {
                        bookingList.forEach((item: IBooking) => {
                            const start = moment(item.dateStart)
                            const finish = moment(item.dateFinish)

                            while ((start.isAfter(todayDate) || start.isSame(todayDate) || finish.isAfter(todayDate) || finish.isSame(todayDate)) && (start.isSame(finish) || start.isBefore(finish))) {
                                if (start.isSame(dateStart) || start.isSame(dateFinish) || (start.isAfter(dateStart) && start.isBefore(dateFinish))) {
                                    setIsBusy(true)
                                }

                                dates.push(start.clone())
                                start.add(1, 'days')
                            }
                        })
                    }

                    setBusyDays(dates)
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
    }

    // Проверка доступности кнопок
    const checkDisabled = (): boolean => {
        if (fetching || booking.buildingId === 0) {
            return true
        }

        if (booking.dateStart.trim() === '' || booking.dateFinish.trim() === '') {
            return true
        }

        if (booking.dateStart >= booking.dateFinish || today > booking.dateStart || today >= booking.dateFinish) {
            return true
        }

        return isBusy;
    }

    const checkCurrentDateWithBusy = (date: Moment): boolean => {
        // Todo
        return false
    }

    const renderDatesItems = () => {
        const findDateStart = moment(booking.dateStart).add(-3, 'days')
        const findDateFinish = moment(booking.dateFinish).add(3, 'days')
        const todayDate = moment()
        let index = 0

        const items = []

        while (findDateStart.isBefore(findDateFinish) || findDateStart.isSame(findDateFinish)) {
            let style = 'free'
            let title = 'Свободно'

            if (findDateStart.isSame(todayDate) || findDateStart.isAfter(todayDate)) {
                if (busyDays.length) {
                    busyDays.forEach((day: Moment) => {
                        if (findDateStart.isSame(day)) {
                            style = 'busy'
                            title = 'Занято'

                            return
                        }
                    })
                }

                const item = (
                    <div key={index} className={cx({item: true, [style]: true})} title={title}>
                        {findDateStart.format('DD.MM.YYYY')}
                    </div>
                )

                items.push(item)
            }

            findDateStart.add(1, 'days')
            index++
        }

        return items
    }

    const renderBusyBooking = () => {
        if (!isBusy) {
            return null
        }

        return (
            <>
                <Title type={2}>Таблица свободных дат</Title>

                <div className={classes.busyList}>
                    {renderDatesItems()}
                </div>
            </>
        )
    }

    const checkDateStartError = () => {
        if (booking.dateStart === booking.dateFinish) {
            return {
                error: true,
                text: 'Дата заезда и дата выезда не могут быть одинаковыми'
            }
        }

        if (today > booking.dateStart) {
            return {
                error: true,
                text: 'Дата заезда не может быть раньше сегодняшнего дня'
            }
        }

        if (isBusy) {
            return {
                error: true,
                text: 'На текущие даты объект недвижимости занят'
            }
        }

        return {
            error: false,
            text: ''
        }
    }

    const checkDateFinishError = () => {
        if (booking.dateStart === booking.dateFinish) {
            return {
                error: true,
                text: 'Дата заезда и дата выезда не могут быть одинаковыми'
            }
        }

        if (booking.dateStart >= booking.dateFinish) {
            return {
                error: true,
                text: 'Дата выезда не может быть раньше даты заезда'
            }
        }

        if (today >= booking.dateFinish) {
            return {
                error: true,
                text: 'Дата выезда не может быть раньше сегодняшнего дня'
            }
        }

        if (isBusy) {
            return {
                error: true,
                text: 'На текущие даты объект недвижимости занят'
            }
        }

        return {
            error: false,
            text: ''
        }
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
                                       error={checkDateStartError().error}
                                       errorText={checkDateStartError().text}
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
                                       error={checkDateFinishError().error}
                                       errorText={checkDateFinishError().text}
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Объект недвижимости'/>

                        <BuildingBox buildings={booking.buildingId ? [booking.buildingId] : []}
                                     onSelect={(value: number[]) => setBooking({...booking, buildingId: value[0]})}
                                     placeHolder='Выберите объект недвижимости'
                                     styleType='minimal'
                                     readOnly={!!props.buildingId}
                                     onlyRent
                                     showRequired
                        />
                    </div>

                    {!props.buildingId ?
                        <div className={classes.field}>
                            <Label text='Статус бронирования'/>

                            <ComboBox selected={booking.status}
                                      items={Object.values(bookingStatuses)}
                                      onSelect={(value: string) => setBooking({...booking, status: value})}
                                      placeHolder='Выберите статус бронирования'
                                      styleType='minimal'
                            />
                        </div>
                        : null
                    }

                    {renderBusyBooking()}
                </div>
            </BlockingElement>

            <Footer>
                {!props.buildingId ?
                    <>
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
                    </>
                    :
                    <Button type='save'
                            icon='house-laptop'
                            onClick={() => saveHandler(true)}
                            disabled={checkDisabled()}
                            title='Забронировать'
                    >Забронировать</Button>
                }

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