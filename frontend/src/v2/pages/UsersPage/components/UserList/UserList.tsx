import React from 'react'
import {IUser} from '../../../../../@types/IUser'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {getRoleUserText} from '../../../../../helpers/userHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import Indicator from '../../../../../components/ui/Indicator/Indicator'
import classes from './UserList.module.scss'

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
        console.info('UserList onClick', user)
    },
    onContextMenu: (user: IUser, e: React.MouseEvent) => {
        console.info('UserList onClick', user, e)
    }
}

const UserList: React.FC<Props> = (props): React.ReactElement => {
    const {usersOnline} = useTypedSelector(state => state.userReducer)

    return (
        <List className={classes.UserList}>
            <ListHead>
                <ListCell className={classes.name}>Имя</ListCell>
                <ListCell className={classes.post}>Должность</ListCell>
                <ListCell className={classes.email}>Email</ListCell>
                <ListCell className={classes.phone}>Телефон</ListCell>
                <ListCell className={classes.role}>Роль</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching}>
                {props.list && props.list.length ?
                    props.list.map((user: IUser) => {
                        return (
                            <ListRow key={user.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(user, e)}
                                     onClick={() => props.onClick(user)}
                                     isDisabled={!user.active}
                                     isBlock={!!user.block}
                            >
                                <ListCell className={classes.name}>
                                    <Indicator color={user.id && usersOnline.includes(user.id) ? 'green' : 'red'}
                                               text={user.id && usersOnline.includes(user.id) ? 'Online' : `Был в сети: ${getFormatDate(user.lastActive)}`}
                                    />

                                    <span>{user.firstName}</span>
                                </ListCell>
                                <ListCell className={classes.post}>{user.postName || '-'}</ListCell>
                                <ListCell className={classes.email}>{user.email}</ListCell>
                                <ListCell className={classes.phone}>{user.phone}</ListCell>
                                <ListCell className={classes.role}>{getRoleUserText(user.role)}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет пользователей'/>
                }
            </ListBody>
        </List>
    )
}

UserList.defaultProps = defaultProps
UserList.displayName = 'UserList'

export default React.memo(UserList)