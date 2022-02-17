import React, {useState} from 'react'
import {round} from '../../helpers/numberHelper'
import {sliceLastSymbol} from '../../helpers/stringHelper'
import Box from '../Box/Box'

interface Props extends React.PropsWithChildren<any> {
    value?: string | number
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    showArrows?: boolean
    width?: string | number
    margin?: string | number
    fontSize?: string
    flexGrow?: boolean
    placeholder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    countAfterComma?: number // Кол-во знаков после запятой (для типа 'float')
    min?: number
    max?: number
    step?: number
    notNull?: boolean // Значение не может быть пустым
    showMaxAfterOverflow?: boolean // Показывать максимум, если число превышает максимум. По умолчанию true
    transform?: boolean

    onChange(e: React.ChangeEvent<HTMLInputElement>, value?: string | number, up?: any): string

    onBlur?(e: React.ChangeEvent<HTMLInputElement>): void
}

const defaultProps: Props = {
    value: '',
    countAfterComma: 0,
    min: 0,
    max: 999,
    step: 1,
    notNull: false,
    showArrows: true,
    styleType: 'standard',
    showMaxAfterOverflow: true,
    onChange(e: React.ChangeEvent<HTMLInputElement>, value?: string | number, up?: any): string {
        console.log(e, value, up)

        return e.target.value
    }
}

const NumberBox: React.FC<Props> = (props) => {
    const [isEdit, setIsEdit] = useState(false)

    const trim = (value: string) => {
        return value.replace(/ /g, "")
    }

    const checkTransform = () => {
        return props.transform && !isEdit
    }

    const checkValue = (value: string) => {
        if (value === '00' || value === '-00') {
            return false
        }

        let reg = '^[-]?\\d+'

        if (props.countAfterComma) {
            reg += `(\\.\\d{0,${props.countAfterComma}})?`
        }
        reg += '$'

        const regex = new RegExp(reg)

        return regex.test(value)
    }

    // Регулировка значения по средствам нажатия стрелок (up, down)
    const getValue = (value: number, arrowPress?: boolean) => {
        if (props.max && value > props.max) {
            if (props.showMaxAfterOverflow || arrowPress) {
                return props.max
            }

            const integerValue = Math.trunc(value)

            if (integerValue > props.max) {
                const afterCommaValue = value % 1
                let maxValue = Number(sliceLastSymbol(integerValue.toString()))
                const toFixedValue = afterCommaValue > 0 ? props.countAfterComma : 0

                return Number(afterCommaValue > 0 ? maxValue + afterCommaValue : maxValue).toFixed(toFixedValue)
            }
        }

        if (props.min && value < props.min) {
            return props.min
        }

        return value
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = checkTransform() ? props.value : e.target.value

        if (value) {
            value = trim(value.toString()).replace(/,/g, ".")

            if (props.notNull && value === '') {
                value = props.min
            }

            if (value) {
                if (!checkValue(value.toString())) {
                    return false
                }

                if (value.toString()[value.toString().length - 1] !== '.') {
                    value = getValue(Number(value))
                }
            }

            checkTransform() ? onTransformHandler(true) : props.onChange(e, value)
        }
    }

    const onClearHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e, '')
    }

    // Для обработки значений 0
    const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = trim(e.target.value)

        if (props.countAfterComma) {
            value = value ? round(Number(value), props.countAfterComma).toString() : ''
        }

        props.onChange(e, value)

        if (props.onBlur) {
            props.onBlur(e)
        }

        onTransformHandler(false)
    }

    const onArrowHandler = (e: React.ChangeEvent<HTMLInputElement>, up: boolean) => {
        let value = +(props.value || 0)

        value += up ? (props.step || 1) : -(props.step || 1)

        if (props.countAfterComma) {
            value = round(value, props.countAfterComma) // Увеличение может дать результат в виде 2.00000000003
        }

        props.onChange(e, getValue(value, true), up)
    }

    const onTransformHandler = (isEdit: boolean) => {
        setIsEdit(isEdit)
    }

    if (isEdit) {
        props.autoFocus = true
    }

    if (props.transform && isEdit && props.value) {
        props.value = trim(props.value.toString())
    }

    return (
        <Box {...props}
             type={checkTransform() ? 'picker' : 'input'}
             onChange={onChangeHandler.bind(this)}
             onBlur={onBlurHandler.bind(this)}
             onClear={onClearHandler.bind(this)}
             onArrows={onArrowHandler.bind(this)}
             showArrows={props.showArrows}
             styleType={props.styleType}
        />
    )
}

NumberBox.defaultProps = defaultProps
NumberBox.displayName = 'NumberBox'

export default NumberBox