import {ISelector} from '../@types/ISelector'

export const widgetPages: ISelector[] = [
    {key: 'main', text: 'Главная страница'}
]

export const widgetStyles: ISelector[] = [
    {key: 'list', text: 'Список'},
    {key: 'carousel', text: 'Карусель'},
    {key: 'slider', text: 'Слайдер'}
]

export const widgetTypes: ISelector[] = [
    {key: 'article', text: 'Статьи'},
    {key: 'building', text: 'Недвижимость'},
    {key: 'partner', text: 'Партнеры'}
]

export const getWidgetPageText = (key: string) => {
    const find = widgetPages.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getWidgetStyleText = (key: string) => {
    const find = widgetStyles.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getWidgetTypeText = (key: string) => {
    const find = widgetTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}