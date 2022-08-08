import React from 'react'
import {IBusinessProcess} from '../../../@types/IBusinessProcess'
import BusinessProcessList from './components/BusinessProcessList/BusinessProcessList'
import classes from './BusinessProcessContainer.module.scss'

interface Props {
    businessProcesses: IBusinessProcess[]
    fetching: boolean

    onClick(businessProcess: IBusinessProcess): void

    onEdit(businessProcess: IBusinessProcess): void

    onRemove(businessProcess: IBusinessProcess): void

    onContextMenu(e: React.MouseEvent, businessProcess: IBusinessProcess): void
}

const defaultProps: Props = {
    businessProcesses: [],
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
    }
}

const BusinessProcessContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.BusinessProcessContainer}>
            <BusinessProcessList businessProcesses={props.businessProcesses}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
            />
        </div>
    )
}

BusinessProcessContainer.defaultProps = defaultProps
BusinessProcessContainer.displayName = 'BusinessProcessContainer'

export default BusinessProcessContainer