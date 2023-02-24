import React from 'react'
import {IArticle} from '../../../../../@types/IArticle'
import {IBuilding} from '../../../../../@types/IBuilding'
import {ILog} from '../../../../../@types/ILog'
import Empty from '../../../../../components/ui/Empty/Empty'
import InfoItem from '../InfoItem/InfoItem'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import classes from './InfoList.module.scss'

interface Props {
    articles?: IArticle[]
    buildings?: IBuilding[]
    logs?: ILog[]
    type: 'article' | 'building' | 'log'
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    type: 'article',
    fetching: false,
    onSave: () => {
        console.info('InfoList onSave')
    }
}

const InfoList: React.FC<Props> = (props) => {
    const renderArticleList = () => {
        if (!props.articles) {
            return null
        }

        if (props.articles.length) {
            return props.articles.map((item: IArticle) => {
                return (
                    <InfoItem key={item.id} type='article' article={item} onSave={props.onSave.bind(this)}/>
                )
            })
        } else {
            return <Empty message='Нет статей'/>
        }
    }

    const renderBuildingList = () => {
        if (!props.buildings) {
            return null
        }

        if (props.buildings.length) {
            return props.buildings.map((item: IBuilding) => {
                return (
                    <InfoItem key={item.id} type='building' building={item} onSave={props.onSave.bind(this)}/>
                )
            })
        } else {
            return <Empty message='Нет объектов недвижимости'/>
        }
    }

    const renderLogList = () => {
        if (!props.logs) {
            return null
        }

        if (props.logs.length) {
            return props.logs.map((item: ILog) => {
                return (
                    <InfoItem key={item.id} type='log' log={item} onSave={props.onSave.bind(this)}/>
                )
            })
        } else {
            return <Empty message='Нет логов'/>
        }
    }

    return (
        <div className={classes.InfoList}>
            <div className={classes.head}>
                <div className={classes.name}>{props.type === 'log' ? 'Событие' : 'Название'}</div>
                <div className={classes.date}>Дата создания</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.container}>
                {props.type === 'article' ? renderArticleList()
                    : props.type === 'building' ? renderBuildingList()
                        : renderLogList()}
            </BlockingElement>
        </div>
    )
}

InfoList.defaultProps = defaultProps
InfoList.displayName = 'InfoList'

export default InfoList