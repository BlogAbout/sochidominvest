import React from 'react'
import {useNavigate} from 'react-router-dom'
import {IUser} from '../../../../@types/IUser'
import {IBuilding} from '../../../../@types/IBuilding'
import {IArticle} from '../../../../@types/IArticle'
import {IDocument} from '../../../../@types/IDocument'
import {IDeveloper} from '../../../../@types/IDeveloper'
import {IAttachment} from '../../../../@types/IAttachment'
import classes from './SearchItem.module.scss'

interface Props {
    item: IUser | IBuilding | IArticle | IDocument | IDeveloper | IAttachment
    type: 'user' | 'building' | 'article' | 'document' | 'developer' | 'attachment'

    onClick(): void
}

const defaultProps: Props = {
    item: {} as IBuilding | IArticle | IDocument | IDeveloper | IAttachment,
    type: 'building',
    onClick: () => {
        console.info('SearchItem onClick')
    }
}

const SearchItem: React.FC<Props> = (props) => {
    const navigate = useNavigate()

    return (
        <div className={classes.SearchItem}
             onClick={() => {
                 if (props.type === 'attachment' && 'content' in props.item) {
                     window.open(`https://api.sochidominvest.ru/uploads/${props.item.content}`, '_blank')
                 } else {
                     navigate(`/panel/${props.type}/${props.item.id}`)
                 }
                 props.onClick()
             }}
        >
            <div className={classes.name}>
                {'name' in props.item ? props.item.name : 'firstName' in props.item ? props.item.firstName : ''}
            </div>
            <div className={classes.date}>{'dateCreated' in props.item ? props.item.dateCreated : ''}</div>
        </div>
    )
}

SearchItem.defaultProps = defaultProps
SearchItem.displayName = 'SearchItem'

export default SearchItem