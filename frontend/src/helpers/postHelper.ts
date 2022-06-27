import {ISelector} from '../@types/ISelector'

export const postTypes: ISelector[] = [
    {key: 'main', text: 'Главная'},
    {key: 'common', text: 'Общая'}
]

export const getPostTypeText = (key: string) => {
    const find = postTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}