import React, {useState} from 'react'
import Box from '../Box/Box'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

interface Props extends React.PropsWithChildren<any> {
    value?: string | number
    password?: boolean
    autoFocus?: boolean
    width?: string | number
    margin?: string | number
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    errorText?: string
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    icon?: IconProp

    onChange(value: string): void

    onBlur?(e: React.ChangeEvent<HTMLInputElement>): void
}

const defaultProps: Props = {
    value: '',
    password: false,
    styleType: 'standard',
    onChange(value: string): void {
        console.info('TextBox onChange', value)
    }
}

const TextBox: React.FC<Props> = ((props): React.ReactElement => {
    const [password, setPassword] = useState(props.password)

    // Изменение значения поля
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target.value)
    }

    // Очистка поля
    const onClearHandler = () => {
        props.onChange('')
    }

    // Скрыть/показать пароль
    const onClickPasswordEye = () => {
        setPassword(!password)
    }

    const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onBlur) {
            props.onBlur(e)
        } else {
            let value = e.target.value.trim()

            if (props.value !== value) {
                props.onChange(value)
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