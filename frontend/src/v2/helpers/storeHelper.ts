import {ISelector} from '../../@types/ISelector'

export const fieldTypes: ISelector[] = [
    {key: 'length', text: 'Длина, см.'},
    {key: 'width', text: 'Ширина, см.'},
    {key: 'height', text: 'Высота, см.'},
    {key: 'depth', text: 'Глубина, см.'},
    {key: 'diameter', text: 'Диаметр, см.'},
]

export const getFieldTypeText = (key: string) => {
    const find = fieldTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}