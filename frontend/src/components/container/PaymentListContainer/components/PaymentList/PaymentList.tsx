import React from 'react'
import PaymentItem from './components/PaymentItem/PaymentItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IPayment} from '../../../../../@types/IPayment'
import classes from './PaymentList.module.scss'

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
        console.info('DocumentList onClick', payment)
    },
    onEdit: (payment: IPayment) => {
        console.info('DocumentList onEdit', payment)
    },
    onContextMenu: (e: React.MouseEvent, payment: IPayment) => {
        console.info('DocumentList onContextMenu', e, payment)
    }
}

const PaymentList: React.FC<Props> = (props) => {
    return (
        <div className={classes.PaymentList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Название</div>
                <div className={classes.userName}>Имя пользователя</div>
                <div className={classes.cost}>Сумма, руб.</div>
                <div className={classes.status}>Статус</div>
                <div className={classes.dateCreated}>Дата создания</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.payments.map((payment: IPayment) => {
                    return (
                        <PaymentItem key={payment.id}
                                     payment={payment}
                                     onClick={props.onClick}
                                     onEdit={props.onEdit}
                                     onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

PaymentList.defaultProps = defaultProps
PaymentList.displayName = 'PaymentList'

export default PaymentList