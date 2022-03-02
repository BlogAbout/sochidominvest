/**
 * Функция для склонения числительных
 * Пример: declension(6, ['день', 'дня', 'дней']) - вернёт 6 дней
 * @param number
 * @param titles
 * @param onlyWord
 * @param isInteger
 * @return string
 */
export function declension(number: number, titles: string[], onlyWord = false, isInteger = true) {
    if (number < 0) {
        number = Math.abs(number)
    }

    const cases = [2, 0, 1, 1, 1, 2]

    if (!isInteger) {
        return onlyWord ? titles[1] : `${number} ${titles[1]}`
    }

    const word = titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]

    return onlyWord ? word : `${number} ${word}`
}

/**
 * Возвращает уникальный идентификатор
 * @returns {string}
 */
export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export function sliceLastSymbol(value: string) {
    const stringValue = String(value)

    return stringValue.slice(0, -1)
}