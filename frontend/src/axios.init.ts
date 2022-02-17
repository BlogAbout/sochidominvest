import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {RouteNames} from './routes/routes'

/**
 * <p>Обобщенная обработка запроса перед отправкой.</p>
 * @param config конфигурация Axios
 */
const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        }
    }

    return config
}

/**
 * <p>Обобщенная обработка ошибок запроса.</p>
 * @param error - Объект ошибки запроса в Axios.
 */
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    // console.error(`[request error] [${JSON.stringify(error)}]`)

    return Promise.reject(error)
}

/**
 * <p>Обобщенная обработка ответа.</p>
 * @param response - Объект ответа из Axios.
 */
const onResponse = (response: AxiosResponse): AxiosResponse => {
    // console.info(`[response] [${JSON.stringify(response)}]`)

    return response
}

/**
 * <p>Обобщенная обработка ошибок ответа.</p>
 * @param error - Объект ошибки ответа из Axios.
 */
const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    if (error.response && error.response.status === 401) {
        localStorage.clear()
        window.location.href = RouteNames.LOGIN
    } else {
        // console.error(`[response error] [${JSON.stringify(error)}]`)
    }

    return Promise.reject(error)
}

/**
 * <p>Внедряем хуки в interceptor.</p>
 * @param axiosInstance - Экспортируемый Axios.
 */
function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError)
    axiosInstance.interceptors.response.use(onResponse, onResponseError)

    return axiosInstance
}

/**
 * <p>Подключаем interceptor из функции на экспортируемый Axios.</p>
 */
const API = setupInterceptorsTo(axios.create({
    // baseURL: 'http://192.168.15.24:3001/api/v1'
    baseURL: 'http://127.0.0.1:3001/api/v1'
}))

export default API