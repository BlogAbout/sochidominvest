import React from 'react'
import {IPartner} from '../../../@types/IPartner'
import Empty from '../../ui/Empty/Empty'
import PartnerList from './components/PartnerList/PartnerList'
import PartnerTill from './components/PartnerTill/PartnerTill'
import classes from './PartnerListContainer.module.scss'

interface Props {
    partners: IPartner[]
    fetching: boolean
    layout: 'list' | 'till'

    onClick(partner: IPartner): void

    onEdit(partner: IPartner): void

    onRemove(partner: IPartner): void

    onContextMenu(e: React.MouseEvent, partner: IPartner): void
}

const defaultProps: Props = {
    partners: [],
    fetching: false,
    layout: 'list',
    onClick: (partner: IPartner) => {
        console.info('PartnerListContainer onClick', partner)
    },
    onEdit: (partner: IPartner) => {
        console.info('PartnerListContainer onEdit', partner)
    },
    onRemove: (partner: IPartner) => {
        console.info('PartnerListContainer onRemove', partner)
    },
    onContextMenu: (e: React.MouseEvent, partner: IPartner) => {
        console.info('PartnerListContainer onContextMenu', e, partner)
    }
}

const PartnerListContainer: React.FC<Props> = (props) => {
    const renderList = () => {
        switch (props.layout) {
            case 'list':
                return (
                    <PartnerList partners={props.partners}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
                    />
                )
            case 'till':
                return (
                    <PartnerTill partners={props.partners}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
                    />
                )
        }
    }

    return (
        <div className={classes.PartnerListContainer}>
            {props.partners.length ? renderList() : <Empty message='Нет партнеров и спонсоров'/>}
        </div>
    )
}

PartnerListContainer.defaultProps = defaultProps
PartnerListContainer.displayName = 'PartnerListContainer'

export default PartnerListContainer