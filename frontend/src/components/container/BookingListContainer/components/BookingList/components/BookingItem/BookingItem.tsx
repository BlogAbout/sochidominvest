import React from 'react'
import classNames from 'classnames/bind'
import {IBooking} from '../../../../../../../@types/IBooking'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import {getBookingStatusText} from '../../../../../../../helpers/bookingHelper'
import classes from './BookingItem.module.scss'

interface Props {
    booking: IBooking

    onClick(booking: IBooking): void

    onEdit(booking: IBooking): void

    onRemove(booking: IBooking): void

    onContextMenu(e: React.MouseEvent, booking: IBooking): void
}

const defaultProps: Props = {
    booking: {} as IBooking,
    onClick: (booking: IBooking) => {
        console.info('BookingItem onClick', booking)
    },
    onEdit: (booking: IBooking) => {
        console.info('BookingItem onEdit', booking)
    },
    onRemove: (booking: IBooking) => {
        console.info('BookingItem onRemove', booking)
    },
    onContextMenu: (e: React.MouseEvent, booking: IBooking) => {
        console.info('BookingItem onContextMenu', e, booking)
    }
}

const cx = classNames.bind(classes)

const BookingItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'BookingItem': true, [props.booking.status]: true})}
             onClick={() => props.onClick(props.booking)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.booking)}
        >
            <div className={classes.name}>{props.booking.buildingName}</div>
            <div className={classes.status}>{getBookingStatusText(props.booking.status)}</div>
            <div className={classes.dateStart}>{getFormatDate(props.booking.dateStart, 'date')}</div>
            <div className={classes.dateFinish}>{getFormatDate(props.booking.dateFinish, 'date')}</div>
        </div>
    )
}

BookingItem.defaultProps = defaultProps
BookingItem.displayName = 'BookingItem'

export default BookingItem