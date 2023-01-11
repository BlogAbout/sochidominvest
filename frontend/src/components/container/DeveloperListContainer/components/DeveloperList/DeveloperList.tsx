import React from 'react'
import DeveloperItem from './components/DeveloperItem/DeveloperItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import classes from './DeveloperList.module.scss'

interface Props {
    developers: IDeveloper[]
    fetching: boolean

    onClick(developer: IDeveloper): void

    onEdit(developer: IDeveloper): void

    onRemove(developer: IDeveloper): void

    onContextMenu(e: React.MouseEvent, developer: IDeveloper): void
}

const defaultProps: Props = {
    developers: [],
    fetching: false,
    onClick: (developer: IDeveloper) => {
        console.info('BuildingList onClick', developer)
    },
    onEdit: (developer: IDeveloper) => {
        console.info('BuildingList onEdit', developer)
    },
    onRemove: (developer: IDeveloper) => {
        console.info('BuildingList onRemove', developer)
    },
    onContextMenu: (e: React.MouseEvent, developer: IDeveloper) => {
        console.info('BuildingList onContextMenu', e, developer)
    }
}

const DeveloperList: React.FC<Props> = (props) => {
    return (
        <div className={classes.DeveloperList}>
            <div className={classes.head}>
                <div className={classes.name}>Имя</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.developers.map((developer: IDeveloper) => {
                    return (
                        <DeveloperItem key={developer.id}
                                       developer={developer}
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

DeveloperList.defaultProps = defaultProps
DeveloperList.displayName = 'DeveloperList'

export default DeveloperList