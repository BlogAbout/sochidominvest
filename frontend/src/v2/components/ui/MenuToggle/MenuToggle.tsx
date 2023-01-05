import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import classes from './MenuToggle.module.scss'

interface Props {
    show: boolean
    inPanel?: boolean

    onToggle(): void
}

const defaultProps: Props = {
    show: false,
    inPanel: false,
    onToggle: () => {
        console.info('MenuToggle onToggle')
    }
}

const cx = classNames.bind(classes)

const MenuToggle: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div onClick={() => props.onToggle()}
             className={cx({'MenuToggle': true, 'inPanel': props.inPanel})}
        >
            <FontAwesomeIcon icon={props.show ? 'xmark' : 'bars'}/>
        </div>
    )
}

MenuToggle.defaultProps = defaultProps
MenuToggle.displayName = 'MenuToggle'

export default React.memo(MenuToggle)