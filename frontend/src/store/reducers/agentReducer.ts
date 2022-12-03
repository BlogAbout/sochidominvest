import {AgentAction, AgentActionTypes, AgentState} from '../../@types/agentTypes'

const initialState: AgentState = {
    agents: [],
    fetching: false,
    error: ''
}

export default function AgentReducer(state: AgentState = initialState, action: AgentAction): AgentState {
    switch (action.type) {
        case AgentActionTypes.AGENT_FETCH_LIST:
            return {...state, agents: action.payload, fetching: false}
        case AgentActionTypes.AGENT_IS_FETCHING:
            return {...state, fetching: false}
        case AgentActionTypes.AGENT_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}