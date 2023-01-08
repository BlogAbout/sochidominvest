import React from 'react'
import {IUser} from '../../../../../@types/IUser'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {getRoleUserText} from '../../../../../helpers/userHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Card from '../../../../components/ui/Card/Card.'
import classes from './UserTill.module.scss'

interface Props {
    list: IUser[]
    fetching: boolean

    onClick(user: IUser): void

    onContextMenu(user: IUser, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onClick: (user: IUser) => {
        console.info('UserTill onClick', user)
    },
    onContextMenu: (user: IUser, e: React.MouseEvent) => {
        console.info('UserTill onClick', user, e)
    }
}

const UserTill: React.FC<Props> = (props): React.ReactElement => {
    const {usersOnline} = useTypedSelector(state => state.userReducer)

    return (
        <div className={classes.UserTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((user: IUser) => {
                        return (
                            <Card key={user.id}
                                  title={user.firstName}
                                  avatar={user.avatar || ''}
                                  role={getRoleUserText(user.role)}
                                  phone={user.phone}
                                  email={user.email}
                                  indicatorColor={user.id && usersOnline.includes(user.id) ? 'green' : 'red'}
                                  indicatorText={user.id && usersOnline.includes(user.id) ? 'Online' : `Был в сети: ${getFormatDate(user.lastActive)}`}
                                  isDisabled={!user.active}
                                  isBlock={!!user.block}
                                  onContextMenu={(e: React.MouseEvent) => props.onContextMenu(user, e)}
                                  onClick={() => props.onClick(user)}
                            />
                        )
                    })
                    : <Empty message='Нет пользователей'/>
                }
            </BlockingElement>
        </div>
    )
}

UserTill.defaultProps = defaultProps
UserTill.displayName = 'UserTill'

export default React.memo(UserTill)