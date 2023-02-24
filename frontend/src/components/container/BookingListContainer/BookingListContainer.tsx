import React from 'react'
import {IBooking} from '../../../@types/IBooking'
import Empty from '../../ui/Empty/Empty'
import BookingList from './components/BookingList/BookingList'
import classes from './BookingListContainer.module.scss'

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
        console.info('BookingListContainer onClick', booking)
    },
    onEdit: (booking: IBooking) => {
        console.info('BookingListContainer onEdit', booking)
    },
    onRemove: (booking: IBooking) => {
        console.info('BookingListContainer onRemove', booking)
    },
    onContextMenu: (e: React.MouseEvent, booking: IBooking) => {
        console.info('BookingListContainer onContextMenu', e, booking)
    }
}

const BookingListContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.BookingListContainer}>
            {props.bookings.length ?
                <BookingList bookings={props.bookings}
                             fetching={props.fetching}
                             onClick={props.onClick}
                             onEdit={props.onEdit}
                             onRemove={props.onRemove}
                             onContextMenu={props.onContextMenu}
                />
                : <Empty message='Нет объектов бронирования'/>
            }
        </div>
    )
}

BookingListContainer.defaultProps = defaultProps
BookingListContainer.displayName = 'BookingListContainer'

export default BookingListContainer