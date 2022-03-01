import * as React from 'react'
import classNames from 'classnames/bind'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './Button.module.scss'

interface Props extends React.HTMLAttributes<any> {
    title?: string
    className?: 'default' | 'marginLeft' | 'marginRight'
    type: 'apply' | 'save' | 'cancel' | 'regular'
    disabled?: boolean
    notValid?: boolean
    icon?: IconProp

    onClick(e: React.MouseEvent<HTMLElement>): void
}

const defaultProps: Props = {
    title: '',
    className: 'default',
    type: 'apply',
    disabled: false,
    notValid: false,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
        console.log(e)
    }
}

const cx = classNames.bind(classes)

const Button: React.FC<Props> = (props) => {
    const userStyle = props.className ? props.className : ''
    const buttonStyle = cx({
        'button': true,
        [`${props.type}`]: true,
        ['disabled']: props.disabled,
        ['not-valid']: props.notValid,
        ['is-icon']: !!props.icon
    }, userStyle)

    return (
        <div className={buttonStyle}
             title={props.title}
             onClick={(e: React.MouseEvent<HTMLElement>) => {
                 if (!props.disabled) {
                     props.onClick(e)
                 }
             }}
        >
            {props.icon ?
                <span className={classes.icon}>
                    <FontAwesomeIcon icon={props.icon}/>
                </span>
                : null
            }
            <span className={classes.text}>{props.children}</span>
        </div>
    )
}

Button.defaultProps = defaultProps
Button.displayName = 'Button'

export default Button