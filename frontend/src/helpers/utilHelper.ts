export const apiPath = 'https://api.sochidominvest.ru/'

export const siteTitle = 'СочиДомИнвест'

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