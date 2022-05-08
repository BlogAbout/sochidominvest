import React from 'react'
import Empty from '../Empty/Empty'
import PartnerItem from './components/PartnerItem/PartnerItem'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import {IPartner} from '../../@types/IPartner'
import classes from './PartnerList.module.scss'

interface Props {
    partners: IPartner[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    partners: [],
    fetching: false,
    onSave: () => {
        console.info('PartnerList onSave')
    }
}

const PartnerList: React.FC<Props> = (props) => {
    return (
        <div className={classes.PartnerList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.author}>Автор</div>
                <div className={classes.type}>Тип</div>
            </div>

            {props.partners.length ?
                (<BlockingElement fetching={props.fetching} className={classes.list}>
                    {props.partners.map((partner: IPartner) => {
                        return (
                            <PartnerItem key={partner.id} partner={partner} onSave={props.onSave.bind(this)}/>
                        )
                    })}
                </BlockingElement>)
                : <Empty message='Нет партнеров'/>
            }
        </div>
    )
}

PartnerList.defaultProps = defaultProps
PartnerList.displayName = 'PartnerList'

export default PartnerList