import React from 'react'
import PartnerItem from './components/PartnerItem/PartnerItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IPartner} from '../../../../../@types/IPartner'
import classes from './PartnerList.module.scss'

interface Props {
    partners: IPartner[]
    fetching: boolean

    onClick(partner: IPartner): void

    onEdit(partner: IPartner): void

    onRemove(partner: IPartner): void

    onContextMenu(e: React.MouseEvent, partner: IPartner): void
}

const defaultProps: Props = {
    partners: [],
    fetching: false,
    onClick: (partner: IPartner) => {
        console.info('PartnerTill onClick', partner)
    },
    onEdit: (partner: IPartner) => {
        console.info('PartnerTill onEdit', partner)
    },
    onRemove: (partner: IPartner) => {
        console.info('PartnerTill onRemove', partner)
    },
    onContextMenu: (e: React.MouseEvent, partner: IPartner) => {
        console.info('PartnerTill onContextMenu', e, partner)
    }
}

const PartnerList: React.FC<Props> = (props) => {
    return (
        <div className={classes.PartnerList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.author}>Автор</div>
                <div className={classes.type}>Тип</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.partners.map((partner: IPartner) => {
                    return (
                        <PartnerItem key={partner.id}
                                     partner={partner}
                                     onClick={props.onClick}
                                     onEdit={props.onEdit}
                                     onRemove={props.onRemove}
                                     onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

PartnerList.defaultProps = defaultProps
PartnerList.displayName = 'PartnerList'

export default PartnerList