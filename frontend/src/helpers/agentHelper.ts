import {ISelector} from '../@types/ISelector'

export const agentTypes: ISelector[] = [
    {key: 'agent', text: 'Агентство'}
]

export const getAgentTypeText = (key: string) => {
    const find = agentTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}