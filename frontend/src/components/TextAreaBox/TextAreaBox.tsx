import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import classes from './TextAreaBox.module.scss'

interface Props {
    value?: string
    autoFocus?: boolean,
    width?: string | number
    margin?: string | number
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showRequired?: boolean
    icon?: IconProp
    errorText?: string

    onChange(value: string): void
}

const defaultProps: Props = {
    value: '',
    onChange(value: string): void {
        console.info('TextAreaBox onChange', value)
    }
}

const cx = classNames.bind(classes)

const TextAreaBox: React.FC<Props> = (props) => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange(e.target.value || '')
    }

    return (
        <div className={cx({'TextAreaBox': true, 'icon': !!props.icon})}
             style={{
                 margin: props.margin,
                 width: props.width,
                 flexGrow: props.flexGrow ? 1 : undefined
             }}
             title={props.title || props.placeHolder}
        >
            {props.icon && <div className={classes.icon}><FontAwesomeIcon icon={props.icon}/></div>}

            <textarea className={classes['input']}
                      onChange={onChangeHandler.bind(this)}
                      value={props.value === null ? '' : props.value}
                      placeholder={props.placeHolder || ''}
                      readOnly={props.readOnly}
                      autoFocus={props.autoFocus}
            />
        </div>
    )
}

TextAreaBox.defaultProps = defaultProps
TextAreaBox.displayName = 'TextAreaBox'

export default TextAreaBox