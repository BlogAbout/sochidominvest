import React from 'react'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import {getDeveloperTypeText} from '../../../../../helpers/developerHelper'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import classes from './DeveloperList.module.scss'

interface Props {
    list: IDeveloper[]
    fetching: boolean
    emptyText?: string
    isCompact?: boolean

    onClick(developer: IDeveloper): void

    onContextMenu(developer: IDeveloper, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (developer: IDeveloper) => {
        console.info('DeveloperList onClick', developer)
    },
    onContextMenu: (developer: IDeveloper, e: React.MouseEvent) => {
        console.info('DeveloperList onClick', developer, e)
    }
}

const DeveloperList: React.FC<Props> = (props): React.ReactElement => {
    return (
        <List className={classes.DeveloperList}>
            <ListHead>
                <ListCell className={classes.name}>Имя</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
                <ListCell className={classes.phone}>Телефон</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching}>
                {props.list && props.list.length ?
                    props.list.map((developer: IDeveloper) => {
                        return (
                            <ListRow key={developer.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(developer, e)}
                                     onClick={() => props.onClick(developer)}
                                     isDisabled={!developer.active}
                                     isCompact={props.isCompact}
                            >
                                <ListCell className={classes.name}>{developer.name}</ListCell>
                                <ListCell className={classes.type}>{getDeveloperTypeText(developer.type)}</ListCell>
                                <ListCell className={classes.phone}>{developer.phone}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message={props.emptyText || 'Нет застройщиков'}/>
                }
            </ListBody>
        </List>
    )
}

DeveloperList.defaultProps = defaultProps
DeveloperList.displayName = 'DeveloperList'

export default React.memo(DeveloperList)