import React, {useEffect, useState} from 'react'
import AgentService from '../../../api/AgentService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IContact} from '../../../@types/IAgent'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupContactCreate.module.scss'

interface Props extends PopupProps {
    contact?: IContact | null
    agentId?: number

    onSave(): void
}

const defaultProps: Props = {
    contact: null,
    onSave: () => {
        console.info('PopupContactCreate onSave')
    }
}

const PopupContactCreate: React.FC<Props> = (props) => {
    const [contact, setContact] = useState<IContact>(props.contact || {
        id: null,
        agentId: props.agentId || 0,
        name: '',
        post: '',
        phone: '',
        author: null,
        active: 1
    })

    const [fetching, setFetching] = useState(false)

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

        AgentService.saveContact(contact)
            .then((response: any) => {
                setFetching(false)
                setContact(response.data)

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
        <Popup className={classes.PopupContactCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о контакте</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={contact.name}
                                 onChange={(e: React.MouseEvent, value: string) => setContact({
                                     ...contact,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={contact.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Должность/Отдел'/>

                        <TextBox value={contact.post}
                                 onChange={(e: React.MouseEvent, value: string) => setContact({
                                     ...contact,
                                     post: value
                                 })}
                                 placeHolder='Укажите должность/отдел'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Телефон'/>

                        <TextBox value={contact.phone}
                                 onChange={(e: React.MouseEvent, value: string) => setContact({
                                     ...contact,
                                     phone: value
                                 })}
                                 placeHolder='Введите номер телефона'
                                 error={!contact.phone || contact.phone.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!contact.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setContact({
                                      ...contact,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || contact.name.trim() === '' || contact.phone.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || contact.name.trim() === '' || contact.phone.trim() === ''}
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

PopupContactCreate.defaultProps = defaultProps
PopupContactCreate.displayName = 'PopupContactCreate'

export default function openPopupContactCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupContactCreate, popupProps, undefined, block, displayOptions)
}