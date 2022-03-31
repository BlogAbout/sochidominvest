import {ArticleAction, ArticleActionTypes} from '../../@types/articleTypes'
import {IArticle} from '../../@types/IArticle'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import ArticleService from '../../api/ArticleService'

export const ArticleActionCreators = {
    setArticles: (articles: IArticle[]): ArticleAction => ({
        type: ArticleActionTypes.ARTICLE_FETCH_LIST,
        payload: articles
    }),
    setFetching: (payload: boolean): ArticleAction => ({
        type: ArticleActionTypes.ARTICLE_IS_FETCHING,
        payload
    }),
    setError: (payload: string): ArticleAction => ({
        type: ArticleActionTypes.ARTICLE_ERROR,
        payload
    }),
    fetchArticleList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(ArticleActionCreators.setFetching(true))

        try {
            const response = await ArticleService.fetchArticles(filter)

            if (response.status === 200) {
                dispatch(ArticleActionCreators.setArticles(response.data))
            } else {
                dispatch(ArticleActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(ArticleActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}