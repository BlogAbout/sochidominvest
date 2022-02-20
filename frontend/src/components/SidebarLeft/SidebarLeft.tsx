import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './SidebarLeft.module.scss'

const cx = classNames.bind(classes)

const SidebarLeft: React.FC = () => {
    const [isShow, setIsShow] = useState(false)

    return (
        <aside className={cx({'SidebarLeft': true, 'show': isShow})}>
            <div className={classes.content}>
                <h2>Фильтры</h2>
            </div>

            <div className={cx({'toggle': true, 'show': isShow})} onClick={() => setIsShow(!isShow)}>
                <FontAwesomeIcon icon='angle-left'/>
            </div>
        </aside>
    )
}

SidebarLeft.displayName = 'SidebarLeft'

export default SidebarLeft