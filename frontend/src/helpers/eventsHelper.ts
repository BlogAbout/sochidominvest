import EventEmitter from 'events'
import {WS} from './messengerHelper'

/**
 * <p>Обновляет path, генерируя путь от документа до target-node в виде массива</p>
 * @param path текущий node
 * @param target массив node
 */
export function updateNodePath(path: Node[], target: Node) {
    if (target) {
        path.push(target)

        if (target.parentNode) {
            updateNodePath(path, target.parentNode)
        }
    }
}

/**
 * Регистрация эмиттера событий
 */
export function registerEventsEmitter() {
    window.events = new EventEmitter()
}

/**
 * Регистрация веб сокета
 *
 * @param userId Идентификатор пользователя
 */
export function registerWebsocket(userId: number) {
    window.WS = new WS(userId)
}