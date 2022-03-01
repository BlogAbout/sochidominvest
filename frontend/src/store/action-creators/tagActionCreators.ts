import {TagAction, TagActionTypes} from '../../@types/tagTypes'
import {ITag} from '../../@types/ITag'
import {AppDispatch} from '../reducers'
import TagService from '../../api/TagService'

export const TagActionCreators = {
    setTags: (tags: ITag[]): TagAction => ({
        type: TagActionTypes.TAG_FETCH_LIST,
        payload: tags
    }),
    setFetching: (payload: boolean): TagAction => ({
        type: TagActionTypes.TAG_IS_FETCHING,
        payload
    }),
    setError: (payload: string): TagAction => ({
        type: TagActionTypes.TAG_ERROR,
        payload
    }),
    fetchTagList: () => async (dispatch: AppDispatch) => {
        dispatch(TagActionCreators.setFetching(true))

        try {
            const response = await TagService.fetchTags()

            if (response.status === 200) {
                dispatch(TagActionCreators.setTags(response.data))
            } else {
                dispatch(TagActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(TagActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.log('Непредвиденная ошибка загрузки данных', e)
        }
    }
}