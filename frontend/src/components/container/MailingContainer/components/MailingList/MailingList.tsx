import React from 'react'
import MailingItem from './components/MailingItem/MailingItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IMailing} from '../../../../../@types/IMailing'
import classes from './MailingList.module.scss'

interface Props {
    mailings: IMailing[]
    fetching: boolean

    onClick(mailing: IMailing): void

    onEdit(mailing: IMailing): void

    onRemove(mailing: IMailing): void

    onContextMenu(e: React.MouseEvent, mailing: IMailing): void
}

const defaultProps: Props = {
    mailings: [],
    fetching: false,
    onClick: (mailing: IMailing) => {
        console.info('MailingList onClick', mailing)
    },
    onEdit: (mailing: IMailing) => {
        console.info('MailingList onEdit', mailing)
    },
    onRemove: (mailing: IMailing) => {
        console.info('MailingList onRemove', mailing)
    },
    onContextMenu: (e: React.MouseEvent, mailing: IMailing) => {
        console.info('MailingList onContextMenu', e, mailing)
    }
}

const MailingList: React.FC<Props> = (props) => {
    return (
        <div className={classes.MailingList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.status}>Состояние</div>
                <div className={classes.count}>Получатели</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.mailings.map((mailing: IMailing) => {
                    return (
                        <MailingItem key={mailing.id}
                                     mailing={mailing}
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

MailingList.defaultProps = defaultProps
MailingList.displayName = 'MailingList'

export default MailingList