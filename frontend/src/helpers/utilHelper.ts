export const apiPath = 'https://api.sochidominvest.ru/'

export const siteTitle = 'СОЧИДОМИНВЕСТ'

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