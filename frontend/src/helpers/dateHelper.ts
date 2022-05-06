import moment from 'moment'

export const getFormatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) {
        return ''
    }

    const date = moment(dateStr)

    return date.format('DD.MM.YYYY в hh:mm')
}