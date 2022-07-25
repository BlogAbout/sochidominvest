import React from 'react'
import classNames from 'classnames/bind'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {IMessage} from '../../../../../@types/IMessenger'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './MessageItem.module.scss'

interface Props {
    message: IMessage
    userId: number
    usersName: string
}

const defaultProps: Props = {
    message: {} as IMessage,
    userId: 0,
    usersName: ''
}

const cx = classNames.bind(classes)

const MessageItem: React.FC<Props> = (props) => {
    const avatarUrl = '' // Todo

    return (
        <div className={cx({'MessageItem': true, 'right': props.message.author === props.userId})}>
            <Avatar href={avatarUrl}
                    alt={props.usersName}
                    width={35}
                    height={35}
                    isRound
            />

            <div className={classes.text}>
                {props.message.text}

                <div className={classes.date}>{getFormatDate(props.message.dateCreated)}</div>
            </div>
        </div>
    )
}

MessageItem.defaultProps = defaultProps
MessageItem.displayName = 'MessageItem'

export default MessageItem