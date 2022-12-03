import React from 'react'
import classNames from 'classnames/bind'
import {IDeveloper} from '../../../../../../../@types/IDeveloper'
import {getDeveloperTypeText} from '../../../../../../../helpers/developerHelper'
import openPopupDeveloperInfo from '../../../../../../PopupDeveloperInfo/PopupDeveloperInfo'
import classes from './DeveloperItem.module.scss'

interface Props {
    developer: IDeveloper

    onClick(developer: IDeveloper): void

    onEdit(developer: IDeveloper): void

    onRemove(developer: IDeveloper): void

    onContextMenu(e: React.MouseEvent, developer: IDeveloper): void
}

const defaultProps: Props = {
    developer: {} as IDeveloper,
    onClick: (developer: IDeveloper) => {
        console.info('AgentItem onClick', developer)
    },
    onEdit: (developer: IDeveloper) => {
        console.info('AgentItem onEdit', developer)
    },
    onRemove: (developer: IDeveloper) => {
        console.info('AgentItem onRemove', developer)
    },
    onContextMenu: (e: React.MouseEvent, developer: IDeveloper) => {
        console.info('AgentItem onContextMenu', e, developer)
    }
}

const cx = classNames.bind(classes)

const DeveloperItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'DeveloperItem': true, 'disabled': !props.developer.active})}
             onClick={(e: React.MouseEvent) => openPopupDeveloperInfo(e, {
                 developer: props.developer
             })}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.developer)}
        >
            <div className={classes.name}>{props.developer.name}</div>
            <div className={classes.type}>{getDeveloperTypeText(props.developer.type)}</div>
            <div className={classes.phone}>{props.developer.phone}</div>
        </div>
    )
}

DeveloperItem.defaultProps = defaultProps
DeveloperItem.displayName = 'DeveloperItem'

export default DeveloperItem