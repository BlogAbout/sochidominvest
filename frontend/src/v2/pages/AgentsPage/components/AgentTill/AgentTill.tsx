import React from 'react'
import {IAgent} from '../../../../../@types/IAgent'
import {getAgentTypeText} from '../../../../../helpers/agentHelper'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Card from '../../../../components/ui/Card/Card.'
import classes from './AgentTill.module.scss'

interface Props {
    list: IAgent[]
    fetching: boolean

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
        console.info('BuildingList onClick', agent, e)
    }
}

const AgentTill: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.AgentTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((agent: IAgent) => {
                        return (
                            <Card key={agent.id}
                                  title={agent.name}
                                  avatar={agent.avatar || ''}
                                  date={agent.dateCreated || undefined}
                                  type={getAgentTypeText(agent.type)}
                                  phone={agent.phone}
                                  countBuildings={agent.buildings ? agent.buildings.length : 0}
                                  isDisabled={!agent.active}
                                  onContextMenu={(e: React.MouseEvent) => props.onContextMenu(agent, e)}
                                  onClick={() => props.onClick(agent)}
                            />
                        )
                    })
                    : <Empty message='Нет агентств'/>
                }
            </BlockingElement>
        </div>
    )
}

AgentTill.defaultProps = defaultProps
AgentTill.displayName = 'AgentTill'

export default React.memo(AgentTill)