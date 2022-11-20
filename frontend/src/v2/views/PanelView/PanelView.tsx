import React from 'react'
import classes from './PanelView.module.scss'

const PanelView = (props: React.PropsWithChildren<any>): React.ReactElement => {
    return (
        <div className={classes.PanelView}>
            {props.children}
        </div>
    )
}

PanelView.displayName = 'PanelView'

export default React.memo(PanelView)