import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import {IPayment} from '../../../../../../../@types/IPayment'
import {getUserName} from '../../../../../../../helpers/userHelper'
import {getPaymentStatusText} from '../../../../../../../helpers/paymentHelper'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import {numberWithSpaces, round} from '../../../../../../../helpers/numberHelper'
import classes from './PaymentItem.module.scss'

interface Props {
    payment: IPayment

    onClick(payment: IPayment): void

    onEdit(payment: IPayment): void

    onContextMenu(e: React.MouseEvent, payment: IPayment): void
}

const defaultProps: Props = {
    payment: {} as IPayment,
    onClick: (payment: IPayment) => {
        console.info('PaymentItem onClick', payment)
    },
    onEdit: (payment: IPayment) => {
        console.info('PaymentItem onEdit', payment)
    },
    onContextMenu: (e: React.MouseEvent, payment: IPayment) => {
        console.info('PaymentItem onContextMenu', e, payment)
    }
}

const cx = classNames.bind(classes)

const PaymentItem: React.FC<Props> = (props) => {
    const {users} = useTypedSelector(state => state.userReducer)

    return (
        <div className={cx({'PaymentItem': true, [props.payment.status]: true})}
             onClick={() => props.onClick(props.payment)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.payment)}
        >
            <div className={classes.id}>{props.payment.id}</div>
            <div className={classes.name}>{props.payment.name}</div>
            <div className={classes.userName}>{props.payment.userName || getUserName(users, props.payment.userId)}</div>
            <div className={classes.cost}>{numberWithSpaces(round(props.payment.cost || 0, 0))}</div>
            <div className={classes.status}>{getPaymentStatusText(props.payment.status)}</div>
            <div className={classes.dateCreated}>{getFormatDate(props.payment.dateCreated)}</div>
        </div>
    )
}

PaymentItem.defaultProps = defaultProps
PaymentItem.displayName = 'PaymentItem'

export default PaymentItem