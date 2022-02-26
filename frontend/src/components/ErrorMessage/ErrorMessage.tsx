import React from 'react'
import classes from './ErrorMessage.module.scss'

interface Props {
    text: string
}

const defaultProps: Props = {
    text: ''
}

const ErrorMessage: React.FC<Props> = (props) => {
    return (
        <div className={classes.ErrorMessage}>
            {props.text}
        </div>
    )
}

ErrorMessage.defaultProps = defaultProps
ErrorMessage.displayName = 'ErrorMessage'

export default ErrorMessage