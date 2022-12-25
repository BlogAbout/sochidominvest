import React, {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IContact} from '../../../../../@types/IAgent'
import AgentService from '../../../../../api/AgentService'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../Empty/Empty'
import openPopupAlert from '../../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import openPopupContactCreate from '../../../PopupContactCreate/PopupContactCreate'
import classes from './ContactList.module.scss'

interface Props {
    agentId?: number | null
    contacts: IContact[]
    fetching?: boolean

    onSave(): void
}

const defaultProps: Props = {
    agentId: null,
    contacts: [],
    fetching: false,
    onSave: () => {
        console.info('ContactList onSave')
    }
}

const ContactList: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(props.fetching || false)

    const onAddHandler = () => {
        if (!props.agentId) {
            return
        }

        openPopupContactCreate(document.body, {
            agentId: props.agentId,
            onSave: () => {
                props.onSave()
            }
        })
    }

    const onEditHandler = (contact: IContact) => {
        if (!props.agentId) {
            return
        }

        openPopupContactCreate(document.body, {
            agentId: props.agentId,
            contact: contact,
            onSave: () => {
                props.onSave()
            }
        })
    }

    const onRemoveHandler = (contact: IContact) => {
        if (!contact.id) {
            return
        }

        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${contact.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (!contact.id) {
                            return
                        }

                        AgentService.removeContact(contact.id)
                            .then(() => props.onSave())
                            .catch((error: any) => {
                                openPopupAlert(document.body, {
                                    title: 'Ошибка!',
                                    text: error.data
                                })
                            })
                            .finally(() => {
                                setFetching(false)
                            })
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, contact: IContact) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: () => onEditHandler(contact)},
            {text: 'Удалить', onClick: () => onRemoveHandler(contact)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.ContactList}>
            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.post}>Должность/Отдел</div>
            </div>

            {props.agentId ?
                <div className={classes.addContact} onClick={onAddHandler.bind(this)}>
                    <FontAwesomeIcon icon='plus'/> Добавить
                </div>
                : null
            }

            <BlockingElement fetching={fetching} className={classes.list}>
                {props.contacts && props.contacts.length ?
                    props.contacts.map((contact: IContact) => {
                        return (
                            <div key={contact.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, contact)}
                            >
                                <div className={classes.name}>{contact.name}</div>
                                <div className={classes.post}>{contact.post}</div>
                            </div>
                        )
                    })
                    : <Empty message='В агентстве нет контактов'/>
                }
            </BlockingElement>
        </div>
    )
}

ContactList.defaultProps = defaultProps
ContactList.displayName = 'ContactList'

export default ContactList