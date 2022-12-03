import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IDeveloper} from '../../../../../../../@types/IDeveloper'
import {getDeveloperTypeText} from '../../../../../../../helpers/developerHelper'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import Avatar from '../../../../../../ui/Avatar/Avatar'
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
             onClick={() => props.onClick(props.developer)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.developer)}
        >
            <Avatar href={props.developer.avatar} alt={props.developer.name} width={150} height={150}/>

            <div className={classes.itemContent}>
                <h2>{props.developer.name}</h2>

                <div className={classes.row} title='Дата публикации'>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{getFormatDate(props.developer.dateCreated)}</span>
                </div>

                <div className={classes.row} title='Тип'>
                    <FontAwesomeIcon icon='star'/>
                    <span>{getDeveloperTypeText(props.developer.type)}</span>
                </div>

                <div className={classes.row} title='Телефон'>
                    <FontAwesomeIcon icon='phone'/>
                    <span>{props.developer.phone}</span>
                </div>

                <div className={classes.row} title='Количество объектов недвижимости'>
                    <FontAwesomeIcon icon='building'/>
                    <span>{props.developer.buildings ? props.developer.buildings.length : 0}</span>
                </div>
            </div>
        </div>
    )
}

DeveloperItem.defaultProps = defaultProps
DeveloperItem.displayName = 'DeveloperItem'

export default DeveloperItem