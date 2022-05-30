import {ISelector} from '../@types/ISelector'

export const documentTypes: ISelector[] = [
    {key: 'file', text: 'Файл'},
    {key: 'link', text: 'Ссылка'},
    {key: 'constructor', text: 'Конструктор'}
]

export const getDocumentTypeText = (key: string) => {
    const find = documentTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}