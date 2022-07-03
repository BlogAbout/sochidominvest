import {ISelector} from '../@types/ISelector'

export const mapIconColors: ISelector[] = [
    {key: 'islands#blueIcon', text: 'Синий'},
    {key: 'islands#redIcon', text: 'Красный'},
    {key: 'islands#darkOrangeIcon', text: 'Тёмно-оранжевый'},
    {key: 'islands#darkBlueIcon', text: 'Тёмно-синий'},
    {key: 'islands#pinkIcon', text: 'Розовый'},
    {key: 'islands#grayIcon', text: 'Серый'},
    {key: 'islands#brownIcon', text: 'Коричневый'},
    {key: 'islands#darkGreenIcon', text: 'Тёмно-зелёный'},
    {key: 'islands#violetIcon', text: 'Фиолетовый'},
    {key: 'islands#blackIcon', text: 'Чёрный'},
    {key: 'islands#yellowIcon', text: 'Жёлтый'},
    {key: 'islands#greenIcon', text: 'Зелёный'},
    {key: 'islands#orangeIcon', text: 'Оранжевый'},
    {key: 'islands#lightBlueIcon', text: 'Светло-синий'},
    {key: 'islands#oliveIcon', text: 'Оливковый'}
]

export const getMapIconColorText = (key: string) => {
    const find = mapIconColors.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}