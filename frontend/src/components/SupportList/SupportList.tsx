import React from 'react'
import {IFeed} from '../../@types/IFeed'
import Empty from '../Empty/Empty'
import SupportItem from './components/SupportItem/SupportItem'
import BlockingElement from '../BlockingElement/BlockingElement'
import classes from './SupportList.module.scss'

interface Props {
    feeds: IFeed[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    feeds: [],
    fetching: false,
    onSave: () => {
        console.info('SupportList onSave')
    }
}

const SupportList: React.FC<Props> = (props) => {
    return (
        <div className={classes.SupportList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.title}>Заголовок</div>
                <div className={classes.status}>Статус</div>
                <div className={classes.name}>Имя</div>
                <div className={classes.phone}>Телефон</div>
                <div className={classes.type}>Тип</div>
            </div>

            {props.feeds.length ?
                (<BlockingElement fetching={props.fetching} className={classes.list}>
                    {props.feeds.map((feed: IFeed) => {
                        return (
                            <SupportItem key={feed.id} feed={feed} onSave={props.onSave.bind(this)}/>
                        )
                    })}
                </BlockingElement>)
                : <Empty message='Нет заявок'/>
            }
        </div>
    )
}

SupportList.defaultProps = defaultProps
SupportList.displayName = 'SupportList'

export default SupportList