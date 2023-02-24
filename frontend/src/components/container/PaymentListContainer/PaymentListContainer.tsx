import React from 'react'
import {IPayment} from '../../../@types/IPayment'
import Empty from '../../ui/Empty/Empty'
import PaymentList from './components/PaymentList/PaymentList'
import classes from './PaymentListContainer.module.scss'

interface Props {
    payments: IPayment[]
    fetching: boolean

    onClick(payment: IPayment): void

    onEdit(payment: IPayment): void

    onContextMenu(e: React.MouseEvent, payment: IPayment): void
}

const defaultProps: Props = {
    payments: [],
    fetching: false,
    onClick: (payment: IPayment) => {
        console.info('PaymentListContainer onClick', payment)
    },
    onEdit: (payment: IPayment) => {
        console.info('PaymentListContainer onEdit', payment)
    },
    onContextMenu: (e: React.MouseEvent, payment: IPayment) => {
        console.info('PaymentListContainer onContextMenu', e, payment)
    }
}

const PaymentListContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.PaymentListContainer}>
            {props.payments.length ?
                <PaymentList payments={props.payments}
                             fetching={props.fetching}
                             onClick={props.onClick}
                             onEdit={props.onEdit}
                             onContextMenu={props.onContextMenu}
                />
                : <Empty message='Нет платежей и транзакций'/>
            }
        </div>
    )
}

PaymentListContainer.defaultProps = defaultProps
PaymentListContainer.displayName = 'PaymentListContainer'

export default PaymentListContainer