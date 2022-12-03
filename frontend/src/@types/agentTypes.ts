import {IAgent} from './IAgent'

export interface AgentState {
    agents: IAgent[]
    fetching: boolean
    error: string
}

export enum AgentActionTypes {
    AGENT_FETCH_LIST = 'AGENT_FETCH_LIST',
    AGENT_IS_FETCHING = 'AGENT_IS_FETCHING',
    AGENT_ERROR = 'AGENT_ERROR'
}

interface AgentFetchListAction {
    type: AgentActionTypes.AGENT_FETCH_LIST
    payload: IAgent[]
}

export interface AgentIsFetchingAction {
    type: AgentActionTypes.AGENT_IS_FETCHING
    payload: boolean
}

export interface AgentErrorAction {
    type: AgentActionTypes.AGENT_ERROR
    payload: string
}

export type AgentAction = AgentFetchListAction | AgentIsFetchingAction | AgentErrorAction