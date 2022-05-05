import {ISelector} from '../@types/ISelector'

export const partnerTypes: ISelector[] = [
    {key: 'partner', text: 'Партнер'},
    {key: 'sponsor', text: 'Спонсор'}
]

export const getPartnerTypeText = (key: string) => {
    const find = partnerTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}