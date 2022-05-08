import React from 'react'
import {IUser} from '../../../../@types/IUser'
import {IBuilding} from '../../../../@types/IBuilding'
import {IArticle} from '../../../../@types/IArticle'
import {IDocument} from '../../../../@types/IDocument'
import {IDeveloper} from '../../../../@types/IDeveloper'
import {IAttachment} from '../../../../@types/IAttachment'
import BlockingElement from '../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../Empty/Empty'
import SearchItem from '../SearchItem/SearchItem'
import classes from './SearchList.module.scss'

interface Props {
    items: IUser[] | IBuilding[] | IArticle[] | IDocument[] | IDeveloper[] | IAttachment[]
    type: 'user' | 'building' | 'article' | 'document' | 'developer' | 'attachment'
    fetching: boolean

    onClick(): void
}

const defaultProps: Props = {
    items: [],
    type: 'building',
    fetching: false,
    onClick: () => {
        console.info('SearchItem onClick')
    }
}

const SearchList: React.FC<Props> = (props) => {
    if (props.items && props.items.length) {
        return (
            <div className={classes.SearchList}>
                <div className={classes.head}>
                    <div className={classes.name}>Название</div>
                    <div className={classes.date}>Дата создания</div>
                </div>

                <BlockingElement fetching={props.fetching} className={classes.content}>
                    {props.items.map((item: IUser | IBuilding | IArticle | IDocument | IDeveloper | IAttachment) => {
                        return (
                            <SearchItem key={item.id} item={item} type={props.type} onClick={props.onClick.bind(this)}/>
                        )
                    })}
                </BlockingElement>
            </div>
        )
    } else {
        return <Empty message='Ничего не найдено'/>
    }
}

SearchList.defaultProps = defaultProps
SearchList.displayName = 'SearchList'

export default SearchList