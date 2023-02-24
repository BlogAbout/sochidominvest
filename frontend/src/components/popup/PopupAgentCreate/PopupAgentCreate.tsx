import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import AgentService from '../../../api/AgentService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IAgent, IContact} from '../../../@types/IAgent'
import {ITab} from '../../../@types/ITab'
import {agentTypes} from '../../../helpers/agentHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import AvatarBox from '../../form/AvatarBox/AvatarBox'
import Tabs from '../../ui/Tabs/Tabs'
import ContactList from './components/ContactList/ContactList'
import classes from './PopupAgentCreate.module.scss'
import Empty from "../../ui/Empty/Empty";

interface Props extends PopupProps {
    agent?: IAgent | null
    isDisable?: boolean

    onSave(): void
}

const defaultProps: Props = {
    agent: null,
    isDisable: false,
    onSave: () => {
        console.info('PopupAgentCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupAgentCreate: React.FC<Props> = (props) => {
    const [agent, setAgent] = useState<IAgent>(props.agent || {
        id: null,
        name: '',
        description: '',
        address: '',
        phone: '',
        author: null,
        type: 'agent',
        active: !props.isDisable ? 1 : 0
    })

    const [contacts, setContacts] = useState<IContact[]>([])
    const [fetchingAgent, setFetchingAgent] = useState(false)
    const [fetchingContacts, setFetchingContacts] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (agent.id) {
            fetchContactsForAgentHandler()
        }
    }, [agent.id])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Загрузка контактов для агентства
    const fetchContactsForAgentHandler = () => {
        if (!agent.id) {
            return
        }

        setFetchingContacts(true)

        AgentService.fetchContacts({agentId: [agent.id], active: [0, 1]})
            .then((response: any) => {
                setContacts(response.data)
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetchingContacts(false))
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        setFetchingAgent(true)

        AgentService.saveAgent(agent)
            .then((response: any) => {
                setAgent(response.data)

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
            })
            .finally(() => setFetchingAgent(false))
    }

    const renderInfoTab = () => {
        return (
            <div key='info' className={classes.tabContent}>
                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={agent.name}
                             onChange={(e: React.MouseEvent, value: string) => setAgent({
                                 ...agent,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={agent.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Адрес'/>

                    <TextBox value={agent.address}
                             onChange={(e: React.MouseEvent, value: string) => setAgent({
                                 ...agent,
                                 address: value
                             })}
                             placeHolder='Введите адрес'
                             error={!agent.address || agent.address.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Телефон'/>

                    <TextBox value={agent.phone}
                             onChange={(e: React.MouseEvent, value: string) => setAgent({
                                 ...agent,
                                 phone: value
                             })}
                             placeHolder='Введите номер телефона'
                             error={!agent.phone || agent.phone.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Тип'/>

                    <ComboBox selected={agent.type}
                              items={Object.values(agentTypes)}
                              onSelect={(value: string) => setAgent({...agent, type: value})}
                              placeHolder='Выберите тип'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Аватар'/>

                    <AvatarBox avatarId={agent.avatarId || null}
                               fetching={fetchingAgent}
                               onSelect={(attachmentId: number | null) => {
                                   setAgent({
                                       ...agent,
                                       avatarId: attachmentId
                                   })
                               }}
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={agent.description}
                                 onChange={(value: string) => setAgent({
                                     ...agent,
                                     description: value
                                 })}
                                 placeHolder='Введите описание об агентстве'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!agent.active}
                              onChange={(e: React.MouseEvent, value: boolean) => setAgent({
                                  ...agent,
                                  active: value ? 1 : 0
                              })}
                              readOnly={props.isDisable}
                    />
                </div>
            </div>
        )
    }

    const renderContactsTab = () => {
        return (
            <div key='contacts' className={classes.tabContent}>
                {agent.id ?
                    <ContactList agentId={agent.id} contacts={contacts} onSave={() => fetchContactsForAgentHandler()}/>
                    : <Empty message='Для получения доступа к контактам сохраните изменения'/>
                }
            </div>
        )
    }

    const tabs: ITab = {
        info: {title: 'Информация', render: renderInfoTab()},
        contacts: {title: 'Контакты', render: renderContactsTab()}
    }

    return (
        <Popup className={classes.PopupAgentCreate}>
            <BlockingElement fetching={fetchingAgent || fetchingContacts} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>{agent.id ? 'Редактировать агентство' : 'Добавить агентство'}</Title>

                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetchingAgent || fetchingContacts || agent.name.trim() === '' || agent.address.trim() === '' || agent.phone.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetchingAgent || fetchingContacts || agent.name.trim() === '' || agent.address.trim() === '' || agent.phone.trim() === ''}
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

PopupAgentCreate.defaultProps = defaultProps
PopupAgentCreate.displayName = 'PopupAgentCreate'

export default function openPopupAgentCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupAgentCreate, popupProps, undefined, block, displayOptions)
}