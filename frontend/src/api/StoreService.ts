import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {ICategory, IProduct} from '../@types/IStore'
import {IFilter} from '../@types/IFilter'

export default class StoreService {
    static async fetchCategoryById(categoryId: number): Promise<AxiosResponse> {
        return API.get(`/store/category/${categoryId}`)
    }

    static async fetchCategories(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/store/category', {params: filter})
    }

    static async saveCategory(category: ICategory): Promise<AxiosResponse> {
        if (category.id) {
            return API.put(`/store/category/${category.id}`, category)
        } else {
            return API.post('/store/category', category)
        }
    }

    static async removeCategory(categoryId: number): Promise<AxiosResponse> {
        return API.delete(`/store/category/${categoryId}`)
    }

    static async fetchProductById(productId: number): Promise<AxiosResponse> {
        return API.get(`/store/product/${productId}`)
    }

    static async fetchProducts(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/store/product', {params: filter})
    }

    static async saveProduct(product: IProduct): Promise<AxiosResponse> {
        if (product.id) {
            return API.put(`/store/product/${product.id}`, product)
        } else {
            return API.post('/store/product', product)
        }
    }

    static async removeProduct(productId: number): Promise<AxiosResponse> {
        return API.delete(`/store/product/${productId}`)
    }
}