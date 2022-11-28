import {ISelector} from '../@types/ISelector'

export const mailingTypes: ISelector[] = [
    {key: 'mail', text: 'Сообщение'},
    {key: 'compilation', text: 'Подборка'},
    {key: 'notification', text: 'Уведомление'}
]

export const getMailingTypeText = (key: string): string => {
    const find = mailingTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getMailingStatusText = (status: number): string => {
    switch (status) {
        case -1: return 'Ошибка'
        case 1: return 'Запущен'
        case 2: return 'Завершен'
        default: return 'Остановлен'
    }
}