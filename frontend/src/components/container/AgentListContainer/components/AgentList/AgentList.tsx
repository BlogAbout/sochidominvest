import React from 'react'
import AgentItem from './components/AgentItem/AgentItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IAgent} from '../../../../../@types/IAgent'
import classes from './AgentList.module.scss'

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
        console.info('BuildingList onClick', agent)
    },
    onEdit: (agent: IAgent) => {
        console.info('BuildingList onEdit', agent)
    },
    onRemove: (agent: IAgent) => {
        console.info('BuildingList onRemove', agent)
    },
    onContextMenu: (e: React.MouseEvent, agent: IAgent) => {
        console.info('BuildingList onContextMenu', e, agent)
    }
}

const AgentList: React.FC<Props> = (props) => {
    return (
        <div className={classes.AgentList}>
            <div className={classes.head}>
                <div className={classes.name}>Имя</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.phone}>Телефон</div>
            </div>

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

AgentList.defaultProps = defaultProps
AgentList.displayName = 'AgentList'

export default AgentList