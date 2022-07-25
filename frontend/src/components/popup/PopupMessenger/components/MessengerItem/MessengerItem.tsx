import React from 'react'
import classNames from 'classnames/bind'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {getUserName} from '../../../../../helpers/userHelper'
import {findMembersIds} from '../../../../../helpers/messengerHelper'
import {IMessenger} from '../../../../../@types/IMessenger'
import {IUser} from '../../../../../@types/IUser'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './MessengerItem.module.scss'

interface Props {
    messenger: IMessenger
    users: IUser[]
    userId: number

    onClick(): void
}

const defaultProps: Props = {
    messenger: {} as IMessenger,
    users: [],
    userId: 0,
    onClick: () => {
        console.info('MessengerItem onClick')
    }
}

const cx = classNames.bind(classes)

const MessengerItem: React.FC<Props> = (props) => {
    const avatarUrl = '' // Todo
    const memberId: number = findMembersIds(props.messenger.members).find((id: number) => id !== props.userId) || 0
    const memberName = getUserName(props.users, props.userId === props.messenger.author ? memberId : props.messenger.author)

    return (
        <div className={cx({'MessengerItem': true, 'new': false})}
             onClick={props.onClick}
             onContextMenu={() => {
                 // Todo
             }}
        >
            <Avatar href={avatarUrl}
                    alt={memberName}
                    width={45}
                    height={45}
                    isRound
            />

            <div className={classes.info}>
                <div className={classes.name}>
                    {memberName}
                </div>

                <div className={classes.text}>{props.messenger.messages[0].text}</div>
            </div>

            <div className={classes.meta}>
                {getFormatDate(props.messenger.messages[0].dateCreated)}
            </div>
        </div>
    )
}

MessengerItem.defaultProps = defaultProps
MessengerItem.displayName = 'MessengerItem'

export default MessengerItem