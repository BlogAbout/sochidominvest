import {ITariff} from '../@types/ITariff'

export const tariffs: ITariff[] = [
    {
        objectId: 1,
        key: 'base',
        name: 'Базовый',
        cost: 2100,
        advantages: [
            '5 активных объектов недвижимости (кроме типа "Новостройка")',
            '300 уникальных просмотров в публичном разделе сервиса'
        ]
    },
    {
        objectId: 2,
        key: 'business',
        name: 'Бизнес',
        cost: 9500,
        advantages: [
            '10 активных объектов недвижимости (любого типа)',
            '10 активных квартир в шахматке на каждый объект недвижимости типа "Новостройка"',
            '500 уникальных просмотров в публичном разделе сервиса',
            'Доступ к созданию 1 своего Агентства',
            'Доступ к созданию 1 своего Застройщика'
        ]
    },
    {
        objectId: 3,
        key: 'effectivePlus',
        name: 'Эффективность Плюс',
        cost: 25000,
        advantages: [
            '25 активных объектов недвижимости (любого типа)',
            'Нелимитированное количество активных квартир в шахматке на каждый объект недвижимости типа "Новостройка"',
            'Нелимитированное количество уникальных просмотров в публичном разделе сервиса',
            'Доступ к созданию нелимитированного количества своих Агентств',
            'Доступ к созданию нелимитированного количества своих Застройщиков',
            'Доступ к конструктору документов',
            'Помощь наших менеджеров в подборе и организации сделок купли/продажи и сдачи/аренды'
        ]
    }
]

export const getTariffText = (key: string) => {
    const find = tariffs.find((item: ITariff) => item.key === key)
    return find ? find.name : ''
}

export const compareTariffLevels = (oldTariff: string, newTariff: string): number => {
    const findOldTariffIndex = tariffs.findIndex((item: ITariff) => item.key === oldTariff)
    const findNewTariffIndex = tariffs.findIndex((item: ITariff) => item.key === newTariff)

    if (findOldTariffIndex === findNewTariffIndex) {
        return 0
    } else if (findOldTariffIndex === -1 || findNewTariffIndex > findOldTariffIndex) {
        return 1
    } else if (findNewTariffIndex === -1 || findNewTariffIndex < findOldTariffIndex) {
        return -1
    }

    return 0
}