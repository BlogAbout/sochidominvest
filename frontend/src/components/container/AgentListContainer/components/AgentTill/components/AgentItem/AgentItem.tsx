import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IAgent} from '../../../../../../../@types/IAgent'
import {getAgentTypeText} from '../../../../../../../helpers/agentHelper'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import Avatar from '../../../../../../ui/Avatar/Avatar'
import classes from './AgentItem.module.scss'

interface Props {
    agent: IAgent

    onClick(agent: IAgent): void

    onEdit(agent: IAgent): void

    onRemove(agent: IAgent): void

    onContextMenu(e: React.MouseEvent, agent: IAgent): void
}

const defaultProps: Props = {
    agent: {} as IAgent,
    onClick: (agent: IAgent) => {
        console.info('AgentItem onClick', agent)
    },
    onEdit: (agent: IAgent) => {
        console.info('AgentItem onEdit', agent)
    },
    onRemove: (agent: IAgent) => {
        console.info('AgentItem onRemove', agent)
    },
    onContextMenu: (e: React.MouseEvent, agent: IAgent) => {
        console.info('AgentItem onContextMenu', e, agent)
    }
}

const cx = classNames.bind(classes)

const AgentItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'AgentItem': true, 'disabled': !props.agent.active})}
             onClick={() => props.onClick(props.agent)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.agent)}
        >
            <Avatar href={props.agent.avatar} alt={props.agent.name} width={150} height={150}/>

            <div className={classes.itemContent}>
                <h2>{props.agent.name}</h2>

                <div className={classes.row} title='Дата публикации'>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{getFormatDate(props.agent.dateCreated)}</span>
                </div>

                <div className={classes.row} title='Тип'>
                    <FontAwesomeIcon icon='star'/>
                    <span>{getAgentTypeText(props.agent.type)}</span>
                </div>

                <div className={classes.row} title='Телефон'>
                    <FontAwesomeIcon icon='phone'/>
                    <span>{props.agent.phone}</span>
                </div>

                <div className={classes.row} title='Количество объектов недвижимости'>
                    <FontAwesomeIcon icon='building'/>
                    <span>{props.agent.buildings ? props.agent.buildings.length : 0}</span>
                </div>
            </div>
        </div>
    )
}

AgentItem.defaultProps = defaultProps
AgentItem.displayName = 'AgentItem'

export default AgentItem