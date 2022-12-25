import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IAgent, IContact} from '../@types/IAgent'
import {IFilter} from '../@types/IFilter'

export default class AgentService {
    static async fetchAgentById(agentId: number): Promise<AxiosResponse> {
        return API.get(`/agent/${agentId}`)
    }

    static async fetchAgents(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/agent', {params: filter})
    }

    static async saveAgent(agent: IAgent): Promise<AxiosResponse> {
        if (agent.id) {
            return API.put(`/agent/${agent.id}`, agent)
        } else {
            return API.post('/agent', agent)
        }
    }

    static async removeAgent(agentId: number): Promise<AxiosResponse> {
        return API.delete(`/agent/${agentId}`)
    }

    static async fetchContactById(contactId: number): Promise<AxiosResponse> {
        return API.get(`/contact/${contactId}`)
    }

    static async fetchContacts(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/contact', {params: filter})
    }

    static async saveContact(contact: IContact): Promise<AxiosResponse> {
        if (contact.id) {
            return API.put(`/contact/${contact.id}`, contact)
        } else {
            return API.post('/contact', contact)
        }
    }

    static async removeContact(contactId: number): Promise<AxiosResponse> {
        return API.delete(`/contact/${contactId}`)
    }
}