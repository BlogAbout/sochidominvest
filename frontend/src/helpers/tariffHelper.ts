import {ISelector} from '../@types/ISelector'

export const tariffs: ISelector[] = [
    {key: '1', text: 'Базовый'},
    {key: '2', text: 'Бизнес'},
    {key: '3', text: 'Эффективность Плюс'},
]

export const getTariffText = (key: string) => {
    const find = tariffs.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}