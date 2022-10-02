/**
 * Отправить системное (браузерное) уведомление
 * Внимание! В IE нет поддержки самим браузером
 *
 * @param title string Название уведомления
 * @param text string Текст уведомления
 * @param userId number Иконка пользователя (по умолчанию - логотип)
 */
export function newNotification(title: string, text: string, userId: number | null = null) {
    let result = false

    if (!('Notification' in window)) { // Проверка поддержки браузером уведомлений
        console.info('Браузер не поддерживает системные уведомления')
    } else if (Notification.permission === 'granted') { // Проверка разрешения на отправку уведомлений, если разрешено, то создаем уведомление
        newMessage()
    } else if (Notification.permission !== 'denied') { // В противном случае, запрашиваем разрешение
        Notification.requestPermission()
            .then((permission: NotificationPermission) => {
                if (permission === 'granted') { // Если пользователь разрешил, то создаем уведомление
                    newMessage()
                }
            })
    }

    function newMessage() {
        if (isPageHidden()) {
            let icon = '/img/logo-full.jpg'

            // Todo
            // if (userId && userId > 0) {
            //     const src = getPhoto(userId, 50)
            //
            //     if (src) {
            //         icon = src
            //     }
            // }

            const notification = new Notification(title, {body: text, icon, tag: title})
            notification.onclick = () => notification.close() // Закрытие уведомления при нажатии на него
            setTimeout(() => notification.close(), 5000) // Автоматическое закрытие через 5 секунд

            result = true
        } else {
            // console.info('Страница открыта, системное уведомление не создается');
        }
    }

    return result
}

/**
 * Проверить состояние вкладки браузера: скрытая или нет
 *
 * return bool
 */
export function isPageHidden() {
    let hidden
    let result = false // По умолчанию страница считается открытой

    if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden'
    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden'
    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden'
    }

    if (hidden === undefined) {
        // console.info('Браузер не поддерживает Page Visibility API. Определить состояние вкладки невозможно.');
    } else {
        result = document.hidden
    }

    return result
}