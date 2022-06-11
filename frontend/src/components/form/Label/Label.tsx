import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './Label.module.scss'

interface Props {
    text: string
    showGeneratePassword?: boolean

    onGeneratePassword?(): void
}

const defaultProps: Props = {
    text: '',
    showGeneratePassword: false
}

const Label: React.FC<Props> = (props) => {
    return (
        <div className={classes.Label}>
            <span dangerouslySetInnerHTML={{__html: props.text}}/>
            {props.showGeneratePassword &&
            <span className={classes.generatePassword}
                  onClick={() => props.onGeneratePassword ? props.onGeneratePassword() : undefined}
            ><FontAwesomeIcon icon='key'/></span>}
        </div>
    )
}

Label.defaultProps = defaultProps
Label.displayName = 'Label'

export default Label