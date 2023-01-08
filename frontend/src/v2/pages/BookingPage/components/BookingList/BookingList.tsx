import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {IBooking} from '../../../../../@types/IBooking'
import {IBusinessProcess} from '../../../../../@types/IBusinessProcess'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {getBookingStatusText} from '../../../../../helpers/bookingHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import BookingService from '../../../../../api/BookingService'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupBookingInfo from '../../../../../components/popup/PopupBookingInfo/PopupBookingInfo'
import openPopupBookingCreate from '../../../../../components/popup/PopupBookingCreate/PopupBookingCreate'
import openPopupBusinessProcessCreate
    from '../../../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import classes from './BookingList.module.scss'

interface Props {
    list: IBooking[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('BusinessProcessList onSave')
    }
}

const BookingList: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(props.fetching)

    const {user} = useTypedSelector(state => state.userReducer)

    // Отправка заявки в обработку
    const onProcessHandler = (booking: IBooking) => {
        if (!booking.id) {
            return
        }

        const businessProcess: IBusinessProcess = {
            id: null,
            ticketId: null,
            author: user.id,
            responsible: user.id,
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

    // Редактирование
    const onEditHandler = (booking: IBooking) => {
        openPopupBookingCreate(document.body, {
            booking: booking,
            onSave: () => props.onSave()
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
                            .then(() => props.onSave())
                            .catch((error: any) => {
                                openPopupAlert(document.body, {
                                    title: 'Ошибка!',
                                    text: error.data
                                })
                            })
                            .finally(() => setFetching(false))
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenuHandler = (booking: IBooking, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [
                {text: 'Взять в обработку', onClick: () => onProcessHandler(booking)},
                {text: 'Редактировать', onClick: () => onEditHandler(booking)}
            ]

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(booking)})
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <List className={classes.BookingList}>
            <ListHead>
                <ListCell className={classes.name}>Наименование объекта</ListCell>
                <ListCell className={classes.status}>Статус</ListCell>
                <ListCell className={classes.dateStart}>Дата заезда</ListCell>
                <ListCell className={classes.dateFinish}>Дата выезда</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((booking: IBooking) => {
                        return (
                            <ListRow key={booking.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(booking, e)}
                                     onClick={() => openPopupBookingInfo(document.body, {
                                         booking: booking
                                     })}
                            >
                                <ListCell className={classes.name}>{booking.buildingName}</ListCell>
                                <ListCell className={classes.status}>{getBookingStatusText(booking.status)}</ListCell>
                                <ListCell
                                    className={classes.dateStart}>{getFormatDate(booking.dateStart, 'date')}</ListCell>
                                <ListCell
                                    className={classes.dateFinish}>{getFormatDate(booking.dateFinish, 'date')}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет объектов бронирования'/>
                }
            </ListBody>
        </List>
    )
}

BookingList.defaultProps = defaultProps
BookingList.displayName = 'BookingList'

export default React.memo(BookingList)