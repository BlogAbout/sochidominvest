import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IUser} from '../../../@types/IUser'
import {ISelector} from '../../../@types/ISelector'
import {tariffs} from '../../../helpers/tariffHelper'
import {ITariff} from '../../../@types/ITariff'
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
import classes from './PopupBuyTariff.module.scss'

interface Props extends PopupProps {
    user: IUser
    tariff: ITariff
}

const defaultProps: Props = {
    user: {} as IUser,
    tariff: {} as ITariff
}

const PopupBuyTariff: React.FC<Props> = (props) => {
    const [user, setMailing] = useState<IUser>(props.user || {
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

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        // Todo: Реализовать псевдооплату
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