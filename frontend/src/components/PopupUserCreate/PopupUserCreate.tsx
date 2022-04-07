import React, {useEffect, useState} from 'react'
// @ts-ignore
import is from 'is_js'
import withStore from '../../hoc/withStore'
import {rolesList} from '../../helpers/userHelper'
import {PopupProps} from '../../@types/IPopup'
import {IUser} from '../../@types/IUser'
import {ITab} from '../../@types/ITab'
import UserService from '../../api/UserService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import ComboBox from '../ComboBox/ComboBox'
import Tabs from '../Tabs/Tabs'
import {generatePassword} from '../../helpers/generatePasswordHelper'
import classes from './PopupUserCreate.module.scss'

interface Props extends PopupProps {
    user?: IUser | null
    userId?: number

    onSave(): void
}

const defaultProps: Props = {
    user: null,
    userId: 0,
    onSave: () => {
        console.info('PopupUserCreate onSave')
    }
}

const PopupUserCreate: React.FC<Props> = (props) => {
    const [user, setUser] = useState<IUser>(props.user || {
        id: null,
        email: '',
        phone: '',
        password: '',
        firstName: '',
        role: 'subscriber',
        active: 1,
        lastActive: null,
        settings: null,
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.userId) {
            UserService.fetchUserById(props.userId)
                .then((response: any) => {
                    setUser(response.data)
                })
                .catch((error: any) => {
                    console.error('error', error)
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }, [props.userId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const checkFormValidation = () => {
        return user.firstName.trim() === '' || user.email.trim() === '' || !is.email(user.email) || user.phone.trim() === '' || (user.password && user.password.length < 6) || (!user.id && user.password === '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        if (checkFormValidation()) {
            return
        }

        setFetching(true)

        UserService.saveUser(user)
            .then((response: any) => {
                setFetching(false)
                setUser(response.data)

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

    // Автогенерация пароля
    const generatePasswordHandler = () => {
        setUser({...user, password: generatePassword(8, true, true, true, true)})
    }

    const renderInfoTab = () => {
        return (
            <div key='info' className={classes.tabContent}>
                <div className={classes.cols}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Имя</div>

                        <TextBox value={user.firstName}
                                 onChange={(e: React.MouseEvent, value: string) => setUser({...user, firstName: value})}
                                 placeHolder='Введите имя'
                                 error={user.firstName.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 icon='user'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Email</div>

                        <TextBox value={user.email}
                                 onChange={(e: React.MouseEvent, value: string) => setUser({...user, email: value})}
                                 placeHolder='Введите Email'
                                 error={user.email.trim().length === 0 || !is.email(user.email)}
                                 showRequired
                                 errorText={user.email.trim().length === 0 ? 'Поле обязательно для заполнения' : !is.email(user.email) ? 'E-mail имеет неверный формат' : ''}
                                 icon='at'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>
                            Пароль
                            <span onClick={generatePasswordHandler.bind(this)}>Сгенерировать</span>
                        </div>

                        <TextBox
                            type='password'
                            password={true}
                            value={user.password}
                            placeHolder='Пароль'
                            error={(!user.id && user.password === '') || (user.password && user.password.length < 6)}
                            errorText={!user.id && user.password === '' ? 'Введите пароль' : user.password && user.password.length < 6 ? 'Минимальная длина пароля 6 символов' : ''}
                            icon='lock'
                            onChange={(e: React.MouseEvent, value: string) => setUser({...user, password: value})}
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Телефон</div>

                        <TextBox value={user.phone}
                                 onChange={(e: React.MouseEvent, value: string) => setUser({...user, phone: value})}
                                 placeHolder='Введите телефон'
                                 error={user.phone.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 icon='phone'
                        />
                    </div>

                    {user.role !== 'director' ?
                        <>
                            <div className={classes.field}>
                                <div className={classes.field_label}>Роль</div>

                                <ComboBox selected={user.role}
                                          items={Object.values(rolesList)}
                                          onSelect={(value: string) => setUser({...user, role: value})}
                                          placeHolder='Выберите роль'
                                          styleType='standard'
                                          icon='user-check'
                                />
                            </div>

                            <div className={classes.field}>
                                <CheckBox label='Активен'
                                          type='modern'
                                          checked={!!user.active}
                                          onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                              ...user,
                                              active: value ? 1 : 0
                                          })}
                                />
                            </div>
                        </>
                        : null
                    }
                </div>
            </div>
        )
    }

    const renderSettingTab = () => {
        return (
            <div key='setting' className={classes.tabContent}>
                В разработке
            </div>
        )
    }

    const tabs: ITab = {
        state: {title: 'Информация', render: renderInfoTab()},
        info: {title: 'Настройки', render: renderSettingTab()}
    }

    return (
        <Popup className={classes.PopupUserCreate}>
            <Header title={user.id ? 'Редактировать пользователя' : 'Добавить пользователя'}
                    popupId={props.id ? props.id : ''}
            />

            <BlockingElement fetching={fetching} className={classes.content}>
                {props.userId && user ?
                    <div className={classes['tabs']}>
                        <Tabs tabs={tabs} paddingFirstTab='popup'/>
                    </div>
                    : renderInfoTab()
                }
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || checkFormValidation()}
                >Сохранить и закрыть</Button>

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || checkFormValidation()}
                        className='marginLeft'
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupUserCreate.defaultProps = defaultProps
PopupUserCreate.displayName = 'PopupUserCreate'

export default function openPopupUserCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupUserCreate), popupProps, undefined, block, displayOptions)
}