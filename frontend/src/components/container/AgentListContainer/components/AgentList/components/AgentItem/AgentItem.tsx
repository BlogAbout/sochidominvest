import React from 'react'
import classNames from 'classnames/bind'
import {IAgent} from '../../../../../../../@types/IAgent'
import {getAgentTypeText} from '../../../../../../../helpers/agentHelper'
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
             onClick={(e: React.MouseEvent) => props.onClick(props.agent)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.agent)}
        >
            <div className={classes.name}>{props.agent.name}</div>
            <div className={classes.type}>{getAgentTypeText(props.agent.type)}</div>
            <div className={classes.phone}>{props.agent.phone}</div>
        </div>
    )
}

AgentItem.defaultProps = defaultProps
AgentItem.displayName = 'AgentItem'

export default AgentItem