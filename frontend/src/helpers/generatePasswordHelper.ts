/**
 * <p>Функция генерации пароля</p>
 *
 * @param passLength - длина пароля
 * @param upperCase - заглавные буквы
 * @param lowerCase - строчные буквы
 * @param digits - числа
 * @param spec - спецсимволы
 */
export const generatePassword = (passLength = 6, upperCase = false, lowerCase = false, digits = false, spec = false): string => {
    const upp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const low = upp.map(char => char.toLowerCase())
    const dig = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const zn = ["~", "!", "@", "#", "$", "%", "^", "&", "*", "-", "_", "=", "+", "<", ">"]

    let res = []
    let password = ''

    if (upperCase) {
        res.push(...upp, ...low)
    }

    if (upperCase) {
        const rand = Math.floor(Math.random() * upp.length)
        password += upp[rand]
    }

    if (lowerCase) {
        const rand = Math.floor(Math.random() * low.length)
        password += low[rand]
    }

    if (digits) {
        const rand = Math.floor(Math.random() * dig.length)
        password += dig[rand]
        res.push(...dig)
    }

    if (spec) {
        const rand = Math.floor(Math.random() * zn.length)
        password += zn[rand]
        res.push(...zn)
    }

    if (!res.length) {
        return generatePassword(6, true, true, true, true)
    }

    const lostLength = +passLength - password.length

    for (let i = 0; i < lostLength; i++) {
        const rand = Math.floor(Math.random() * res.length)
        password += res[rand]
    }

    return password
}