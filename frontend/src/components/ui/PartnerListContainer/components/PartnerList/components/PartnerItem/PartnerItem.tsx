import React from 'react'
import classNames from 'classnames/bind'
import {IPartner} from '../../../../../../../@types/IPartner'
import {getPartnerTypeText} from '../../../../../../../helpers/partnerHelper'
import classes from './PartnerItem.module.scss'

interface Props {
    partner: IPartner

    onClick(partner: IPartner): void

    onEdit(partner: IPartner): void

    onRemove(partner: IPartner): void

    onContextMenu(e: React.MouseEvent, partner: IPartner): void
}

const defaultProps: Props = {
    partner: {} as IPartner,
    onClick: (partner: IPartner) => {
        console.info('PartnerItem onClick', partner)
    },
    onEdit: (partner: IPartner) => {
        console.info('PartnerItem onEdit', partner)
    },
    onRemove: (partner: IPartner) => {
        console.info('PartnerItem onRemove', partner)
    },
    onContextMenu: (e: React.MouseEvent, partner: IPartner) => {
        console.info('PartnerItem onContextMenu', e, partner)
    }
}

const cx = classNames.bind(classes)

const PartnerItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'PartnerItem': true, 'disabled': !props.partner.active})}
             onClick={() => props.onClick(props.partner)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.partner)}
        >
            <div className={classes.name}>{props.partner.name}</div>
            <div className={classes.author}>{props.partner.authorName || ''}</div>
            <div className={classes.type}>{getPartnerTypeText(props.partner.type)}</div>
        </div>
    )
}

PartnerItem.defaultProps = defaultProps
PartnerItem.displayName = 'PartnerItem'

export default PartnerItem