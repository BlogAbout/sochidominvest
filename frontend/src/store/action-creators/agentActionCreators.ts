import {AgentAction, AgentActionTypes} from '../../@types/agentTypes'
import {IAgent} from '../../@types/IAgent'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import AgentService from '../../api/AgentService'

export const AgentActionCreators = {
    setAgents: (agents: IAgent[]): AgentAction => ({
        type: AgentActionTypes.AGENT_FETCH_LIST,
        payload: agents
    }),
    setFetching: (payload: boolean): AgentAction => ({
        type: AgentActionTypes.AGENT_IS_FETCHING,
        payload
    }),
    setError: (payload: string): AgentAction => ({
        type: AgentActionTypes.AGENT_ERROR,
        payload
    }),
    fetchAgentList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(AgentActionCreators.setFetching(true))

        try {
            const response = await AgentService.fetchAgents(filter)

            if (response.status === 200) {
                dispatch(AgentActionCreators.setAgents(response.data))
            } else {
                dispatch(AgentActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(AgentActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}