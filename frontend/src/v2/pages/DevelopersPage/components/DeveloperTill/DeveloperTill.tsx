import React from 'react'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import {getDeveloperTypeText} from '../../../../../helpers/developerHelper'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Card from '../../../../components/ui/Card/Card.'
import classes from './DeveloperTill.module.scss'

interface Props {
    list: IDeveloper[]
    fetching: boolean

    onClick(developer: IDeveloper): void

    onContextMenu(developer: IDeveloper, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (developer: IDeveloper) => {
        console.info('AgentList onClick', developer)
    },
    onContextMenu: (developer: IDeveloper, e: React.MouseEvent) => {
        console.info('AgentList onClick', developer, e)
    }
}

const DeveloperTill: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.DeveloperTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((developer: IDeveloper) => {
                        return (
                            <Card key={developer.id}
                                  title={developer.name}
                                  avatar={developer.avatar || ''}
                                  date={developer.dateCreated || undefined}
                                  type={getDeveloperTypeText(developer.type)}
                                  phone={developer.phone}
                                  countBuildings={developer.buildings ? developer.buildings.length : 0}
                                  isDisabled={!developer.active}
                                  onContextMenu={(e: React.MouseEvent) => props.onContextMenu(developer, e)}
                                  onClick={() => props.onClick(developer)}
                            />
                        )
                    })
                    : <Empty message='Нет застройщиков'/>
                }
            </BlockingElement>
        </div>
    )
}

DeveloperTill.defaultProps = defaultProps
DeveloperTill.displayName = 'DeveloperTill'

export default React.memo(DeveloperTill)