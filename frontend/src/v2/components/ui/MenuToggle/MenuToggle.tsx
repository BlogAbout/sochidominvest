import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './MenuToggle.module.scss'

interface Props {
    show: boolean

    onToggle(): void
}

const defaultProps: Props = {
    show: false,
    onToggle: () => {
        console.info('MenuToggle onToggle')
    }
}

const MenuToggle: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.MenuToggle} onClick={() => props.onToggle()}>
            <FontAwesomeIcon icon={props.show ? 'xmark' : 'bars'}/>
        </div>
    )
}

MenuToggle.defaultProps = defaultProps
MenuToggle.displayName = 'MenuToggle'

export default React.memo(MenuToggle)