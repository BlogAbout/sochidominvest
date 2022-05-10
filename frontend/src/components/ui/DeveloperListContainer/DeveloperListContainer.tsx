import React from 'react'
import {IDeveloper} from '../../../@types/IDeveloper'
import Empty from '../../Empty/Empty'
import DeveloperList from './components/DeveloperList/DeveloperList'
import DeveloperTill from './components/DeveloperTill/DeveloperTill'
import classes from './DeveloperListContainer.module.scss'

interface Props {
    developers: IDeveloper[]
    fetching: boolean
    layout: 'list' | 'till'

    onClick(developer: IDeveloper): void

    onEdit(developer: IDeveloper): void

    onRemove(developer: IDeveloper): void

    onContextMenu(e: React.MouseEvent, developer: IDeveloper): void
}

const defaultProps: Props = {
    developers: [],
    fetching: false,
    layout: 'list',
    onClick: (developer: IDeveloper) => {
        console.info('DeveloperListContainer onClick', developer)
    },
    onEdit: (developer: IDeveloper) => {
        console.info('DeveloperListContainer onEdit', developer)
    },
    onRemove: (developer: IDeveloper) => {
        console.info('DeveloperListContainer onRemove', developer)
    },
    onContextMenu: (e: React.MouseEvent, developer: IDeveloper) => {
        console.info('DeveloperListContainer onContextMenu', e, developer)
    }
}

const DeveloperListContainer: React.FC<Props> = (props) => {
    const renderList = () => {
        switch (props.layout) {
            case 'list':
                return (
                    <DeveloperList developers={props.developers}
                                 fetching={props.fetching}
                                 onClick={props.onClick}
                                 onEdit={props.onEdit}
                                 onRemove={props.onRemove}
                                 onContextMenu={props.onContextMenu}
                    />
                )
            case 'till':
                return (
                    <DeveloperTill developers={props.developers}
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
        <div className={classes.DeveloperListContainer}>
            {props.developers.length ? renderList() : <Empty message='Нет застройщиков'/>}
        </div>
    )
}

DeveloperListContainer.defaultProps = defaultProps
DeveloperListContainer.displayName = 'DeveloperListContainer'

export default DeveloperListContainer