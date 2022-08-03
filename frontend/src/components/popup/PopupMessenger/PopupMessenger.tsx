import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../../hoc/withStore'
import MessengerService from '../../../api/MessengerService'
import UserService from '../../../api/UserService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IFilter} from '../../../@types/IFilter'
import {IUser} from '../../../@types/IUser'
import {IMessage, IMessenger, IMessengerMember} from '../../../@types/IMessenger'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {getUserAvatar, getUserName} from '../../../helpers/userHelper'
import {findMembersIds} from '../../../helpers/messengerHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import Button from '../../form/Button/Button'
import Empty from '../../Empty/Empty'
import UserItem from './components/UserItem/UserItem'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import MessengerItem from './components/MessengerItem/MessengerItem'
import MessageItem from './components/MessageItem/MessageItem'
import MessengerInfo from './components/MessengerInfo/MessengerInfo'
import classes from './PopupMessenger.module.scss'

interface Props extends PopupProps {
    currentMessengerId?: number
}

interface State {
    currentMessengerId: number
    currentMessengerInfo: IMessenger | null
    textMessage: string
    messengers: IMessenger[]
    fetchingMessengers: boolean
    fetchingMessages: boolean
    fetchingUsers: boolean
    userId: number
    users: IUser[]
}

const cx = classNames.bind(classes)

class PopupMessenger extends React.Component<Props, State> {
    refMessenger: React.MutableRefObject<any> | null = null

    state: State = {
        currentMessengerId: this.props.currentMessengerId || 0,
        currentMessengerInfo: null,
        textMessage: '',
        messengers: [],
        fetchingMessengers: false,
        fetchingMessages: false,
        fetchingUsers: false,
        userId: parseInt(localStorage.getItem('id') || '0'),
        users: []
    }

    componentDidMount() {
        window.events.addListener('messengerNewMessage', this.updateMessagesHandler)
        window.events.addListener('messengerCreateMessenger', this.updateMessengerHandler)
        window.events.addListener('messengerReadMessage', this.readMessageHandler)

        this.refMessenger = React.createRef()

        this.fetchUserList()
        this.fetchMessengerList()

        if (this.state.currentMessengerId > 0) {
            this.fetchMessagesList(this.state.currentMessengerId)
        }
    }

    componentWillUnmount() {
        window.events.removeListener('messengerNewMessage', this.updateMessagesHandler)
        window.events.removeListener('messengerCreateMessenger', this.updateMessengerHandler)
        window.events.removeListener('messengerReadMessage', this.readMessageHandler)

        removePopup(this.props.blockId ? this.props.blockId : '')
    }

    // Закрытие popup
    close = () => {
        removePopup(this.props.id || '')
    }

    fetchUserList = () => {
        this.setState({fetchingUsers: true})

        UserService.fetchUsers({} as IFilter)
            .then((response: any) => {
                this.setState({users: response.data})
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                this.setState({fetchingUsers: false})
            })
    }

    fetchMessengerList = () => {
        this.setState({fetchingMessengers: true})

        MessengerService.fetchMessengers({} as IFilter)
            .then((response: any) => {
                this.setState({messengers: response.data})
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                this.setState({fetchingMessengers: false})
            })
    }

    fetchMessagesList = (currentMessengerId: number) => {
        this.setState({fetchingMessages: true})

        MessengerService.fetchMessages(currentMessengerId)
            .then((response: any) => {
                this.setState({currentMessengerInfo: response.data}, this.submitReadHandler)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                this.setState({fetchingMessages: false})
            })
    }

    // Поиск существующего чата с выбранным пользователем
    findMessengerByUser = (user: IUser) => {
        if (!user || !user.id) {
            return
        }

        if (this.state.messengers && this.state.messengers.length) {
            const findMessenger = this.state.messengers.find((messenger: IMessenger) => user.id && findMembersIds(messenger.members).includes(user.id))

            if (findMessenger && findMessenger.id) {
                this.setState({currentMessengerInfo: findMessenger, currentMessengerId: findMessenger.id})
                this.fetchMessagesList(findMessenger.id)
                return
            }
        }

        const members: IMessengerMember[] = []
        members[this.state.userId] = {
            'userId': this.state.userId,
            'readed': null,
            'deleted': null,
            'active': 1
        }
        members[user.id] = {
            'userId': user.id,
            'readed': null,
            'deleted': null,
            'active': 1
        }

        this.setState({
            currentMessengerInfo: {
                id: null,
                author: this.state.userId,
                name: '',
                type: 'message',
                members: members,
                messages: []
            },
            currentMessengerId: -2
        })
    }

    // Отправка сообщения в сокет
    submitMessageHandler = () => {
        if (this.state.textMessage.trim() === '' || !this.state.currentMessengerInfo) {
            return
        }

        const attendees: number[] = findMembersIds(this.state.currentMessengerInfo.members)
        const message: IMessage = {
            id: null,
            messengerId: this.state.currentMessengerInfo.id,
            active: 1,
            type: 'message',
            text: this.state.textMessage,
            author: this.state.userId,
            parentMessageId: null,
            attendees: attendees
        }

        this.setState({textMessage: ''})

        window.events.emit('messengerSendMessage', message)
    }

    submitReadHandler = () => {
        if (!this.state.currentMessengerInfo) {
            return
        }

        const attendees: number[] = findMembersIds(this.state.currentMessengerInfo.members)
        const message: IMessage = {
            id: null,
            messengerId: this.state.currentMessengerInfo.id,
            active: 1,
            type: 'read',
            text: String(this.state.currentMessengerInfo.messages[this.state.currentMessengerInfo.messages.length - 1].id),
            author: this.state.userId,
            parentMessageId: null,
            attendees: attendees
        }

        this.setState({textMessage: ''})

        window.events.emit('messengerSendMessage', message)
    }

    // Обновление активного чата сообщений при отправке
    updateMessagesHandler = (message: IMessage) => {
        if (this.state.currentMessengerId <= 0 && this.state.messengers && this.state.messengers.length) {
            const findIndex = this.state.messengers.findIndex((messenger: IMessenger) => messenger.id === message.messengerId)

            if (findIndex !== -1) {
                const updateMessenger: IMessenger = JSON.parse(JSON.stringify(this.state.messengers[findIndex]))
                updateMessenger.messages = [message]

                this.setState({
                    messengers: [
                        ...this.state.messengers.slice(0, findIndex),
                        updateMessenger,
                        ...this.state.messengers.slice(findIndex + 1)
                    ]
                })
            }
        }

        if (this.state.currentMessengerId === message.messengerId) {
            const updateMessengerInfo: IMessenger = JSON.parse(JSON.stringify(this.state.currentMessengerInfo))

            if (updateMessengerInfo.messages) {
                updateMessengerInfo.messages.push(message)
            } else {
                updateMessengerInfo.messages = [message]
            }

            this.setState({currentMessengerInfo: updateMessengerInfo}, this.onScrollContainerTopHandler)

            this.submitReadHandler()
        }
    }

    // Обновление данных чатов
    updateMessengerHandler = (message: IMessage) => {
        if (message.author === this.state.userId && this.state.currentMessengerId === -2) {
            this.setState({currentMessengerId: message.messengerId || 0})
            this.fetchMessagesList(message.messengerId || 0)
        } else if (this.state.currentMessengerId <= 0) {
            this.fetchMessengerList()
        }
    }

    // Пометка сообщений прочитанными
    readMessageHandler = (message: IMessage) => {
        if (message.author === this.state.userId && this.state.currentMessengerId === message.messengerId) {
            const updateMessengerInfo: IMessenger = JSON.parse(JSON.stringify(this.state.currentMessengerInfo))

            if (updateMessengerInfo.members) {
                updateMessengerInfo.members[message.author].readed = parseInt(message.text)
            }

            this.setState({currentMessengerInfo: updateMessengerInfo})
        } else if (this.state.currentMessengerId <= 0 && this.state.messengers && this.state.messengers.length) {
            const findIndex = this.state.messengers.findIndex((messenger: IMessenger) => messenger.id === message.id)

            if (findIndex !== -1) {
                const updateMessenger: IMessenger = JSON.parse(JSON.stringify(this.state.messengers[findIndex]))

                if (message.author && updateMessenger.members) {
                    updateMessenger.members[message.author].readed = parseInt(message.text)
                }

                this.setState({
                    messengers: [
                        ...this.state.messengers.slice(0, findIndex),
                        updateMessenger,
                        ...this.state.messengers.slice(findIndex + 1)
                    ]
                })
            }
        }
    }

    // Прокрутка чата к последнему сообщению
    onScrollContainerTopHandler = () => {
        if (this.refMessenger) {
            this.refMessenger.current.scrollTop = this.refMessenger.current.scrollHeight
        }
    }

    renderMessengerList = () => {
        return (
            <>
                <div className={classes.messenger}>
                    <BlockingElement fetching={this.state.fetchingMessengers || this.state.fetchingUsers}
                                     className={classes.list}
                    >
                        {this.state.messengers && this.state.messengers.length ?
                            this.state.messengers.map((messenger: IMessenger) => {
                                return (
                                    <MessengerItem key={messenger.id}
                                                   messenger={messenger}
                                                   onClick={() => {
                                                       this.setState({currentMessengerId: messenger.id || 0})
                                                       this.fetchMessagesList(messenger.id || 0)
                                                   }}
                                                   users={this.state.users}
                                                   userId={this.state.userId}
                                    />
                                )
                            })
                            : <Empty message='Нет активных чатов'/>
                        }
                    </BlockingElement>
                </div>

                <div className={classes.link}>
                    <span onClick={() => this.setState({currentMessengerId: -1})}>
                        <FontAwesomeIcon icon='plus'/>
                        <span>Начать чат</span>
                    </span>
                </div>
            </>
        )
    }

    renderUsers = () => {
        return (
            <>
                <div className={classes.users}>
                    <BlockingElement fetching={this.state.fetchingUsers} className={classes.list}>
                        {this.state.users && this.state.users.length ?
                            this.state.users.map((user: IUser) => {
                                if (user.block || user.active !== 1 || user.id === this.state.userId) {
                                    return null
                                }

                                return (
                                    <UserItem key={user.id}
                                              user={user}
                                              onClick={() => this.findMessengerByUser(user)}
                                    />
                                )
                            })
                            : <Empty message='Нет пользователей'/>
                        }
                    </BlockingElement>
                </div>

                <div className={cx({'link': true, 'back': true})}>
                    <span onClick={() => this.setState({currentMessengerId: 0})}>
                        <FontAwesomeIcon icon='arrow-left-long'/>
                        <span>Назад</span>
                    </span>
                </div>
            </>
        )
    }

    renderMessenger = () => {
        if (!this.state.currentMessengerInfo) {
            return null
        }

        if (this.refMessenger && this.refMessenger.current) {
            this.refMessenger.current.scrollTop = this.refMessenger.current.scrollHeight
        }

        const memberId: number = findMembersIds(this.state.currentMessengerInfo.members).find((id: number) => id !== this.state.userId) || 0
        const avatarUrl = getUserAvatar(this.state.users, memberId)
        const memberName = getUserName(this.state.users, this.state.userId === this.state.currentMessengerInfo.author ? memberId : this.state.currentMessengerInfo.author)

        return (
            <>
                <MessengerInfo memberId={memberId}
                               avatarUrl={avatarUrl}
                               memberName={memberName}
                               onClickBack={() => this.setState({currentMessengerId: 0})}
                />

                <div className={classes.messages}>
                    <BlockingElement fetching={this.state.fetchingMessages || this.state.fetchingUsers}
                                     className={classes.list}
                                     innerRef={this.refMessenger}
                    >
                        {this.state.currentMessengerInfo.messages && this.state.currentMessengerInfo.messages.length ?
                            this.state.currentMessengerInfo.messages.map((message: IMessage) => {
                                return (
                                    <MessageItem key={message.id}
                                                 message={message}
                                                 userId={this.state.userId}
                                                 memberId={memberId}
                                                 messenger={this.state.currentMessengerInfo}
                                                 users={this.state.users}
                                    />
                                )
                            })
                            : <Empty message='Нет сообщений'/>
                        }
                    </BlockingElement>
                </div>

                <div className={classes.field}>
                    <TextBox value={this.state.textMessage}
                             onChange={(e: React.MouseEvent, value: string) => this.setState({textMessage: value})}
                             placeHolder='Введите текст сообщения'
                    />

                    <Button type='save'
                            icon='check'
                            onClick={() => this.submitMessageHandler()}
                            disabled={this.state.fetchingUsers}
                            title='Отправить'
                    />
                </div>
            </>
        )
    }

    renderPanelByType = () => {
        if (this.state.currentMessengerId === 0) {
            return this.renderMessengerList()
        } else if (this.state.currentMessengerId === -1) {
            return this.renderUsers()
        } else {
            return this.renderMessenger()
        }
    }

    render = () => {
        return (
            <Popup className={classes.PopupMessenger}>
                <div className={classes.content}>
                    <div className={classes.blockContent}>
                        {this.renderPanelByType()}
                    </div>
                </div>

                <Footer>
                    <Button type='regular'
                            icon='arrow-rotate-left'
                            onClick={this.close.bind(this)}
                            className='marginLeft'
                            title='Закрыть'
                    >Закрыть</Button>
                </Footer>
            </Popup>
        )
    }
}

export default function openPopupMessenger(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupMessenger), popupProps, undefined, block, displayOptions)
}