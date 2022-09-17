import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import PaymentService from '../../../api/PaymentService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IPayment} from '../../../@types/IPayment'
import {paymentStatuses} from '../../../helpers/paymentHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import UserBox from '../../form/UserBox/UserBox'
import NumberBox from '../../NumberBox/NumberBox'
import classes from './PopupPaymentCreate.module.scss'

interface Props extends PopupProps {
    payment?: IPayment | null

    onSave(): void
}

const defaultProps: Props = {
    payment: null,
    onSave: () => {
        console.info('PopupPaymentCreate onSave')
    }
}

const PopupPaymentCreate: React.FC<Props> = (props) => {
    const {userId} = useTypedSelector(state => state.userReducer)

    const [fetching, setFetching] = useState(false)
    const [sendLink, setSendLink] = useState(false)
    const [payment, setPayment] = useState<IPayment>(props.payment || {
        id: null,
        name: '',
        status: 'new',
        userId: userId,
        cost: 0,
        objectId: 0,
        objectType: ''
    })

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        PaymentService.savePayment(payment, sendLink)
            .then((response: any) => {
                setFetching(false)
                setPayment(response.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
    }

    return (
        <Popup className={classes.PopupPaymentCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о платеже</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={payment.name}
                                 onChange={(e: React.MouseEvent, value: string) => setPayment({
                                     ...payment,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={payment.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Статус'/>

                        <ComboBox selected={payment.status}
                                  items={Object.values(paymentStatuses)}
                                  onSelect={(value: string) => setPayment({...payment, status: value})}
                                  placeHolder='Выберите статус'
                                  styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Плательщик'/>

                        <UserBox users={payment.userId ? [payment.userId] : []}
                                 onSelect={(value: number[]) => {
                                     setPayment({
                                         ...payment,
                                         userId: value.length ? value[0] : 0
                                     })
                                 }}
                                 placeHolder='Выберите плательщика'
                                 error={!payment.userId}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Сумма платежа, руб.'/>

                        <NumberBox value={payment.cost || ''}
                                   min={0}
                                   step={1}
                                   max={999999999}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setPayment({
                                       ...payment,
                                       cost: value
                                   })}
                                   placeHolder='Введите сумму платежа'
                                   error={!payment.cost}
                                   showRequired
                                   errorText='Поле обязательно для заполнения'
                                   styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Отправить ссылку плательщику (в разработке)'
                                  title='Отправить ссылку плательщику (в разработке)'
                                  type='modern'
                                  width={150}
                                  checked={sendLink}
                                  onChange={(e: React.MouseEvent, value: boolean) => setSendLink(value)}
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || payment.name.trim() === '' || !payment.userId || !payment.cost}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || payment.name.trim() === '' || !payment.userId || !payment.cost}
                        className='marginLeft'
                        title='Сохранить'
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupPaymentCreate.defaultProps = defaultProps
PopupPaymentCreate.displayName = 'PopupPaymentCreate'

export default function openPopupPaymentCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupPaymentCreate), popupProps, undefined, block, displayOptions)
}