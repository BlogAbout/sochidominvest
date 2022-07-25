import React from 'react'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {getUserAvatar, getUserName} from '../../../../../helpers/userHelper'
import {findMembersIds, isNewMessage} from '../../../../../helpers/messengerHelper'
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

const MessengerItem: React.FC<Props> = (props) => {
    const memberId: number = findMembersIds(props.messenger.members).find((id: number) => id !== props.userId) || 0
    const avatarUrl = getUserAvatar(props.users, memberId)
    const memberName = getUserName(props.users, props.userId === props.messenger.author ? memberId : props.messenger.author)
    const isNew = isNewMessage(props.userId, props.messenger.members, props.messenger.messages[0])

    return (
        <div className={classes.MessengerItem}
             onClick={props.onClick}
             onContextMenu={() => {
                 // Todo: Доделать контекстное меню на мессенджер (передать другому, удалить, выйти (для группового))
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
                <span>{getFormatDate(props.messenger.messages[0].dateCreated)}</span>

                {isNew && <div className={classes.indicator}/>}
            </div>
        </div>
    )
}

MessengerItem.defaultProps = defaultProps
MessengerItem.displayName = 'MessengerItem'

export default MessengerItem