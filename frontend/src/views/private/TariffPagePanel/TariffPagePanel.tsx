import React, {useEffect, useState} from 'react'
import {compareTariffLevels, tariffs} from '../../../helpers/tariffHelper'
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
import openPopupAlert from "../../../components/PopupAlert/PopupAlert";
import ArticleService from "../../../api/ArticleService";

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
    }, [userId])

    const onBuyTariffHandler = (tariff: ITariff) => {
        if (userInfo.tariff === tariff.key) {
            return
        }

        if (compareTariffLevels(userInfo.tariff || 'free', tariff.key) === -1) {
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
                                user: userInfo,
                                tariff: tariff,
                                onSave: (user: IUser) => {
                                    setUserInfo(user)
                                }
                            })
                        }
                    },
                    {text: 'Отмена'}
                ]
            })
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