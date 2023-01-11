import React from 'react'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {compareTariffLevels, tariffs} from '../../../helpers/tariffHelper'
import {numberWithSpaces} from '../../../helpers/numberHelper'
import {IUser} from '../../../@types/IUser'
import {ITariff} from '../../../@types/ITariff'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openPopupBuyTariff from '../../../components/popup/PopupBuyTariff/PopupBuyTariff'
import Button from '../../components/form/Button/Button'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import classes from './TariffPage.module.scss'

const TariffPage: React.FC = (): React.ReactElement => {
    const {user, fetching} = useTypedSelector(state => state.userReducer)
    const {setUser} = useActions()

    const onBuyTariffHandler = (tariff: ITariff) => {
        if (user.tariff === tariff.key) {
            return
        }

        if (compareTariffLevels(user.tariff || 'free', tariff.key) === -1) {
            openPopupAlert(document.body, {
                text: `
                    Вы собираетесь понизить тариф. Все данные, не соответствующие тарифу будут отключены.
                    Вы можете самостоятельно, отключить ненужные, оставив только те, которые будут соответствовать новому тарифу.
                    Либо это произойдет автоматически, оставив только последние.
                `,
                buttons: [
                    {
                        text: 'Продолжить',
                        onClick: () => {
                            openPopupBuyTariff(document.body, {
                                user: user,
                                tariff: tariff,
                                onSave: (user: IUser) => {
                                    setUser(user)
                                }
                            })
                        }
                    },
                    {text: 'Отмена'}
                ]
            })
        }

        openPopupBuyTariff(document.body, {
            user: user,
            tariff: tariff,
            onSave: (user: IUser) => {
                setUser(user)
            }
        })
    }

    return (
        <PanelView pageTitle='Тарифы'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Тарифы</Title>

                <BlockingElement fetching={fetching} className={classes.list}>
                    {tariffs.map((tariff: ITariff) => {
                        return (
                            <div key={tariff.key} className={classes.item}>
                                <div className={classes.head}>
                                    <h3>{tariff.name}</h3>
                                    <div className={classes.cost}>{numberWithSpaces(tariff.cost)} руб.</div>
                                </div>

                                <div className={classes.advanced}>
                                    <ul>{tariff.advantages.map((advantage: string, index: number) => {
                                        return <li key={index}>{advantage}</li>
                                    })}</ul>
                                </div>

                                <div className={classes.buttons}>
                                    <Button type='save'
                                            onClick={() => onBuyTariffHandler(tariff)}
                                            title={user.tariff === tariff.key ? 'Продлить' : 'Выбрать'}
                                    >{user.tariff === tariff.key ? 'Продлить' : 'Выбрать'}</Button>
                                </div>
                            </div>
                        )
                    })}
                </BlockingElement>
            </Wrapper>
        </PanelView>
    )
}

TariffPage.displayName = 'TariffPage'

export default React.memo(TariffPage)