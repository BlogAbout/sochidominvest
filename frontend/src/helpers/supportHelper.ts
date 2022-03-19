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