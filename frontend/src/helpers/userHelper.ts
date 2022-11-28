import {ISelector} from '../@types/ISelector'
import {IUser} from '../@types/IUser'

/**
 * Список ролей
 */
export const rolesList: ISelector[] = [
    {key: 'subscriber', text: 'Подписчик', isRegistration: true},
    {key: 'manager', text: 'Менеджер', isRegistration: false},
    {key: 'administrator', text: 'Администратор', isRegistration: false},
    {key: 'director', text: 'Директор', isRegistration: false, readOnly: true, hidden: true}
]

export const getRoleUserText = (key: string) => {
    const find = rolesList.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const findUser = (users: IUser[], userId?: number | null) => {
    if (!userId || !users || !users.length) {
        return null
    }

    const user =  users.find((user: IUser) => user.id === userId)

    return user || null
}

export const getUserName = (users: IUser[], userId?: number | null) => {
    if (!userId || !users || !users.length) {
        return 'Пользователь не найден'
    }

    const findUser = users.find((user: IUser) => user.id === userId)

    if (!findUser) {
        return 'Пользователь не найден'
    }

    return findUser.firstName
}

export const getUserAvatar = (users: IUser[], userId?: number | null) => {
    if (!userId || !users || !users.length) {
        return ''
    }

    const findUser = users.find((user: IUser) => user.id === userId)

    if (!findUser) {
        return ''
    }

    return findUser.avatar
}

export const getUserSetting = (param: string, defaultValue: string | number = ''): string | number => {
    let settingsString = localStorage.getItem('settings')

    if (!settingsString) {
        return defaultValue
    }

    const settings = JSON.parse(settingsString)

    if (!(param in settings)) {
        return defaultValue
    }

    return settings[param]
}