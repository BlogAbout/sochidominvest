import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {IBooking} from '../../../../../@types/IBooking'
import {IFilter} from '../../../../../@types/IFilter'
import {IBusinessProcess} from '../../../../../@types/IBusinessProcess'
import BookingService from '../../../../../api/BookingService'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import Title from '../../../../../components/ui/Title/Title'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import BookingListContainer from '../../../../../components/container/BookingListContainer/BookingListContainer'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupBookingCreate from '../../../../../components/popup/PopupBookingCreate/PopupBookingCreate'
import openPopupBusinessProcessCreate
    from '../../../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import openPopupBookingInfo from '../../../../../components/popup/PopupBookingInfo/PopupBookingInfo'
import classes from './BookingPagePanel.module.scss'

const BookingPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [booking, setBooking] = useState<IBooking[]>([])
    const [filter, setFilter] = useState<IFilter>({})
    const [fetching, setFetching] = useState(false)

    const {userId, role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate) {
            setFetching(true)

            BookingService.fetchBookings(filter)
                .then((response: any) => {
                    setBooking(response.data)
                })
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
                .finally(() => {
                    setFetching(false)
                })

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Клик на строку
    const onClickHandler = (booking: IBooking) => {
        openPopupBookingInfo(document.body, {
            booking: booking
        })
    }

    // Отправка заявки в обработку
    const onProcessHandler = (booking: IBooking) => {
        if (!booking.id) {
            return
        }

        const businessProcess: IBusinessProcess = {
            id: null,
            ticketId: null,
            author: userId,
            responsible: userId,
            active: 1,
            type: 'booking',
            step: 'default',
            name: `Бронь #${booking.id}: ${booking.buildingName}`,
            description: `Бронь на аренду недвижимости ${booking.buildingName} с ${getFormatDate(booking.dateStart, 'date')} по ${getFormatDate(booking.dateFinish, 'date')}`,
            relations: [
                {objectId: booking.id, objectType: 'booking'}
            ]
        }

        openPopupBusinessProcessCreate(document.body, {
            businessProcess: businessProcess,
            onSave: () => {
                navigate('/panel/crm/bp/')
            }
        })
    }

    // Добавление нового бронирования
    const onAddHandler = () => {
        openPopupBookingCreate(document.body, {
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Редактирование
    const onEditHandler = (booking: IBooking) => {
        openPopupBookingCreate(document.body, {
            booking: booking,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (booking: IBooking) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить бронь для ${booking.buildingName} на ${getFormatDate(booking.dateStart)} - ${getFormatDate(booking.dateFinish)}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        booking.status = 'remove'

                        setFetching(true)

                        BookingService.saveBooking(booking)
                            .then(() => {
                                onSaveHandler()
                            })
                            .catch((error: any) => {
                                openPopupAlert(document.body, {
                                    title: 'Ошибка!',
                                    text: error.data
                                })
                            })
                            .finally(() => {
                                setFetching(false)
                            })
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, booking: IBooking) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [
                {text: 'Взять в обработку', onClick: () => onProcessHandler(booking)},
                {text: 'Редактировать', onClick: () => onEditHandler(booking)}
            ]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(booking)})
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <main className={classes.BookingPagePanel}>
            <PageInfo title='Список бронирования'/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Список бронирования</Title>

                <BookingListContainer bookings={booking}
                                      fetching={fetching}
                                      onClick={onClickHandler.bind(this)}
                                      onEdit={onEditHandler.bind(this)}
                                      onRemove={onRemoveHandler.bind(this)}
                                      onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

BookingPagePanel.displayName = 'BookingPagePanel'

export default BookingPagePanel