import React from 'react'
import {IBusinessProcess} from '../../../../../../../@types/IBusinessProcess'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import classes from './BusinessProcessItem.module.scss'

interface Props {
    businessProcess: IBusinessProcess
    fetching: boolean

    onClick(businessProcess: IBusinessProcess): void

    onEdit(businessProcess: IBusinessProcess): void

    onRemove(businessProcess: IBusinessProcess): void

    onContextMenu(e: React.MouseEvent, businessProcess: IBusinessProcess): void
}

const defaultProps: Props = {
    businessProcess: {} as IBusinessProcess,
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
            <div className={classes.name}>{props.businessProcess.id}</div>
            <div className={classes.dateCreated}>{getFormatDate(props.businessProcess.dateCreated)}</div>
            <div className={classes.dateUpdate}>{getFormatDate(props.businessProcess.dateUpdate)}</div>
        </div>
    )
}

BusinessProcessItem.defaultProps = defaultProps
BusinessProcessItem.displayName = 'BusinessProcessItem'

export default BusinessProcessItem