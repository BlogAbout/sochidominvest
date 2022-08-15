import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IBusinessProcess} from '../../../../../../../@types/IBusinessProcess'
import {IUser} from '../../../../../../../@types/IUser'
import {getBpTypesText} from '../../../../../../../helpers/businessProcessHelper'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import {getUserName} from '../../../../../../../helpers/userHelper'
import classes from './BusinessProcessItem.module.scss'

interface Props {
    businessProcess: IBusinessProcess
    users: IUser[]
    fetching: boolean

    onClick(businessProcess: IBusinessProcess): void

    onEdit(businessProcess: IBusinessProcess): void

    onRemove(businessProcess: IBusinessProcess): void

    onContextMenu(e: React.MouseEvent, businessProcess: IBusinessProcess): void
}

const defaultProps: Props = {
    businessProcess: {} as IBusinessProcess,
    users: [],
    fetching: false,
    onClick: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessItem onClick', businessProcess)
    },
    onEdit: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessItem onEdit', businessProcess)
    },
    onRemove: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessItem onRemove', businessProcess)
    },
    onContextMenu: (e: React.MouseEvent, businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessItem onContextMenu', e, businessProcess)
    }
}

const BusinessProcessItem: React.FC<Props> = (props) => {
    return (
        <div className={classes.BusinessProcessItem}
             onClick={() => props.onClick(props.businessProcess)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.businessProcess)}
        >
            <div className={classes.meta}>
                <div className={classes.id}>#{props.businessProcess.id}</div>
                <div className={classes.dateCreated}>{getFormatDate(props.businessProcess.dateCreated)}</div>
            </div>
            <div className={classes.name}>{props.businessProcess.name}</div>
            <div className={classes.info} title='Тип'>
                <FontAwesomeIcon icon='star'/>
                <span>{getBpTypesText(props.businessProcess.type)}</span>
            </div>
            <div className={classes.info} title='Ответственный'>
                <FontAwesomeIcon icon='user'/>
                <span>{getUserName(props.users, props.businessProcess.responsible)}</span>
            </div>
        </div>
    )
}

BusinessProcessItem.defaultProps = defaultProps
BusinessProcessItem.displayName = 'BusinessProcessItem'

export default BusinessProcessItem