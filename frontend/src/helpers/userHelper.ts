import {ISelector} from '../@types/ISelector'
import {IUser} from '../@types/IUser'

/**
 * Список ролей
 */
export const rolesList: ISelector[] = [
    {key: 'subscriber', text: 'Подписчик', isRegistration: true},
    {key: 'buyer', text: 'Покупатель', isRegistration: true},
    {key: 'owner', text: 'Собственник', isRegistration: true},
    {key: 'agent', text: 'Агент', isRegistration: true},
    {key: 'investor', text: 'Инвестор', isRegistration: true},
    {key: 'developer', text: 'Застройщик', isRegistration: true},
    {key: 'manager', text: 'Менеджер', isRegistration: false},
    {key: 'administrator', text: 'Администратор', isRegistration: false},
    {key: 'director', text: 'Директор', isRegistration: false, readOnly: true, hidden: true}
]

export const getRoleUserText = (key: string) => {
    const find = rolesList.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
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