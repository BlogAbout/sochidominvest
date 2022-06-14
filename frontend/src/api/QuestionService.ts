import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IQuestion} from '../@types/IQuestion'
import {IFilter} from '../@types/IFilter'

export default class QuestionService {
    static async fetchQuestionById(questionId: number): Promise<AxiosResponse> {
        return API.get(`/question/${questionId}`)
    }

    static async fetchQuestions(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/question', {params: filter})
    }

    static async saveQuestion(question: IQuestion): Promise<AxiosResponse> {
        if (question.id) {
            return API.put(`/question/${question.id}`, question)
        } else {
            return API.post('/question', question)
        }
    }

    static async removeQuestion(questionId: number): Promise<AxiosResponse> {
        return API.delete(`/question/${questionId}`)
    }
}