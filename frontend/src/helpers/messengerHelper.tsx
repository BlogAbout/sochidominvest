import React from 'react'
import {toast} from 'react-toastify'
import {configuration} from './utilHelper'
import {IMessage, IMessengerMember} from '../@types/IMessenger'
import openPopupMessenger from '../components/popup/PopupMessenger/PopupMessenger'
import ToastMessage from '../components/popup/PopupMessenger/components/ToastMessage/ToastMessage'
import {getUserSetting} from './userHelper'
import {newNotification} from './notificationHelper'

export class WS {
    private webSocket
    private readonly userId
    private readonly timeout
    private restartTimer: any = null

    constructor(userId: number, timeout: number = 10000) {
        this.userId = userId
        this.timeout = timeout
        this.webSocket = new WebSocket(configuration.webSocketPath)

        this.webSocket.onopen = (event: Event) => {
            console.info('Успешное подключение к WebSocket')

            const message: IMessage = {
                id: null,
                messengerId: null,
                active: 1,
                type: 'welcome',
                text: '',
                author: this.userId,
                parentMessageId: null,
                attendees: []
            }

            this.webSocket.send(JSON.stringify(message))
        }

        this.webSocket.onmessage = (response: MessageEvent) => {
            const message: IMessage = JSON.parse(response.data)

            // Обновление списка пользователей онлайн
            if (message.type === 'online' && this.hasEvent('messengerUpdateOnlineUsers')) {
                window.events.emit('messengerUpdateOnlineUsers', message.text)
            }

            // Увеличение счетчика количества новых сообщений
            if (message.type === 'message' && this.hasEvent('messengerCountMessagesIncrease')) {
                window.events.emit('messengerCountMessagesIncrease')
            }

            // Увеличение счетчика количества новых уведомлений
            if (message.type === 'notification' && this.hasEvent('messengerCountNotificationsIncrease')) {
                window.events.emit('messengerCountNotificationsIncrease')
            }

            // Добавление нового уведомления
            if (message.type === 'notification' && this.hasEvent('messengerNewNotification')) {
                window.events.emit('messengerNewNotification', message)
            } else if (message.type === 'notification' && this.hasEvent('messengerNewToastNotification')) {
                window.events.emit('messengerNewToastNotification', this.userId, message)
            }

            // Создание нового чата
            if (message.type === 'create' && this.hasEvent('messengerCreateMessenger')) {
                window.events.emit('messengerCreateMessenger', message)
            }

            if (message.type === 'read' && this.hasEvent('messengerReadMessage')) {
                window.events.emit('messengerReadMessage', message)
            }

            // Добавление нового сообщения
            if (message.type === 'message' && this.hasEvent('messengerNewMessage')) {
                window.events.emit('messengerNewMessage', message)
            } else if (message.type === 'message' && this.hasEvent('messengerNewToastMessage')) {
                window.events.emit('messengerNewToastMessage', this.userId, message)
            }

            if (message.type === 'notification' && getUserSetting('pushNotify', 0) === 1) {
                newNotification('Новое уведомление', message.text)
            }

            if (message.type === 'message' && getUserSetting('pushMessenger', 0) === 1) {
                newNotification('Новое сообщение', message.text)
            }
        }

        this.webSocket.onclose = function (event: CloseEvent) {
            if (event.wasClean) {
                // Соединение закрыто корректно
                console.info('Корректное закрытие сокета')
            } else {
                // Сервер убил процесс или сеть недоступна, пробуем переподключиться
                window.WS.restart()
            }
        }

        this.webSocket.onerror = function (error: any) {
            console.error(`Произошла ошибка в работе сокета: ${error.message}`)
            window.WS.restart()
        }

        if (this.isRun()) {
            window.events.on('messengerSendMessage', this.sendMessage)
            window.events.on('messengerNewToastMessage', newToastMessage)
            window.events.on('messengerCountMessagesIncrease', countMessagesIncrease)
            window.events.on('messengerNewToastNotification', newToastMessage)
        }
    }

    public sendMessage = (message: IMessage) => {
        this.webSocket.send(JSON.stringify(message))
    }

    public hasEvent = (event: string): boolean => {
        return window.events.listenerCount(event) > 0
    }

    public isRun = (): boolean => {
        return window.WS === undefined || (window.WS && window.WS.readyState === 3)
    }

    public restart = (): void => {
        if (!this.isRun()) {
            const userId = this.userId
            const timeout = this.timeout

            if (this.restartTimer) {
                clearTimeout(this.restartTimer)
            }

            this.restartTimer = setTimeout(function () {
                window.WS = new WS(userId, timeout * 2)
            }, this.timeout)
        }
    }
}

/**
 * Получение идентификаторов участников чата
 *
 * @param members Массив участников чата
 */
export const findMembersIds = (members?: IMessengerMember[]): number[] => {
    if (!members) {
        return []
    }

    return Object.keys(members).map(Number)
}

/**
 * Проверка новое сообщение или уже прочитанное
 *
 * @param userId Идентификатор пользователя, для которого идет проверка
 * @param members Массив участников чата
 * @param message Объект сообщения
 */
export const isNewMessage = (userId: number, members?: IMessengerMember[], message?: IMessage): boolean => {
    if (!members || !members[userId] || !message || !message.id) {
        return false
    }

    const lastReadMessageId: number = members[userId].readed || 0

    return lastReadMessageId < message.id
}

/**
 * Вызов toast для входящего сообщения, если чат закрыт
 *
 * @param userId Идентификатор текущего пользователя
 * @param message Объект сообщения
 */
export const newToastMessage = (userId: number, message: IMessage): void => {
    if (message.author !== userId) {
        switch (message.type) {
            case 'message':
                toast(<ToastMessage message={message}/>, {
                    onClick: () => {
                        openPopupMessenger(document.body, {
                            currentMessengerId: message.messengerId || 0
                        })
                    }
                })
                break
            case 'notification':
                toast(<ToastMessage message={message}/>)
                break
        }
    }
}

/**
 * Увеличение счетчика новых сообщений
 */
export const countMessagesIncrease = (): void => {
    // Todo
}