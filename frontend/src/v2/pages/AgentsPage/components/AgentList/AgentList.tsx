import React from 'react'
import {IAgent} from '../../../../../@types/IAgent'
import {getAgentTypeText} from '../../../../../helpers/agentHelper'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import classes from './AgentList.module.scss'

interface Props {
    list: IAgent[]
    fetching: boolean
    emptyText?: string
    isCompact?: boolean

    onClick(agent: IAgent): void

    onContextMenu(agent: IAgent, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (agent: IAgent) => {
        console.info('BuildingList onClick', agent)
    },
    onContextMenu: (agent: IAgent, e: React.MouseEvent) => {
        console.info('BuildingList onContextMenu', agent, e)
    }
}

const AgentList: React.FC<Props> = (props): React.ReactElement => {
    return (
        <List className={classes.AgentList}>
            <ListHead>
                <ListCell className={classes.name}>Имя</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
                <ListCell className={classes.phone}>Телефон</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching}>
                {props.list && props.list.length ?
                    props.list.map((agent: IAgent) => {
                        return (
                            <ListRow key={agent.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(agent, e)}
                                     onClick={() => props.onClick(agent)}
                                     isDisabled={!agent.active}
                                     isCompact={props.isCompact}
                            >
                                <ListCell className={classes.name}>{agent.name}</ListCell>
                                <ListCell className={classes.type}>{getAgentTypeText(agent.type)}</ListCell>
                                <ListCell className={classes.phone}>{agent.phone}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message={props.emptyText || 'Нет агентств'}/>
                }
            </ListBody>
        </List>
    )
}

AgentList.defaultProps = defaultProps
AgentList.displayName = 'AgentList'

export default React.memo(AgentList)