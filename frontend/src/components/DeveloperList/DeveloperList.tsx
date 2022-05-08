import React from 'react'
import Empty from '../Empty/Empty'
import DeveloperItem from './components/DeveloperItem/DeveloperItem'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import {IDeveloper} from '../../@types/IDeveloper'
import classes from './DeveloperList.module.scss'

interface Props {
    developers: IDeveloper[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    developers: [],
    fetching: false,
    onSave: () => {
        console.info('DeveloperList onSave')
    }
}

const DeveloperList: React.FC<Props> = (props) => {
    return (
        <div className={classes.DeveloperList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Имя</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            {props.developers.length ?
                (<BlockingElement fetching={props.fetching} className={classes.list}>
                    {props.developers.map((developer: IDeveloper) => {
                        return (
                            <DeveloperItem key={developer.id} developer={developer} onSave={props.onSave.bind(this)}/>
                        )
                    })}
                </BlockingElement>)
                : <Empty message='Нет застройщиков'/>
            }
        </div>
    )
}

DeveloperList.defaultProps = defaultProps
DeveloperList.displayName = 'DeveloperList'

export default DeveloperList