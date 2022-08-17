import React, {ReactNode} from 'react'
import ReactDOM from 'react-dom'
import {updateNodePath} from './eventsHelper'
import {isTouchDevice} from './deviceHelper'
import {PopupDisplayOptions, PopupPositionCorrector, PopupProps, PopupShiftMethod} from '../@types/IPopup'

/**
 * <p>Открывает popup. Если подан e.target тогда открывает попап по краю расположения элемента, иначе по координатам клика мышки.</p>
 * @param popupType - тип popup
 * @param popupProps
 * @param popupContent
 * @param eventOrTarget
 * @param displayOptions - опции для открытия popup
 */
export function openPopup(
    popupType: any,
    popupProps: PopupProps = {},
    popupContent: ReactNode,
    eventOrTarget: any,
    displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions
) {
    const id = Date.now() + Math.random().toFixed(5)
    popupProps.id = id

    // Создание контейнера для попапа
    const reactPopupContainer = document.createElement('div')
    const centerDiv = document.querySelector('.center-div')

    reactPopupContainer.id = 'reactPopupContainer-' + id
    reactPopupContainer.style.zIndex = displayOptions.alwaysTop ? '999' : '9' // Todo: or MSP.getMaxZIndex()
    reactPopupContainer.style.position = displayOptions.fullScreen ? 'absolute' : 'fixed'
    if (displayOptions.isFixed) {
        reactPopupContainer.style.position = 'fixed'
    }
    reactPopupContainer.setAttribute('popupType', popupType.name)

    // Установка позиции контейнера для попапа
    let target, top, left
    let targetRect: DOMRect = {} as DOMRect
    const offsetLeft = displayOptions.offsetLeft || 0
    const offsetTop = displayOptions.offsetTop || 0

    if (eventOrTarget.nodeType === 1) { // Подана нода
        target = eventOrTarget
        targetRect = target.getBoundingClientRect()
        top = targetRect.top + (offsetTop || targetRect.height)
        left = targetRect.left + offsetLeft
    } else { // Подано событие
        target = eventOrTarget.target
        top = eventOrTarget.clientY ? eventOrTarget.clientY + offsetTop : offsetTop
        left = eventOrTarget.clientX ? eventOrTarget.clientX + offsetLeft : offsetLeft
    }

    if (!displayOptions.fullScreen) {
        reactPopupContainer.style.top = top + 'px'
        reactPopupContainer.style.left = left + 'px'
    }

    if (displayOptions.fullScreen && centerDiv) {
        if (displayOptions.rightPanel) {
            reactPopupContainer.classList.add('full-screen-popup-right')
        }

        centerDiv.appendChild(reactPopupContainer)
        reactPopupContainer.getBoundingClientRect()

        if (displayOptions.rightPanel) {
            reactPopupContainer.classList.add('show-popup-right-panel')
        } else {
            reactPopupContainer.classList.add('show-popup')
        }
    } else {
        document.body.appendChild(reactPopupContainer)
    }

    ReactDOM.render(React.createElement(popupType, popupProps, popupContent), reactPopupContainer)

    if (displayOptions.fullScreen) {
        // Ничего не делаем
    } else if (displayOptions.center) {
        updatePopupToCenterPosition(id, {top: offsetTop, left: offsetLeft})

        if (displayOptions.animate || displayOptions.animate === undefined) {
            _animateDisplayPopup(reactPopupContainer)
        }
    } else {
        let shiftOrOffset: boolean | PopupShiftMethod = {} as PopupShiftMethod

        if (displayOptions.shiftMethod) {
            shiftOrOffset = true
        } else { // Если не используется offset подготавливаем сдвиги на края элемента target
            shiftOrOffset.top = offsetTop ? 0 : targetRect.height
            shiftOrOffset.left = offsetLeft ? 0 : targetRect.width
        }

        if (displayOptions.updatePosition || displayOptions.updatePosition === undefined) {
            if (displayOptions.animate || displayOptions.animate === undefined) {
                _updatePopupPositionWithAnimation(id, shiftOrOffset)
            } else {
                updatePopupPosition(id, shiftOrOffset)
            }
        }
    }

    _updatePopupParents(id, target)

    if (displayOptions.autoClose || displayOptions.autoClose === undefined) {
        _addAutoCloseEvent(id, displayOptions.onAutoClose)
    } else {
        _addAutoFocusEvent(id, displayOptions)
    }

    return id
}

/**
 * <p>Обновление позиции попапа, чтобы всегда влезал на экран</p>
 * <p>По умолчанию обновление позиции происходит инвертированно от левого верхнего угла попапа</p>
 * <p>Если shiftOrOffset === true тогда используется обновление позиции сдвигом, иначе применяется offset, например, чтоб при обновлении позиции не перекрыть target попапом</p>
 * @param id - идентификатор popup
 * @param shiftOrOffset - свдиг позиции popup
 */
export function updatePopupPosition(
    id: string,
    shiftOrOffset: boolean | PopupShiftMethod = {} as PopupShiftMethod
) {
    const reactPopupContainer = getPopupContainer(id)

    if (!reactPopupContainer) {
        return
    }

    let correctValue = 0

    const popupPosition = reactPopupContainer.getBoundingClientRect()
    const result: PopupPositionCorrector = {} as PopupPositionCorrector
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const shiftMethod = typeof shiftOrOffset === 'boolean' ? shiftOrOffset : false
    const offsetLeft = typeof shiftOrOffset !== 'boolean' ? shiftOrOffset.left : 0
    const offsetTop = typeof shiftOrOffset !== 'boolean' ? shiftOrOffset.top : 0

    if (windowWidth < (popupPosition.left + popupPosition.width)) {
        if (shiftMethod) {
            correctValue = windowWidth - (popupPosition.width + 5)
        } else {
            correctValue = (popupPosition.left - popupPosition.width) + offsetLeft
        }

        if (correctValue < 0) {
            correctValue = 0
        }

        reactPopupContainer.style.left = correctValue + 'px'
        result.width = true
    }

    if (windowHeight < (popupPosition.top + popupPosition.height)) {
        if (shiftMethod) {
            correctValue = windowHeight - (popupPosition.height + 5)
        } else {
            correctValue = (popupPosition.top - popupPosition.height) - offsetTop
        }

        if (correctValue < 0) {
            correctValue = 0
        }

        reactPopupContainer.style.top = correctValue + 'px'
        result.height = true
    }

    result.shiftMethod = shiftMethod

    return result
}

/**
 * <p>Обновление позиции попапа, чтобы он был по центру</p>
 * @param id - идентификатор popup
 * @param offset - сдвиги
 */
export function updatePopupToCenterPosition(id: string, offset: any = {}) {
    const reactPopupContainer = getPopupContainer(id)

    if (!reactPopupContainer) {
        return
    }

    let correctValue

    const popupPosition = reactPopupContainer.getBoundingClientRect()
    const result: PopupPositionCorrector = {} as PopupPositionCorrector
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const offsetLeft = offset.left || 0
    const offsetTop = offset.top || 0

    correctValue = (windowWidth - popupPosition.width) / 2 + offsetLeft

    if (correctValue < 0) {
        correctValue = 0
    }

    if ((correctValue + popupPosition.width) > windowWidth) {
        correctValue = windowWidth - popupPosition.width
    }

    reactPopupContainer.style.left = correctValue + 'px'
    result.width = true
    correctValue = (windowHeight - popupPosition.height) / 2 - offsetTop

    if (correctValue < 0) {
        correctValue = 0
    }

    if ((correctValue + popupPosition.height) > windowHeight) {
        correctValue = windowHeight - popupPosition.height
    }

    reactPopupContainer.style.top = correctValue + 'px'
    result.height = true

    return result
}

/**
 * <p>Обновляет массив где хранятся связи попапа и его родителей-попапов</p>
 * @param id - идентификатор popup
 * @param target
 */
function _updatePopupParents(id: string, target: Node) {
    const path: any[] = []
    updateNodePath(path, target)

    if (!window.popupParents) {
        window.popupParents = {}
    }

    if (!window.popupParents[id]) {
        window.popupParents[id] = []
    }

    for (let i = 0; i < path.length; i++) {
        if (path[i].id && path[i].id.startsWith('reactPopupContainer-')) {
            const parentId = path[i].id.split('-')[1]
            const parentChildren = window.popupParents[parentId]

            window.popupParents[id] = window.popupParents[id].concat(parentChildren)
            window.popupParents[id].push(parentId)

            break
        }
    }
}

/**
 * <p>Возвращает div в который вложен react-popup</p>
 * @param id - идентификатор popup
 */
export function getPopupContainer(id: string): HTMLElement | null {
    return document.getElementById('reactPopupContainer-' + id)
}

/**
 * <p>Удаляет попап по id</p>
 * @param id - идентификатор popup
 */
export function removePopup(id: string) {
    if (!id) {
        return false
    }

    let centerDiv: HTMLElement | null
    if (!Object.prototype.hasOwnProperty.call(window, 'externalID')) { // Для внешнего пользователя отдаем .center-article-right-panel-div
        centerDiv = document.querySelector('.center-div')
    } else {
        centerDiv = document.querySelector('.center-article-right-panel-div') || document.querySelector('.center-article-left-panel-div')
    }

    _removeAutoCloseEvent(id)
    _removeAutoFocusEvent(id)

    const reactPopupContainer = getPopupContainer(id)

    if (!reactPopupContainer) {
        return false
    }

    if (centerDiv && centerDiv.contains(reactPopupContainer)) {
        reactPopupContainer.classList.toggle('show-popup')
        reactPopupContainer.classList.remove('show-popup-right-panel')
        reactPopupContainer.classList.remove('show-popup-left-panel')

        setTimeout(() => {
            if (reactPopupContainer) {
                ReactDOM.unmountComponentAtNode(reactPopupContainer)

                if (centerDiv) {
                    centerDiv.removeChild(reactPopupContainer)
                }
            }
        }, 300)
    } else {
        ReactDOM.unmountComponentAtNode(reactPopupContainer)
        document.body.removeChild(reactPopupContainer)
    }

    delete window.popupParents[id]
}

/**
 * <p>Обработчик события клика по document.body</p>
 * @param id - идентификатор popup
 * @param onAutoClose - callback функция
 * @param e
 */
function _handlerClose(id: string, onAutoClose: any = undefined, e: any) {
    const path: any[] = []
    updateNodePath(path, e.target)

    const reactPopupContainer = getPopupContainer(id)

    for (let i = 0; i < path.length; i++) {
        // Если в пути встречается сам попап, тогда ничего не делаем, так как клик произошел во внутреннем элементе
        // Проверка произошел ли клик в дочерний элемент закрываемого попапа
        if (path[i] === reactPopupContainer) {
            return
        }

        // Если в пути встречается другой попап, тогда проверяем ребенок ли он текущего попапа. Если ребенок, тогда ничего не делаем.
        // Проверка произошел ли клик в дочерний попап закрываемого попапа
        if (path[i].id && path[i].id.startsWith('reactPopupContainer-')) {
            const targetId = path[i].id.split('-')[1] // В пути до кликнутого элемента есть попап
            const parents = window.popupParents[targetId] // Получаем всех родителей для попапа в который кликнули

            if (parents.indexOf('' + id) !== -1) { // Если текущий закрываемый попап это родитель кликнутого, тогда ничего не делаем
                return
            }
        }
    }

    if (onAutoClose !== undefined) {
        onAutoClose()
    }

    removePopup(id)
}

/**
 * <p>Закрыть все попапы подходящие под тип popupType</p>
 * <p>Если подан excludeID, тогда попап с таким ID не будет закрыт</p>
 * @param popupType
 * @param excludeID
 */
export function closePopupsByType(popupType: any, excludeID: string) {
    if (!window.popupParents) {
        return false
    }

    let popup, popupID

    for (popupID in window.popupParents) {
        if (!Object.prototype.hasOwnProperty.call(window.popupParents, popupID)) {
            continue
        }

        if (popupID === excludeID) {
            continue
        }

        popup = getPopupContainer(popupID)
        if (popup && popupType.name === popup.getAttribute('popupType')) {
            removePopup(popupID)
        }
    }
}

/**
 * <p>Анимация при открытии попапа. Увеличение размера попапа из точки события. По умолчанию слева-направо, сверху-вниз.</p>
 * @param reactPopupContainer - контейнер popup
 * @param updatePositionResult - инвертирует анимацию для заданых направлений
 */
function _animateDisplayPopup(reactPopupContainer: HTMLElement, updatePositionResult: PopupPositionCorrector = {} as PopupPositionCorrector) {
    const transformOriginWidth = !updatePositionResult.width ? 'left' : 'right'
    const transformOriginHeight = !updatePositionResult.height ? ' top' : ' bottom'

    reactPopupContainer.style.transformOrigin = transformOriginWidth + transformOriginHeight
    reactPopupContainer.style.transform = 'scale(0.1)'

    setTimeout(() => { // Задержка нужна, чтоб сработал transition
        if (!reactPopupContainer) {
            return
        }

        reactPopupContainer.style.transition = 'transform 0.3s, left 0.2s, top 0.2s' // left 0.2s, top 0.2s для shiftMethod
        reactPopupContainer.style.transform = 'scale(1)'
    }, 1)

    setTimeout(() => { // Чистим следы анимации
        if (!reactPopupContainer) {
            return
        }

        reactPopupContainer.style.transition = ''
        reactPopupContainer.style.transform = ''
        reactPopupContainer.style.transformOrigin = ''
    }, 500)
}

/**
 * <p>Обновление позиции попапа с анимацией открытия</p>
 * @param id - идентификатор popup
 * @param shiftOrOffset - свдиг позиции popup
 */
function _updatePopupPositionWithAnimation(
    id: string,
    shiftOrOffset: boolean | PopupShiftMethod = {} as PopupShiftMethod
) {
    const reactPopupContainer = getPopupContainer(id)

    if (!reactPopupContainer) {
        return
    }

    const shiftMethod = typeof shiftOrOffset === 'boolean' ? shiftOrOffset : false

    if (shiftMethod) {
        _animateDisplayPopup(reactPopupContainer)

        setTimeout(() => {
            updatePopupPosition(id, shiftMethod)
        }, 330)
    } else {
        const updatePositionResult = updatePopupPosition(id, shiftOrOffset)
        _animateDisplayPopup(reactPopupContainer, updatePositionResult)
    }
}

/**
 * <p>Навешивание события автоматического закрытия на функцию _handlerClose при клике мимо попапа</p>
 * @param id - идентификатор popup
 * @param onAutoClose
 */
function _addAutoCloseEvent(id: string, onAutoClose?: any) {
    const autoClose = _handlerClose.bind(this, id, onAutoClose)

    document.body.addEventListener('mousedown', autoClose, true)

    if (!window.popupAutoCloseEvents) {
        window.popupAutoCloseEvents = {}
    }

    window.popupAutoCloseEvents[id] = autoClose
}

/**
 * <p>Удаление события автоматического закрытия при клике мимо попапа</p>
 * @param id - идентификатор popup
 */
function _removeAutoCloseEvent(id: string) {
    if (!window.popupAutoCloseEvents || !window.popupAutoCloseEvents[id]) {
        return false
    }

    const autoClose = window.popupAutoCloseEvents[id]

    document.body.removeEventListener('mousedown', autoClose, true)

    delete window.popupAutoCloseEvents[id]
}

/**
 * <p>Навешивание события для того, чтоб попап был в фокусе (выше всех) при клике в него</p>
 * @param id - идентификатор popup
 * @param displayOptions - опции для popup
 */
function _addAutoFocusEvent(id: string, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    const reactPopupContainer = getPopupContainer(id)
    const isAlwaysTop = displayOptions.alwaysTop

    if (!reactPopupContainer) {
        return
    }

    if (displayOptions.autoFocus || displayOptions.autoFocus === undefined) {
        const autoFocus = () => {
            reactPopupContainer.style.zIndex = isAlwaysTop ? '999' : '9' // Todo: or MSP.getMaxZIndex()
        }

        reactPopupContainer.addEventListener('mousedown', autoFocus, true)

        if (!window.popupAutoFocusEvents) {
            window.popupAutoFocusEvents = {}
        }

        window.popupAutoFocusEvents[id] = autoFocus
    }
}

/**
 * <p>Удаление события фокуса (выше всех) при клике в попап</p>
 * @param id - идентификатор popup
 */
function _removeAutoFocusEvent(id: string) {
    const reactPopupContainer = getPopupContainer(id)

    if (!reactPopupContainer) {
        return
    }

    if (!window.popupAutoFocusEvents || !window.popupAutoFocusEvents[id]) {
        return false
    }

    const autoFocus = window.popupAutoFocusEvents[id]

    reactPopupContainer.removeEventListener('mousedown', autoFocus, true)

    delete window.popupAutoFocusEvents[id]
}

/**
 * <p>Обработчик перетаскивания попапа</p>
 * <p>Пример использования: <div className={style['header']} onMouseDown={dragHandler.bind(this, this.props.id)}></p>
 * @param id - идентификатор popup
 * @param e
 */
export function dragHandler(id: string, e: any) {
    const reactPopupContainer = getPopupContainer(id)
    const isTouch = isTouchDevice()
    const events = {
        pointerUp: isTouch ? 'touchend' : 'mouseup',
        pointerMove: isTouch ? 'touchmove' : 'mousemove'
    }

    if (!reactPopupContainer) {
        return
    }

    let dragStartPoint: any = {}
    const dragMoveHandler = (e: any) => {
        if (!dragStartPoint) {
            dragClearEvents()

            return false
        }

        e.preventDefault()
        e = isTouch ? e.changedTouches[0] : e

        const y = e.screenY - dragStartPoint.y
        const x = e.screenX - dragStartPoint.x

        reactPopupContainer.style.top = y + 'px'
        reactPopupContainer.style.left = x + 'px'
    }

    const dragEndHandler = (e: any) => {
        if ((e.button === 0 || isTouch) && dragStartPoint) {
            dragClearEvents()
        }
    }

    const dragClearEvents = () => {
        dragStartPoint = null
        document.body.removeEventListener(events.pointerMove, dragMoveHandler)
        document.body.removeEventListener(events.pointerUp, dragEndHandler)
    }

    if (e.button === 0 || isTouch) {
        const popupRect = reactPopupContainer.getBoundingClientRect()
        e = isTouch ? e.changedTouches[0] : e

        dragStartPoint = {x: e.screenX - popupRect.left, y: e.screenY - popupRect.top}
        document.body.addEventListener(events.pointerMove, dragMoveHandler)
        document.body.addEventListener(events.pointerUp, dragEndHandler)
    }
}