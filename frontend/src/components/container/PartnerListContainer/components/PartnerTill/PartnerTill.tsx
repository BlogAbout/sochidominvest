import React from 'react'
import PartnerItem from './components/PartnerItem/PartnerItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IPartner} from '../../../../../@types/IPartner'
import classes from './PartnerTill.module.scss'

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

const PartnerTill: React.FC<Props> = (props) => {
    return (
        <div className={classes.PartnerList}>
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

PartnerTill.defaultProps = defaultProps
PartnerTill.displayName = 'PartnerTill'

export default PartnerTill