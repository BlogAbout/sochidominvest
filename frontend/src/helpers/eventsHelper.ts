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

export function registerEventsEmitter() {
    window.events = new EventEmitter()
}

export function registerWebsocket(userId: number) {
    let timeout = 5000

    window.WS = new WS(userId)

    if (window.WS === undefined || (window.WS && window.WS.readyState === 3)) {
        setTimeout(function() {
            registerWebsocket(userId)
            timeout *= 2
        }, timeout)
    }
}