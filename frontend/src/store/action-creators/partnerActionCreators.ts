import {PartnerAction, PartnerActionTypes} from '../../@types/partnerTypes'
import {IPartner} from '../../@types/IPartner'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import PartnerService from '../../api/PartnerService'

export const PartnerActionCreators = {
    setPartners: (partners: IPartner[]): PartnerAction => ({
        type: PartnerActionTypes.PARTNER_FETCH_LIST,
        payload: partners
    }),
    setFetching: (payload: boolean): PartnerAction => ({
        type: PartnerActionTypes.PARTNER_IS_FETCHING,
        payload
    }),
    setError: (payload: string): PartnerAction => ({
        type: PartnerActionTypes.PARTNER_ERROR,
        payload
    }),
    fetchPartnerList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(PartnerActionCreators.setFetching(true))

        try {
            const response = await PartnerService.fetchPartners(filter)

            if (response.status === 200) {
                dispatch(PartnerActionCreators.setPartners(response.data))
            } else {
                dispatch(PartnerActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(PartnerActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}