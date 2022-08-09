import {IBusinessProcessStep} from '../@types/IBusinessProcess'

export const bpSteps: IBusinessProcessStep = {
    default: 'Общие',
    process: 'В работе',
    discussion: 'На обсуждении',
    complete: 'Завершены',
    rejected: 'Отклонены',
    waitingResponse: 'Ожидают ответа',
    final: 'Итог'
}