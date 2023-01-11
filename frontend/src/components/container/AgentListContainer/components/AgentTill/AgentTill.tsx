import React from 'react'
import AgentItem from './components/AgentItem/AgentItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IAgent} from '../../../../../@types/IAgent'
import classes from './AgentTill.module.scss'

interface Props {
    agents: IAgent[]
    fetching: boolean

    onClick(agent: IAgent): void

    onEdit(agent: IAgent): void

    onRemove(agent: IAgent): void

    onContextMenu(e: React.MouseEvent, agent: IAgent): void
}

const defaultProps: Props = {
    agents: [],
    fetching: false,
    onClick: (agent: IAgent) => {
        console.info('BuildingTill onClick', agent)
    },
    onEdit: (agent: IAgent) => {
        console.info('BuildingTill onEdit', agent)
    },
    onRemove: (agent: IAgent) => {
        console.info('BuildingTill onRemove', agent)
    },
    onContextMenu: (e: React.MouseEvent, agent: IAgent) => {
        console.info('BuildingTill onContextMenu', e, agent)
    }
}

const AgentTill: React.FC<Props> = (props) => {
    return (
        <div className={classes.AgentTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.agents.map((agent: IAgent) => {
                    return (
                        <AgentItem key={agent.id}
                                   agent={agent}
                                   onClick={props.onClick}
                                   onEdit={props.onEdit}
                                   onRemove={props.onRemove}
                                   onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

AgentTill.defaultProps = defaultProps
AgentTill.displayName = 'AgentTill'

export default AgentTill