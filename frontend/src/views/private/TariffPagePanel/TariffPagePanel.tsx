import React, {useEffect, useState} from 'react'
import {tariffs} from '../../../helpers/tariffHelper'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {numberWithSpaces} from '../../../helpers/numberHelper'
import UserService from '../../../api/UserService'
import {ITariff} from '../../../@types/ITariff'
import {IUser} from '../../../@types/IUser'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Button from '../../../components/form/Button/Button'
import openPopupBuyTariff from '../../../components/popup/PopupBuyTariff/PopupBuyTariff'
import classes from './TariffPagePanel.module.scss'

const TariffPagePanel: React.FC = () => {
    const [userInfo, setUserInfo] = useState<IUser>({} as IUser)
    const [fetchingUser, setFetchingUser] = useState(false)

    const {userId} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (userId) {
            setFetchingUser(true)

            UserService.fetchUserById(userId)
                .then((response: any) => {
                    setUserInfo(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки данных пользователя', error)
                })
                .finally(() => {
                    setFetchingUser(false)
                })
        }
    })

    const onBuyTariffHandler = (tariff: ITariff) => {
        if (userInfo.tariff === tariff.key) {
            return
        }

        openPopupBuyTariff(document.body, {
            user: userInfo,
            tariff: tariff,
            onSave: (user: IUser) => {
                setUserInfo(user)
            }
        })
    }

    return (
        <div className={classes.TariffPagePanel}>
            <PageInfo title='Тарифы'/>

            <div className={classes.Content}>
                <Title type={1}>Тарифы</Title>

                <BlockingElement fetching={fetchingUser} className={classes.list}>
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
                                            title={userInfo.tariff === tariff.key ? 'Продлить' : 'Выбрать'}
                                    >{userInfo.tariff === tariff.key ? 'Продлить' : 'Выбрать'}</Button>
                                </div>
                            </div>
                        )
                    })}
                </BlockingElement>
            </div>
        </div>
    )
}

TariffPagePanel.displayName = 'TariffPagePanel'

export default TariffPagePanel