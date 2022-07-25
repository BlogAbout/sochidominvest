import React from 'react'
import classNames from 'classnames/bind'
import {getUserAvatar, getUserName} from '../../../../../helpers/userHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {isNewMessage} from '../../../../../helpers/messengerHelper'
import {IMessage, IMessenger} from '../../../../../@types/IMessenger'
import {IUser} from '../../../../../@types/IUser'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './MessageItem.module.scss'

interface Props {
    message: IMessage
    messenger: IMessenger | null
    userId: number
    memberId: number
    users: IUser[]
}

const defaultProps: Props = {
    message: {} as IMessage,
    messenger: null,
    userId: 0,
    memberId: 0,
    users: []
}

const cx = classNames.bind(classes)

const MessageItem: React.FC<Props> = (props) => {
    const avatarUrl = getUserAvatar(props.users, props.message.author)
    const isNewCurrent = isNewMessage(props.userId, props.messenger ? props.messenger.members : [], props.message)
    const isNewMember = isNewMessage(props.userId, props.messenger ? props.messenger.members : [], props.message)
    const right = props.message.author === props.userId

    return (
        <div className={cx({'MessageItem': true, 'right': right})}
             onContextMenu={() => {
                 // Todo: Доделать контекстное меню на сообщения (удалить, удалить у всех, цитировать, переслать, копировать)
             }}
        >
            <Avatar href={avatarUrl}
                    alt={getUserName(props.users, props.message.author)}
                    width={35}
                    height={35}
                    isRound
            />

            <div className={classes.text}>
                {props.message.text}

                <div className={classes.date}>{getFormatDate(props.message.dateCreated)}</div>

                {(right && isNewCurrent) || isNewMember ?
                    <div className={classes.indicator}/>
                    : null}
            </div>
        </div>
    )
}

MessageItem.defaultProps = defaultProps
MessageItem.displayName = 'MessageItem'

export default MessageItem