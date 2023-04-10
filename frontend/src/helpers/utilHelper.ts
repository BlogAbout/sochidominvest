import {ISetting} from '../@types/ISetting'

export const configuration = {
    apiPath: 'http://sochidominvest/api/v1',
    // apiPath: 'https://api.sochidominvest.ru/api/v1',
    webSocketPath: 'ws://127.0.0.1:8081',
    // webSocketPath: 'wss://api.sochidominvest.ru:8081',
    apiUrl: 'https://api.sochidominvest.ru/',
    siteUrl: 'https://sochidominvest.ru/',
    siteTitle: 'СОЧИДОМИНВЕСТ',
    sitePhone: '+7 (985) 767-04-21',
    // sitePhone: '+7 (918) 605-34-27',
    sitePhoneUrl: 'tel:+79857670421',
    // sitePhoneUrl: 'tel:+79186053427',
    siteEmail: 'info@sochidominvest.ru',
    siteEmailUrl: 'mailto:info@sochidominvest.ru',
    apiYandexMapKey: '3ed788dc-edd5-4bce-8720-6cd8464b45bd',
    apiYandexMapIcon: 'islands#blueIcon'
}

/**
 * Получение типа отображения
 *
 * @param type Тип раздела (пользователи, недвижимость и т.д.)
 */
export const getLayout = (type: string) => {
    if (type.trim() === '') {
        return 'list'
    }

    const listLayouts = localStorage.getItem('listLayouts')

    if (!listLayouts) {
        return 'list'
    }

    const listLayoutsItems = JSON.parse(listLayouts)

    switch (type) {
        case 'users':
            if (listLayoutsItems && 'users' in listLayoutsItems) {
                return listLayoutsItems.users
            }
            return 'list'
        case 'articles':
            if (listLayoutsItems && 'articles' in listLayoutsItems) {
                return listLayoutsItems.articles
            }
            return 'list'
        case 'developers':
            if (listLayoutsItems && 'developers' in listLayoutsItems) {
                return listLayoutsItems.developers
            }
            return 'list'
        case 'agents':
            if (listLayoutsItems && 'agents' in listLayoutsItems) {
                return listLayoutsItems.developers
            }
            return 'list'
        case 'partners':
            if (listLayoutsItems && 'partners' in listLayoutsItems) {
                return listLayoutsItems.partners
            }
            return 'list'
        case 'documents':
            if (listLayoutsItems && 'documents' in listLayoutsItems) {
                return listLayoutsItems.documents
            }
            return 'list'
        case 'buildings':
            if (listLayoutsItems && 'buildings' in listLayoutsItems) {
                return listLayoutsItems.buildings
            }
            return 'list'
        case 'rents':
            if (listLayoutsItems && 'rents' in listLayoutsItems) {
                return listLayoutsItems.rents
            }
            return 'list'
        case 'products':
            if (listLayoutsItems && 'products' in listLayoutsItems) {
                return listLayoutsItems.rents
            }
            return 'products'
        default:
            return 'list'
    }
}

export const changeLayout = (type: string, layout: string) => {
    let listLayouts = localStorage.getItem('listLayouts')
    let listLayoutsItems: {[key: string]: string} = {} as {[key: string]: string}

    if (listLayouts) {
        listLayoutsItems = JSON.parse(listLayouts)
    }

    listLayoutsItems[type] = layout

    localStorage.setItem('listLayouts', JSON.stringify(listLayoutsItems))
}

export const getSetting = (key: string, settings: ISetting): string => {
    if (!key || key.trim() === '') {
        return ''
    }

    if (settings && key in settings) {
        return settings[key]
    } else {
        return ''
    }
}