import {configuration} from './utilHelper'
import {IMessage, IMessengerMember} from '../@types/IMessenger'

export class WS {
    private webSocket
    private userId

    constructor(userId: number) {
        this.userId = userId
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

            this.webSocket.send(JSON.stringify(message));
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
                window.events.emit('messengerNewToastMessage', message)
            }
        }

        this.webSocket.onclose = function (event: CloseEvent) {
            if (event.wasClean) {
                // Todo: Соединение закрыто корректно
                console.log('correct close')
            } else {
                console.log('error close')
                // Todo: Сервер убил процесс или сеть недоступна, пробуем переподключиться
            }
        }

        this.webSocket.onerror = function (error: any) {
            console.error(`Произошла ошибка в работе сокета: ${error.message}`)
        }

        window.events.on('messengerSendMessage', this.sendMessage)
    }

    public sendMessage = (message: IMessage) => {
        this.webSocket.send(JSON.stringify(message))
    }

    public hasEvent = (event: string): boolean => {
        return window.events.listenerCount(event) > 0
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

    const readed: number = members[userId].readed || 0

    return readed < message.id
}