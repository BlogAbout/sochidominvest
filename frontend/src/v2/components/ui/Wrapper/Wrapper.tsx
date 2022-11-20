import React from 'react'
import classes from './Wrapper.module.scss'

const Wrapper = (props: React.PropsWithChildren<any>): React.ReactElement => {
    return (
        <div className={classes.Wrapper}>
            {props.children}
        </div>
    )
}

Wrapper.displayName = 'Wrapper'

export default React.memo(Wrapper)