import {ISelector} from '../@types/ISelector'

export const questionTypes: ISelector[] = [
    {key: 'common', text: 'Общие'},
    {key: 'payment', text: 'Оплата'},
    {key: 'tariffs', text: 'Тарифы'},
    {key: 'other', text: 'Другое'},
]

export const getQuestionTypeText = (key: string) => {
    const find = questionTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}