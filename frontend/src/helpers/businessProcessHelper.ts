import {IBusinessProcessStep} from '../@types/IBusinessProcess'
import {ISelector} from '../@types/ISelector'

export const bpSteps: IBusinessProcessStep = {
    default: 'Общие',
    process: 'В работе',
    discussion: 'На обсуждении',
    complete: 'Завершены',
    rejected: 'Отклонены',
    waitingResponse: 'Ожидают ответа',
    final: 'Итог'
}

export const bpTypes: ISelector[] = [
    {key: 'feed', text: 'Заявка'},
    {key: 'booking', text: 'Аренда'},
    {key: 'deal', text: 'Сделка'}
]

export const getBpTypesText = (key: string) => {
    const find = bpTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBpStepsList = () => {
    const bpStepsList: ISelector[] = []

    Object.keys(bpSteps).forEach((step: string) => {
        bpStepsList.push({
            key: step,
            text: bpSteps[step]
        })
    })

    return bpStepsList
}