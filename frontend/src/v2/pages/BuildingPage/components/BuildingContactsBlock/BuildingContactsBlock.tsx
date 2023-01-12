import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {IBuilding} from '../../../../../@types/IBuilding'
import {IContact} from '../../../../../@types/IAgent'
import {IUser} from '../../../../../@types/IUser'
import AgentService from '../../../../../api/AgentService'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../../../components/Empty/Empty'
import Title from '../../../../components/ui/Title/Title'
import Indicator from '../../../../../components/ui/Indicator/Indicator'
import openPopupMessenger from '../../../../../components/popup/PopupMessenger/PopupMessenger'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import classes from './BuildingContactsBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingContactsBlock: React.FC<Props> = (props): React.ReactElement | null => {
    const [fetching, setFetching] = useState(false)
    const [contacts, setContacts] = useState<IContact[]>([])

    const {users, usersOnline} = useTypedSelector(state => state.userReducer)

    const {fetchUserList} = useActions()

    useEffect(() => {
        fetchUserList({active: [0, 1]})
    }, [])

    useEffect(() => {
        onFetchContactList()
    }, [props.building.contactContacts])

    const onFetchContactList = (): void => {
        if (!props.building || !props.building.contactContacts || !props.building.contactContacts.length) {
            return
        }

        setFetching(true)

        AgentService.fetchContacts({id: props.building.contactContacts, active: [1]})
            .then((response: any) => setContacts(response.data))
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetching(false))
    }

    const renderContactUsersList = () => {
        if (!props.building.contactUsers || !props.building.contactUsers.length || !users || !users.length) {
            return
        }

        return (
            props.building.contactUsers.map((id: number) => {
                const userInfo = users.find((user: IUser) => user.id === id)

                return userInfo ?
                    <div key={id}>
                        <span>
                            <Indicator color={userInfo.id && usersOnline.includes(userInfo.id) ? 'green' : 'red'}
                                       text={userInfo.id && usersOnline.includes(userInfo.id) ? 'Online' : `Был в сети: ${getFormatDate(userInfo.lastActive)}`}
                            />

                            <span>{userInfo.firstName}</span>

                            <span className={classes.icon}
                                  title='Написать в чат'
                                  onClick={() => {
                                      openPopupMessenger(document.body, {
                                          currentMemberId: userInfo.id
                                      })
                                  }}
                            >
                                <FontAwesomeIcon icon='message'/>
                            </span>
                        </span>

                        {userInfo.postName && <span className={classes.post}>{userInfo.postName}</span>}

                        <span><a href={`tel:${userInfo.phone}`}>{userInfo.phone}</a></span>
                    </div>
                    : null
            })
        )
    }

    const renderContactContactsList = () => {
        if (!props.building.contactContacts || !props.building.contactContacts.length || !contacts || !contacts.length) {
            return
        }

        return (
            contacts.map((contact: IContact) => {
                return (
                    <div key={contact.id}>
                        <span>
                            <span>{contact.name}</span>
                        </span>

                        {contact.post.trim() !== '' && <span className={classes.post}>{contact.post}</span>}

                        <span><a href={`tel:${contact.phone}`}>{contact.phone}</a></span>
                    </div>
                )
            })
        )
    }

    return (
        <BlockingElement fetching={fetching} className={classes.BuildingContactsBlock}>
            <Title type='h2'>Контакты</Title>

            {(props.building.contactUsers && props.building.contactUsers.length && users && users.length) || (props.building.contactContacts && props.building.contactContacts.length && contacts && contacts.length) ?
                <div className={classes.list}>
                    {renderContactUsersList()}
                    {renderContactContactsList()}
                </div>
                : <Empty message='Отсутствует информация о контактах'/>
            }
        </BlockingElement>
    )
}

BuildingContactsBlock.defaultProps = defaultProps
BuildingContactsBlock.displayName = 'BuildingContactsBlock'

export default BuildingContactsBlock