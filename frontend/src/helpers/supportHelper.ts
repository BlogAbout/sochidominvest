import {ISelector} from '../@types/ISelector'

export const feedTypes: ISelector[] = [
    {key: 'feed', text: 'Заявка'},
    {key: 'ticket', text: 'Тикет'},
    {key: 'callback', text: 'Обратный звонок'}
]

export const objectTypes: ISelector[] = [
    {key: 'building', text: 'Объект недвижимости'}
]

export const feedStatuses: ISelector[] = [
    {key: 'new', text: 'Новый'},
    {key: 'process', text: 'В обработке'},
    {key: 'clarification', text: 'На уточнении'},
    {key: 'cancel', text: 'Отменено'},
    {key: 'close', text: 'Закрыт'}
]

export const getFeedStatusesText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = feedStatuses.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getFeedObjectText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = objectTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getFeedTypesText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = feedTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}