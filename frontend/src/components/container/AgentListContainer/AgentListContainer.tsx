import React from 'react'
import {IAgent} from '../../../@types/IAgent'
import Empty from '../../ui/Empty/Empty'
import AgentList from './components/AgentList/AgentList'
import AgentTill from './components/AgentTill/AgentTill'
import classes from './AgentListContainer.module.scss'

interface Props {
    agents: IAgent[]
    fetching: boolean
    layout: 'list' | 'till'

    onClick(agent: IAgent): void

    onEdit(agent: IAgent): void

    onRemove(agent: IAgent): void

    onContextMenu(e: React.MouseEvent, agent: IAgent): void
}

const defaultProps: Props = {
    agents: [],
    fetching: false,
    layout: 'list',
    onClick: (agent: IAgent) => {
        console.info('AgentListContainer onClick', agent)
    },
    onEdit: (agent: IAgent) => {
        console.info('AgentListContainer onEdit', agent)
    },
    onRemove: (agent: IAgent) => {
        console.info('AgentListContainer onRemove', agent)
    },
    onContextMenu: (e: React.MouseEvent, agent: IAgent) => {
        console.info('AgentListContainer onContextMenu', e, agent)
    }
}

const AgentListContainer: React.FC<Props> = (props) => {
    const renderList = () => {
        switch (props.layout) {
            case 'list':
                return (
                    <AgentList agents={props.agents}
                               fetching={props.fetching}
                               onClick={props.onClick}
                               onEdit={props.onEdit}
                               onRemove={props.onRemove}
                               onContextMenu={props.onContextMenu}
                    />
                )
            case 'till':
                return (
                    <AgentTill agents={props.agents}
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
        <div className={classes.AgentListContainer}>
            {props.agents.length ? renderList() : <Empty message='Нет агентств'/>}
        </div>
    )
}

AgentListContainer.defaultProps = defaultProps
AgentListContainer.displayName = 'AgentListContainer'

export default AgentListContainer