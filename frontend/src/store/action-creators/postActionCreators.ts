import {PostAction, PostActionTypes} from '../../@types/postTypes'
import {IPost} from '../../@types/IPost'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import PostService from '../../api/PostService'

export const PostActionCreators = {
    setPosts: (posts: IPost[]): PostAction => ({
        type: PostActionTypes.POST_FETCH_LIST,
        payload: posts
    }),
    setFetching: (payload: boolean): PostAction => ({
        type: PostActionTypes.POST_IS_FETCHING,
        payload
    }),
    setError: (payload: string): PostAction => ({
        type: PostActionTypes.POST_ERROR,
        payload
    }),
    fetchPostList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(PostActionCreators.setFetching(true))

        try {
            const response = await PostService.fetchPosts(filter)

            if (response.status === 200) {
                dispatch(PostActionCreators.setPosts(response.data))
            } else {
                dispatch(PostActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(PostActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}