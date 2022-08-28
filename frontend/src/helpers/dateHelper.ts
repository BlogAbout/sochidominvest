import moment from 'moment'

export const getFormatDate = (dateStr: string | null | undefined, format: string = 'all') => {
    if (!dateStr) {
        return ''
    }

    const date = moment(dateStr)

    if (format && format === 'date') {
        return date.format('DD.MM.YYYY')
    } else if (format && format === 'time') {
        return date.format('hh:mm')
    }

    return date.format('DD.MM.YYYY в hh:mm')
}