import {ISelector} from '../@types/ISelector'

export const feedTypes: ISelector[] = [
    {key: 'feed', text: 'Заявка'},
    {key: 'ticket', text: 'Тикет'},
    {key: 'callback', text: 'Обратный звонок'}
]

export const feedStatuses: ISelector[] = [
    {key: 'new', text: 'Новый'},
    {key: 'process', text: 'В обработке'},
    {key: 'close', text: 'Закрыт'}
]