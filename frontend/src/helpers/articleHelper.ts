import {ISelector} from '../@types/ISelector'

export const articleTypes: ISelector[] = [
    {key: 'article', text: 'Статья'},
    {key: 'action', text: 'Акция'},
    {key: 'news', text: 'Новость'}
]

export const getArticleTypeText = (key: string) => {
    const find = articleTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}