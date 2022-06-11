import React from 'react'
import classes from './Spacer.module.scss'

interface Props {
    height?: number
}

const defaultProps: Props = {
    height: 20
}

const Spacer: React.FC<Props> = (props) => {
    return (
        <div className={classes.Spacer} style={{height: props.height}}/>
    )
}

Spacer.defaultProps = defaultProps
Spacer.displayName = 'Spacer'

export default Spacer