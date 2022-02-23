import React, {useEffect, useState} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {IUser} from '../../@types/IUser'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import ComboBox from '../ComboBox/ComboBox'
import {generatePassword} from '../../helpers/generatePasswordHelper'
import classes from './PopupUserCreate.module.scss'

interface Props extends PopupProps {
    user?: IUser | null

    onSave(): void
}

const defaultProps: Props = {
    user: null,
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
        name: '',
        role: 'subscriber',
        active: 1,
        lastActive: null,
        settings: null,
    })

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
        // Todo
    }

    // Автогенерация пароля
    const generatePasswordHandler = () => {
        setUser({...user, password: generatePassword(8, true, true, true, true)})
    }

    const rolesList = [
        {key: 'subscriber', text: 'Подписчик'},
        {key: 'administrator', text: 'Администратор'},
        {key: 'manager', text: 'Менеджер'},
        {key: 'developer', text: 'Застройщик'},
        {key: 'agent', text: 'Агент'},
        {key: 'buyer', text: 'Покупатель'},
        {key: 'owner', text: 'Собственник'},
        {key: 'investor', text: 'Инвестор'}
    ]

    return (
        <Popup className={classes.PopupUserCreate}>
            <Header title={props.user ? 'Редактировать пользователя' : 'Добавить пользователя'}
                    popupId={props.id ? props.id : ''}
            />

            <BlockingElement fetching={false} className={classes.content}>
                <div className={classes.field}>
                    <div className={classes.field_label}>Имя</div>

                    <TextBox value={user.name}
                             onChange={(e: React.MouseEvent, value: string) => setUser({...user, name: value})}
                             placeHolder={'Введите имя'}
                             error={user.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             icon='user'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Email</div>

                    <TextBox value={user.email}
                             onChange={(e: React.MouseEvent, value: string) => setUser({...user, email: value})}
                             placeHolder={'Введите Email'}
                             error={user.email.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             icon='at'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>
                        Пароль
                        <span onClick={generatePasswordHandler.bind(this)}>Сгенерировать</span>
                    </div>

                    <TextBox
                        type="password"
                        password={true}
                        value={user.password}
                        placeholder='Пароль'
                        error={!user.id && user.password === ''}
                        errorText='Введите пароль'
                        icon='lock'
                        onChange={(e: React.MouseEvent, value: string) => setUser({...user, password: value})}
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Телефон</div>

                    <TextBox value={user.phone}
                             onChange={(e: React.MouseEvent, value: string) => setUser({...user, phone: value})}
                             placeHolder={'Введите телефон'}
                             error={user.phone.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             icon='phone'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Роль</div>

                    <ComboBox selected={user.role}
                              items={Object.values(rolesList)}
                              onSelect={(value: string) => setUser({...user, role: value})}
                              placeHolder={'Выберите роль'}
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
            </BlockingElement>

            <Footer>
                <Button type="apply"
                        icon='check'
                        onClick={saveHandler.bind(this)}
                        disabled={false}
                >Сохранить</Button>

                <Button type="save"
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
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

    return openPopup(PopupUserCreate, popupProps, undefined, block, displayOptions)
}