import {ISelector} from '../../@types/ISelector'

export const fieldTypes: ISelector[] = [
    {key: 'length', text: 'Длина, см.'},
    {key: 'width', text: 'Ширина, см.'},
    {key: 'height', text: 'Высота, см.'},
    {key: 'depth', text: 'Глубина, см.'},
    {key: 'diameter', text: 'Диаметр, см.'},
    {
        key: 'material',
        text: 'Материал',
        children: [
            {key: 'Металл', text: 'Металл'},
            {key: 'Керамика', text: 'Керамика'},
            {key: 'Композит', text: 'Композит'},
            {key: 'Дерево', text: 'Дерево'},
            {key: 'Пластик', text: 'Пластик'},
            {key: 'Гранит', text: 'Гранит'}
        ]
    }
]

export const getFieldTypeText = (key: string) => {
    const find = fieldTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getFieldTypeChildren = (key: string) => {
    const find = fieldTypes.find((item: ISelector) => item.key === key)
    return find && find.children ? find.children : []
}