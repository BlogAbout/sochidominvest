/**
 * Округляет и форматирует число до указанной точности
 * @param number число
 * @param precision точность
 * @return float отформатированное число
 */
export const round = (number: number, precision: number) => +(+number).toFixed(precision)

/**
 * Добавляет в число отображение разрядов
 * @param number число (пример: -2120350.99)
 * @return string число с разрядами (пример: -2 120 350.99)
 */
export function numberWithSpaces(number: number) {
    return String(number).replace(/(?=\B(?:\d{3})+(?!\d))/g, ' ')
}

/**
 * Возвращает случайное целое число в диапазоне от min до max
 * @param min минимальное число
 * @param max максимальное число
 * @return int случайное число
 */
export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min