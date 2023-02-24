import React from 'react'
import {IMailingRecipient} from '../../../../../@types/IMailing'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../ui/Empty/Empty'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import classes from './RecipientList.module.scss'

interface Props {
    list: IMailingRecipient[]
    fetching?: boolean

    onRemove(recipient: IMailingRecipient): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onRemove: (recipient: IMailingRecipient) => {
        console.info('RecipientList onRemove', recipient)
    }
}

const RecipientList: React.FC<Props> = (props) => {
    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, recipient: IMailingRecipient) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить', onClick: () => props.onRemove(recipient)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.RecipientList}>
            <div className={classes.header}>
                <div className={classes.email}>E-mail</div>
                <div className={classes.type}>Тип</div>
            </div>

            <BlockingElement fetching={!!props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((recipient: IMailingRecipient) => {
                        return (
                            <div key={`${recipient.mailingId}-${recipient.userType}-${recipient.userId}`}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, recipient)}
                            >
                                <div className={classes.email}>{recipient.email}</div>
                                <div
                                    className={classes.type}>{recipient.userType === 'subscriber' ? 'Подписчик' : 'Внешний'}</div>
                            </div>
                        )
                    })
                    : <Empty message='Нет подписчиков'/>
                }
            </BlockingElement>
        </div>
    )
}

RecipientList.defaultProps = defaultProps
RecipientList.displayName = 'RecipientList'

export default RecipientList