import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IPayment} from '../../../../../@types/IPayment'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import Title from '../../../../../components/ui/Title/Title'
import PaymentListContainer from '../../../../../components/container/PaymentListContainer/PaymentListContainer'
import openPopupPaymentCreate from '../../../../../components/popup/PopupPaymentCreate/PopupPaymentCreate'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import PaymentService from '../../../../../api/PaymentService'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './PaymentPagePanel.module.scss'

const PaymentPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [payments, setPayments] = useState<IPayment[]>([])
    const [filterPayments, setFilterPayments] = useState<IPayment[]>([])
    const [fetching, setFetching] = useState(false)

    const {role, users, fetching: fetchingUsers} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (isUpdate || !users || !users.length) {
            fetchUserList({active: [0, 1]})
        }

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

    // Создание платежа
    const onAddHandler = (type: 'createOrder') => {
        openPopupPaymentCreate(document.body, {
            onSave: onSaveHandler.bind(this)
        })
    }

    // Клик на платеж
    const onClickHandler = (payment: IPayment) => {
        // Todo
    }

    // Редактирование платежа
    const onEditHandler = (payment: IPayment) => {
        openPopupPaymentCreate(document.body, {
            payment: payment,
            onSave: onSaveHandler.bind(this)
        })
    }

    // Копирование платежа
    const onCopyHandler = (payment: IPayment) => {
        const newPayment: IPayment = {
            id: null,
            name: payment.name,
            status: 'new',
            userId: payment.userId,
            userEmail: payment.userEmail,
            userName: payment.userName,
            cost: payment.cost,
            objectId: payment.objectId,
            objectType: payment.objectType
        }

        openPopupPaymentCreate(document.body, {
            payment: newPayment,
            onSave: onSaveHandler.bind(this)
        })
    }

    // Переход по ссылке на платежную форму
    const onOpenLinkHandler = (payment: IPayment) => {
        if (payment.id) {
            setFetching(true)

            PaymentService.fetchLinkPayment(payment.id)
                .then((response: any) => {
                    if (response.data.status) {
                        window.location.href = response.data.data
                    } else {
                        openPopupAlert(document.body, {
                            title: 'Ошибка!',
                            text: response.data.data
                        })
                    }
                })
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data.data
                    })
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }

    // Отправка ссылки на платежную форму плательщику на почту
    const onSendLinkHandler = (payment: IPayment) => {
        setFetching(true)

        PaymentService.savePayment(payment, true)
            .then(() => {
                openPopupAlert(document.body, {
                    title: 'Ссылка отправлена!',
                    text: 'Ссылка на форму оплаты успешно отправлена.'
                })
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetching(false))
    }

    //
    const onContextMenuItem = (e: React.MouseEvent, payment: IPayment) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = []

            if (!payment.datePaid) {
                menuItems.push({text: 'Перейти к оплате', onClick: () => onOpenLinkHandler(payment)})
                menuItems.push({text: 'Отправить ссылку', onClick: () => onSendLinkHandler(payment)})
            }

            menuItems.push({text: 'Копировать', onClick: () => onCopyHandler(payment)})
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(payment)})

            openContextMenu(e, menuItems)
        }
    }

    // Меню выбора создания платежа
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Выставить счёт', onClick: () => onAddHandler('createOrder')}
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
                                      fetching={fetching || fetchingUsers}
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