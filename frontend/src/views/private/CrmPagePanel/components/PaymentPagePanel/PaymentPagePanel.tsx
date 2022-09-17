import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {IPayment} from '../../../../../@types/IPayment'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import Title from '../../../../../components/ui/Title/Title'
import PaymentListContainer from '../../../../../components/container/PaymentListContainer/PaymentListContainer'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import PaymentService from '../../../../../api/PaymentService'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './PaymentPagePanel.module.scss'

const PaymentPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [payments, setPayments] = useState<IPayment[]>([])
    const [filterPayments, setFilterPayments] = useState<IPayment[]>([])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate || !payments || !payments.length) {
            setFetching(true)

            PaymentService.fetchPayments({})
                .then((response: any) => {
                    setPayments(response.data)
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

        setIsUpdate(false)
    }, [isUpdate])

    useEffect(() => {
        setFilterPayments(payments)
    }, [payments])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    const onAddHandler = (type: 'createOrder') => {
        // Todo
    }

    const onClickHandler = (payment: IPayment) => {
        // Todo
    }

    const onEditHandler = (payment: IPayment) => {
        // Todo
    }

    const onContextMenuItem = (e: React.MouseEvent, payment: IPayment) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(payment)}]

            openContextMenu(e, menuItems)
        }
    }

    // Меню выбора создания платежа
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Выставить счёт (в разработке)', onClick: () => onAddHandler('createOrder')}
        ]

        openContextMenu(e.currentTarget, menuItems)
    }

    return (
        <main className={classes.PaymentPagePanel}>
            <PageInfo title='Платежи и транзакции'/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onContextMenu.bind(this)}
                >Платежи и транзакции</Title>

                <PaymentListContainer payments={filterPayments}
                                      fetching={fetching}
                                      onClick={onClickHandler.bind(this)}
                                      onEdit={onEditHandler.bind(this)}
                                      onContextMenu={onContextMenuItem.bind(this)}
                />
            </div>
        </main>
    )
}

PaymentPagePanel.displayName = 'PaymentPagePanel'

export default PaymentPagePanel