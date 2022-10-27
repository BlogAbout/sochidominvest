import React, {useEffect, useState} from 'react'
// @ts-ignore
import is from 'is_js'
import withStore from '../../../hoc/withStore'
import {rolesList} from '../../../helpers/userHelper'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IUser} from '../../../@types/IUser'
import UserService from '../../../api/UserService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import ComboBox from '../../ComboBox/ComboBox'
import Label from '../../form/Label/Label'
import Title from '../../ui/Title/Title'
import AvatarBox from '../../form/AvatarBox/AvatarBox'
import PostBox from '../../form/PostBox/PostBox'
import {generatePassword} from '../../../helpers/generatePasswordHelper'
import classes from './PopupUserCreate.module.scss'

interface Props extends PopupProps {
    user?: IUser | null
    userId?: number
    role?: string

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
        settings: null
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

                if (props.userId && props.userId === response.data.id) {
                    localStorage.setItem('settings', response.data.settings ? JSON.stringify(response.data.settings) : '')
                }

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

    const renderInfoBlock = () => {
        return (
            <div key='info' className={classes.blockContent}>
                <Title type={2}>Информация о пользователе</Title>

                <div className={classes.field}>
                    <Label text='Имя'/>

                    <TextBox value={user.firstName}
                             onChange={(e: React.MouseEvent, value: string) => setUser({...user, firstName: value})}
                             placeHolder='Введите имя'
                             error={user.firstName.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Email'/>

                    <TextBox value={user.email}
                             onChange={(e: React.MouseEvent, value: string) => setUser({...user, email: value})}
                             placeHolder='Введите Email'
                             error={user.email.trim().length === 0 || !is.email(user.email)}
                             showRequired
                             errorText={user.email.trim().length === 0 ? 'Поле обязательно для заполнения' : !is.email(user.email) ? 'E-mail имеет неверный формат' : ''}
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Пароль'
                           onGeneratePassword={generatePasswordHandler.bind(this)}
                           showGeneratePassword
                    />

                    <TextBox
                        type='password'
                        password={true}
                        value={user.password}
                        placeHolder='Пароль'
                        error={(!user.id && user.password === '') || (user.password && user.password.length < 6)}
                        errorText={!user.id && user.password === '' ? 'Введите пароль' : user.password && user.password.length < 6 ? 'Минимальная длина пароля 6 символов' : ''}
                        styleType='minimal'
                        onChange={(e: React.MouseEvent, value: string) => setUser({...user, password: value})}
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Телефон'/>

                    <TextBox value={user.phone}
                             onChange={(e: React.MouseEvent, value: string) => setUser({...user, phone: value})}
                             placeHolder='Введите телефон'
                             error={user.phone.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                {props.role && ['director', 'administrator'].includes(props.role) ?
                    <div className={classes.field}>
                        <Label text='Должность'/>

                        <PostBox posts={user.post ? [user.post] : []}
                                 onSelect={(value: number[]) => setUser({...user, post: value[0]})}
                                 placeHolder='Выберите должность'
                                 styleType='minimal'
                        />
                    </div>
                    : null
                }

                {props.role && ['director', 'administrator', 'manager'].includes(props.role) ?
                    <div className={classes.field}>
                        <Label text='Аватар'/>

                        <AvatarBox avatarId={user.avatarId || null}
                                   fetching={fetching}
                                   onSelect={(attachmentId: number | null) => {
                                       setUser({
                                           ...user,
                                           avatarId: attachmentId
                                       })
                                   }}
                        />
                    </div>
                    : null
                }

                {user.role !== 'director' ?
                    <>
                        <div className={classes.field}>
                            <Label text='Роль'/>

                            <ComboBox selected={user.role}
                                      items={Object.values(rolesList)}
                                      onSelect={(value: string) => setUser({...user, role: value})}
                                      placeHolder='Выберите роль'
                                      styleType='minimal'
                            />
                        </div>

                        <div className={classes.field}>
                            <CheckBox label='Активен'
                                      type='modern'
                                      width={110}
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
        )
    }

    const renderSettingBlock = () => {
        return (
            <div key='setting' className={classes.blockContent}>
                <Title type={2}>Настройки пользователя</Title>

                <div className={classes.field}>
                    <CheckBox label='Уведомлять об изменениях в системе'
                              title='Уведомлять об изменениях в системе'
                              type='modern'
                              width={300}
                              checked={!!(user.settings && !!user.settings.notifyEdit)}
                              onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                  ...user,
                                  settings: {...user.settings, notifyEdit: value ? 1 : 0}
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Уведомлять о новых объектах недвижимости'
                              title='Уведомлять о новых объектах недвижимости'
                              type='modern'
                              width={300}
                              checked={!!(user.settings && !!user.settings.notifyNewItem)}
                              onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                  ...user,
                                  settings: {...user.settings, notifyNewItem: value ? 1 : 0}
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Уведомлять об акциях и событиях'
                              title='Уведомлять об акциях и событиях'
                              type='modern'
                              width={300}
                              checked={!!(user.settings && !!user.settings.notifyNewAction)}
                              onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                  ...user,
                                  settings: {...user.settings, notifyNewAction: value ? 1 : 0}
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Звуковой сигнал о новых уведомлениях'
                              title='Звуковой сигнал о новых уведомлениях'
                              type='modern'
                              width={300}
                              checked={!!(user.settings && !!user.settings.soundAlert)}
                              onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                  ...user,
                                  settings: {...user.settings, soundAlert: value ? 1 : 0}
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='PUSH-уведомления о новинках и событиях'
                              title='PUSH-уведомления о новинках и событиях'
                              type='modern'
                              width={300}
                              checked={!!(user.settings && !!user.settings.pushNotify)}
                              onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                  ...user,
                                  settings: {...user.settings, pushNotify: value ? 1 : 0}
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='PUSH-уведомления о новых личных сообщениях'
                              title='PUSH-уведомления о новых личных сообщениях'
                              type='modern'
                              width={300}
                              checked={!!(user.settings && !!user.settings.pushMessenger)}
                              onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                  ...user,
                                  settings: {...user.settings, pushMessenger: value ? 1 : 0}
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Отправлять уведомления на почту'
                              title='Отправлять уведомления на почту'
                              type='modern'
                              width={300}
                              checked={!!(user.settings && !!user.settings.sendEmail)}
                              onChange={(e: React.MouseEvent, value: boolean) => setUser({
                                  ...user,
                                  settings: {...user.settings, sendEmail: value ? 1 : 0}
                              })}
                    />
                </div>
            </div>
        )
    }

    return (
        <Popup className={classes.PopupUserCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                {renderInfoBlock()}

                {user && user.id ? renderSettingBlock() : null}
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || checkFormValidation()}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || checkFormValidation()}
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

PopupUserCreate.defaultProps = defaultProps
PopupUserCreate.displayName = 'PopupUserCreate'

export default function openPopupUserCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupUserCreate), popupProps, undefined, block, displayOptions)
}