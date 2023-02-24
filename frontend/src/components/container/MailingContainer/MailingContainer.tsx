import React from 'react'
import {IMailing} from '../../../@types/IMailing'
import Empty from '../../ui/Empty/Empty'
import MailingList from './components/MailingList/MailingList'
import classes from './MailingContainer.module.scss'

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
        console.info('MailingContainer onClick', mailing)
    },
    onEdit: (mailing: IMailing) => {
        console.info('MailingContainer onEdit', mailing)
    },
    onRemove: (mailing: IMailing) => {
        console.info('MailingContainer onRemove', mailing)
    },
    onContextMenu: (e: React.MouseEvent, mailing: IMailing) => {
        console.info('MailingContainer onContextMenu', e, mailing)
    }
}

const MailingContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.MailingContainer}>
            {props.mailings.length ?
                <MailingList mailings={props.mailings}
                             fetching={props.fetching}
                             onClick={props.onClick}
                             onEdit={props.onEdit}
                             onRemove={props.onRemove}
                             onContextMenu={props.onContextMenu}
                />
                : <Empty message='Нет рассылок'/>
            }
        </div>
    )
}

MailingContainer.defaultProps = defaultProps
MailingContainer.displayName = 'MailingContainer'

export default MailingContainer