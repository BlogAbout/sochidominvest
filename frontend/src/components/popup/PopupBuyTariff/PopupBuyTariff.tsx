import React, {useEffect, useState} from 'react'
import moment from 'moment'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IUser} from '../../../@types/IUser'
import {ISelector} from '../../../@types/ISelector'
import {tariffs} from '../../../helpers/tariffHelper'
import {ITariff} from '../../../@types/ITariff'
import UserService from '../../../api/UserService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {numberWithSpaces} from '../../../helpers/numberHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import ComboBox from '../../ComboBox/ComboBox'
import NumberBox from '../../NumberBox/NumberBox'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import classes from './PopupBuyTariff.module.scss'

interface Props extends PopupProps {
    user: IUser
    tariff: ITariff

    onSave(user: IUser): void
}

const defaultProps: Props = {
    user: {} as IUser,
    tariff: {} as ITariff,
    onSave: (user: IUser) => {
        console.info('PopupBuyTariff onSave', user)
    }
}

const PopupBuyTariff: React.FC<Props> = (props) => {
    const [user, setUser] = useState<IUser>(props.user || {
        id: null,
        email: '',
        phone: '',
        password: '',
        firstName: '',
        role: 'subscriber',
        active: 1,
        lastActive: null,
        settings: null
    })
    const [currentTariff, setCurrentTariff] = useState(props.tariff.key || 'base')
    const [months, setMonths] = useState(1)
    const [total, setTotal] = useState(0)

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        const findTariff = tariffs.find((tariff: ITariff) => tariff.key === currentTariff)

        if (findTariff) {
            setTotal(findTariff.cost * months)
        }
    }, [currentTariff])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        if (!user.id) {
            return
        }

        // Todo: Реализовать псевдооплату
        setFetching(true)

        const dateExpiration = moment().add(months, 'months')

        const updateUser: IUser = JSON.parse(JSON.stringify(user))
        updateUser.tariff = currentTariff
        updateUser.tariffExpired = dateExpiration.format('YYYY-MM-DD HH:mm:ss')

        UserService.saveUser(updateUser)
            .then((response: any) => {
                setUser(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка оплаты тарифа.', error)
                openPopupAlert(document.body, {
                    text: 'Произошла ошибка оплаты тарифа. Попробуйте позже.'
                })
            })
            .finally(() => setFetching(false))
    }

    const getTariffsList = () => {
        const tariffsList: ISelector[] = tariffs.map((tariff: ITariff) => {
            return {
                key: tariff.key,
                text: tariff.name + ' (' + numberWithSpaces(tariff.cost) + ' руб.'
            }
        })

        return tariffsList
    }

    return (
        <Popup className={classes.PopupBuyTariff}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type={2}>Оплата тарифа</Title>

                    <div className={classes.field}>
                        <Label text='Тариф'/>

                        <ComboBox selected={currentTariff}
                                  items={Object.values(getTariffsList())}
                                  onSelect={(value: string) => setCurrentTariff(value)}
                                  placeHolder='Выберите тариф'
                                  styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Количество месяцев'/>

                        <NumberBox value={months || ''}
                                   min={1}
                                   step={1}
                                   max={99}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setMonths(value)}
                                   placeHolder='Укажите количество месяцев'
                                   styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Итого'/>

                        <NumberBox value={total || ''}
                                   min={0}
                                   step={1}
                                   max={99999999999}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setTotal(value)}
                                   placeHolder='Итоговая сумма к оплате'
                                   styleType='minimal'
                                   readOnly
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler()}
                        disabled={fetching || currentTariff.trim() === '' || months < 1 || months > 99}
                        title='Оплатить'
                >Оплатить</Button>

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

PopupBuyTariff.defaultProps = defaultProps
PopupBuyTariff.displayName = 'PopupBuyTariff'

export default function openPopupBuyTariff(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBuyTariff), popupProps, undefined, block, displayOptions)
}