import React from 'react'
import BookingItem from './components/BookingItem/BookingItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IBooking} from '../../../../../@types/IBooking'
import classes from './BookingList.module.scss'

interface Props {
    bookings: IBooking[]
    fetching: boolean

    onClick(booking: IBooking): void

    onEdit(booking: IBooking): void

    onRemove(booking: IBooking): void

    onContextMenu(e: React.MouseEvent, booking: IBooking): void
}

const defaultProps: Props = {
    bookings: [],
    fetching: false,
    onClick: (booking: IBooking) => {
        console.info('BusinessProcessList onClick', booking)
    },
    onEdit: (booking: IBooking) => {
        console.info('BusinessProcessList onEdit', booking)
    },
    onRemove: (booking: IBooking) => {
        console.info('BusinessProcessList onRemove', booking)
    },
    onContextMenu: (e: React.MouseEvent, booking: IBooking) => {
        console.info('BusinessProcessList onContextMenu', e, booking)
    }
}

const BookingList: React.FC<Props> = (props) => {
    return (
        <div className={classes.BookingList}>
            <div className={classes.head}>
                <div className={classes.name}>Наименование объекта</div>
                <div className={classes.status}>Статус</div>
                <div className={classes.date}>Дата заезда</div>
                <div className={classes.date}>Дата выезда</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.bookings.map((booking: IBooking) => {
                    return (
                        <BookingItem key={booking.id}
                                     booking={booking}
                                     onClick={props.onClick}
                                     onEdit={props.onEdit}
                                     onRemove={props.onRemove}
                                     onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

BookingList.defaultProps = defaultProps
BookingList.displayName = 'BookingList'

export default BookingList