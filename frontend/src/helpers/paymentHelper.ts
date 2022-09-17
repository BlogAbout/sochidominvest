import {ISelector} from '../@types/ISelector'

export const paymentStatuses: ISelector[] = [
    {key: 'new', text: 'Новый'},
    {key: 'pending', text: 'В ожидании'},
    {key: 'paid', text: 'Оплачен'},
    {key: 'cancel', text: 'Отменен'},
    {key: 'complete', text: 'Завершен'},
]

export const getPaymentStatusText = (key: string) => {
    const find = paymentStatuses.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}