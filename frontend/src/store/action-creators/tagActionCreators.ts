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
                dispatch(TagActionCreators.setTags(response.data.data))
            } else {
                dispatch(TagActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(TagActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.log('Непредвиденная ошибка загрузки данных', e)
        }
    },
    saveTag: (tag: ITag) => async (dispatch: AppDispatch) => {
        dispatch(TagActionCreators.setFetching(true))

        try {
            let response

            if (tag.id) {
                response = await TagService.updateTag(tag)
            } else {
                response = await TagService.createTag(tag)
            }

            if (response.status === 200 || response.status === 201) {
                dispatch(TagActionCreators.setError(''))
            } else {
                dispatch(TagActionCreators.setError('Ошибка сохранения данных'))
            }
        } catch (e) {
            dispatch(TagActionCreators.setError('Непредвиденная ошибка сохранения данных'))
            console.log('Непредвиденная ошибка сохранения данных', e)
        }
    },
    removeTag: (tagId: number) => async (dispatch: AppDispatch) => {
        dispatch(TagActionCreators.setFetching(true))

        try {
            const response = await TagService.removeTag(tagId)

            if (response.status === 200) {
                dispatch(TagActionCreators.setError(''))
            } else {
                dispatch(TagActionCreators.setError('Ошибка удаления данных.'))
            }
        } catch (e) {
            dispatch(TagActionCreators.setError('Непредвиденная ошибка удаления данных.'))
            console.log('Непредвиденная ошибка удаления данных.', e)
        }
    }
}