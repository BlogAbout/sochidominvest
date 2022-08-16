import React from 'react'
import {IBusinessProcess} from '../../../@types/IBusinessProcess'
import {IUser} from '../../../@types/IUser'
import BusinessProcessList from './components/BusinessProcessList/BusinessProcessList'
import classes from './BusinessProcessContainer.module.scss'

interface Props {
    businessProcesses: IBusinessProcess[]
    users: IUser[]
    fetching: boolean

    onClick(businessProcess: IBusinessProcess): void

    onEdit(businessProcess: IBusinessProcess): void

    onRemove(businessProcess: IBusinessProcess): void

    onContextMenu(e: React.MouseEvent, businessProcess: IBusinessProcess): void

    onSaveOrder(businessProcess: IBusinessProcess, ids: number[]): void
}

const defaultProps: Props = {
    businessProcesses: [],
    users: [],
    fetching: false,
    onClick: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessContainer onClick', businessProcess)
    },
    onEdit: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessContainer onEdit', businessProcess)
    },
    onRemove: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessContainer onRemove', businessProcess)
    },
    onContextMenu: (e: React.MouseEvent, businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessContainer onContextMenu', e, businessProcess)
    },
    onSaveOrder: (businessProcess: IBusinessProcess, ids: number[]) => {
        console.info('BusinessProcessContainer onSaveOrder', businessProcess, ids)
    }
}

const BusinessProcessContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.BusinessProcessContainer}>
            <BusinessProcessList businessProcesses={props.businessProcesses}
                                 users={props.users}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
                                 onSaveOrder={props.onSaveOrder}
            />
        </div>
    )
}

BusinessProcessContainer.defaultProps = defaultProps
BusinessProcessContainer.displayName = 'BusinessProcessContainer'

export default BusinessProcessContainer