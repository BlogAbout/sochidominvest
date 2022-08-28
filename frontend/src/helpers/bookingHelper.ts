import {ISelector} from "../@types/ISelector";

export const bookingStatuses: ISelector[] = [
    {key: 'new', text: 'Новое'},
    {key: 'process', text: 'В процессе'},
    {key: 'finish', text: 'Завершено'},
    {key: 'cancel', text: 'Отменено'},
    {key: 'remove', text: 'Удалено'}
]

export const getBookingStatusText = (key: string) => {
    const find = bookingStatuses.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}