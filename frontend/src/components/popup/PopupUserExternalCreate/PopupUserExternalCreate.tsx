import React, {useEffect, useState} from 'react'
// @ts-ignore
import is from 'is_js'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IUserExternal} from '../../../@types/IUser'
import UserService from '../../../api/UserService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Label from '../../form/Label/Label'
import Title from '../../ui/Title/Title'
import classes from './PopupUserExternalCreate.module.scss'

interface Props extends PopupProps {
    user?: IUserExternal | null
    userId?: number
    role?: string

    onSave(): void
}

const defaultProps: Props = {
    user: null,
    userId: 0,
    onSave: () => {
        console.info('PopupUserExternalCreate onSave')
    }
}

const PopupUserExternalCreate: React.FC<Props> = (props) => {
    const [user, setUser] = useState<IUserExternal>(props.user || {
        id: null,
        name: '',
        email: '',
        phone: '',
        active: 1
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.userId) {
            UserService.fetchUserExternalById(props.userId)
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
        return user.name.trim() === '' || user.email.trim() === '' || !is.email(user.email) || user.phone.trim() === ''
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        if (checkFormValidation()) {
            return
        }

        setFetching(true)

        UserService.saveUserExternal(user)
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

    const renderInfoBlock = () => {
        return (
            <div key='info' className={classes.blockContent}>
                <Title type={2}>Информация о пользователе</Title>

                <div className={classes.field}>
                    <Label text='Имя'/>

                    <TextBox value={user.name}
                             onChange={(e: React.MouseEvent, value: string) => setUser({...user, name: value})}
                             placeHolder='Введите имя'
                             error={user.name.trim() === ''}
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
            </div>
        )
    }

    return (
        <Popup className={classes.PopupUserExternalCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                {renderInfoBlock()}
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

PopupUserExternalCreate.defaultProps = defaultProps
PopupUserExternalCreate.displayName = 'PopupUserExternalCreate'

export default function openPopupUserExternalCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupUserExternalCreate), popupProps, undefined, block, displayOptions)
}