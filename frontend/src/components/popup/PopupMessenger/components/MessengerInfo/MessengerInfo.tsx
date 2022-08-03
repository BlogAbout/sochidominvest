import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './MessengerInfo.module.scss'

interface Props {
    memberId: number
    avatarUrl?: string | null
    memberName: string
    onClickBack(): void
}

const defaultProps: Props = {
    memberId: 0,
    avatarUrl: '',
    memberName: '',
    onClickBack: () => {
        console.info('MessengerInfo onClickBack')
    }
}

const cx = classNames.bind(classes)

const MessengerInfo: React.FC<Props> = (props) => {
    const {usersOnline} = useTypedSelector(state => state.userReducer)

    return (
        <div className={classes.MessengerInfo}>
            <div className={cx({'link': true, 'back': true})}>
                        <span onClick={() => props.onClickBack()}>
                            <FontAwesomeIcon icon='arrow-left-long'/>
                            <span>Назад</span>
                        </span>
            </div>

            <Avatar href={props.avatarUrl}
                    alt={props.memberName}
                    width={35}
                    height={35}
            />

            <div className={classes.name}>{props.memberName}</div>

            <div className={cx({'indicator': true, 'online': usersOnline.includes(props.memberId)})}
                 title={usersOnline.includes(props.memberId) ? 'Online' : 'Offline'}
            />
        </div>
    )
}

MessengerInfo.defaultProps = defaultProps
MessengerInfo.displayName = 'MessengerInfo'

export default MessengerInfo