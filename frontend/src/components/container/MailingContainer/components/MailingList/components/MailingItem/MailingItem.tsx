import React from 'react'
import classNames from 'classnames/bind'
import {IMailing} from '../../../../../../../@types/IMailing'
import {getMailingStatusText, getMailingTypeText} from '../../../../../../../helpers/mailingHelper'
import classes from './MailingItem.module.scss'

interface Props {
    mailing: IMailing

    onClick(mailing: IMailing): void

    onEdit(mailing: IMailing): void

    onRemove(mailing: IMailing): void

    onContextMenu(e: React.MouseEvent, mailing: IMailing): void
}

const defaultProps: Props = {
    mailing: {} as IMailing,
    onClick: (mailing: IMailing) => {
        console.info('MailingItem onClick', mailing)
    },
    onEdit: (mailing: IMailing) => {
        console.info('MailingItem onEdit', mailing)
    },
    onRemove: (mailing: IMailing) => {
        console.info('MailingItem onRemove', mailing)
    },
    onContextMenu: (e: React.MouseEvent, mailing: IMailing) => {
        console.info('MailingItem onContextMenu', e, mailing)
    }
}

const cx = classNames.bind(classes)

const MailingItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'MailingItem': true, 'disabled': !props.mailing.active})}
             onClick={() => props.onClick(props.mailing)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.mailing)}
        >
            <div className={classes.name}>{props.mailing.name}</div>
            <div className={classes.type}>{getMailingTypeText(props.mailing.type)}</div>
            <div className={classes.status}>{getMailingStatusText(props.mailing.status)}</div>
            <div className={classes.count}>{props.mailing.countRecipients}</div>
        </div>
    )
}

MailingItem.defaultProps = defaultProps
MailingItem.displayName = 'MailingItem'

export default MailingItem