import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../hooks/useTypedSelector'
import {IPartner} from '../../../../@types/IPartner'
import {getPartnerTypeText} from '../../../../helpers/partnerHelper'
import PartnerService from '../../../../api/PartnerService'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupPartnerCreate from '../../../PopupPartnerCreate/PopupPartnerCreate'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import Preloader from '../../../Preloader/Preloader'
import classes from './PartnerItem.module.scss'

interface Props {
    partner: IPartner

    onSave(): void
}

const defaultProps: Props = {
    partner: {} as IPartner,
    onSave: () => {
        console.info('PartnerItem onSave')
    }
}

const PartnerItem: React.FC<Props> = (props) => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    // Редактирование
    const updateHandler = (partner: IPartner) => {
        openPopupPartnerCreate(document.body, {
            partner: partner,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление
    const removeHandler = (partner: IPartner) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${partner.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (partner.id) {
                            setFetching(true)

                            PartnerService.removePartner(partner.id)
                                .then(() => {
                                    props.onSave()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => {
                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => updateHandler(props.partner)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(props.partner)})
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <div className={classes.PartnerItem}
             onClick={() => navigate('/panel/partner/' + props.partner.id)}
             onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
        >
            {fetching && <Preloader/>}

            <div className={classes.name}>{props.partner.name}</div>
            <div className={classes.author}>{props.partner.authorName || ''}</div>
            <div className={classes.type}>{getPartnerTypeText(props.partner.type)}</div>
        </div>
    )
}

PartnerItem.defaultProps = defaultProps
PartnerItem.displayName = 'PartnerItem'

export default PartnerItem