import React, {useState} from 'react'
import Box from '../Box/Box'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

interface Props extends React.PropsWithChildren<any> {
    value?: string | number | void | object
    password?: boolean
    autoFocus?: boolean,
    width?: string | number
    margin?: string | number
    flexGrow?: boolean
    placeholder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    icon?: IconProp
    errorText?: string

    onChange(e: React.ChangeEvent<HTMLInputElement>, value?: string): string

    onBlur?(e: React.ChangeEvent<HTMLInputElement>): void
}

const defaultProps: Props = {
    value: '',
    password: false,
    styleType: 'standard',
    onChange(e: React.ChangeEvent<HTMLInputElement>, value?: string): string {
        return e.target.value
    }
}

const TextBox = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [password, setPassword] = useState(props.password)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e, e.target.value)
    }

    const onClearHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e, '')
    }

    const onClickPasswordEye = () => {
        setPassword(!password)
    }

    const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onBlur) {
            props.onBlur(e)
        } else {
            let value = e.target.value.trim()

            if (props.value !== value) {
                props.onChange(e, value)
            }
        }
    }

    return (
        <Box {...props}
             type='input'
             styleType={props.styleType}
             onChange={onChangeHandler.bind(this)}
             onClear={onClearHandler.bind(this)}
             onBlur={onBlurHandler.bind(this)}
             autoFocus={props.autoFocus}
             inputType={password ? 'password' : 'text'}
             eye={props.password ? !password : null}
             onPasswordEye={props.password ? onClickPasswordEye.bind(this) : null}
        />
    )
})

TextBox.defaultProps = defaultProps
TextBox.displayName = 'TextBox'

export default TextBox