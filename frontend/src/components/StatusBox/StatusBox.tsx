import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import openContextMenu from '../ContextMenu/ContextMenu'
import classes from './StatusBox.module.scss'

interface Props {
    value: string | null
    items: any[]
    readOnly?: boolean

    onChange(value: string): void
}

const defaultProps: Props = {
    value: null,
    items: [],
    readOnly: false,
    onChange: (value: string) => {
        console.info('StatusBox onChange', value)
    }
}

const StatusBox: React.FC<Props> = (props) => {
    const status = props.items.find(item => item.text === props.value)

    const changeStatus = (e: React.MouseEvent) => {
        openContextMenu(e, props.items)
    }

    return (
        <div className={classes.StatusBox}
             style={{cursor: props.readOnly ? 'default' : 'pointer'}}
             onClick={changeStatus.bind(this)}
             title={status ? status.title : ''}
        >
            <div className={classes.status}>
                {status ? status.title : null}
            </div>

            {!props.readOnly &&
            <div className={classes.select}>
                <div className={classes.icon}>
                    <FontAwesomeIcon icon='chevron-down'/>
                </div>
            </div>
            }
        </div>
    )
}

StatusBox.defaultProps = defaultProps
StatusBox.displayName = 'StatusBox'

export default StatusBox