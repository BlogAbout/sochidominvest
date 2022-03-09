import React from 'react'
import classes from './SelectorBox.module.scss'

interface Props {

}

const defaultProps: Props = {

}

const SelectorBox: React.FC<Props> = (props) => {
    return (
        <div className={classes.SelectorBox}>

        </div>
    )
}

SelectorBox.defaultProps = defaultProps
SelectorBox.displayName = 'SelectorBox'