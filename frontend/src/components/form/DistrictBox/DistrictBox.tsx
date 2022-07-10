import React, {useEffect, useState} from 'react'
import Box from '../Box/Box'
import openPopupDistrictSelector from '../../popup/PopupDistrictSelector/PopupDistrictSelector'

interface Props {
    selected: string[]
    width?: number | string
    margin?: number | string
    flexGrow?: boolean,
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    errorText?: string

    onSelect(selected: string[]): void
}

const defaultProps: Props = {
    selected: [],
    onSelect: (selected: string[]) => {
        console.info('DistrictBox onSelect', selected)
    }
}

const DistrictBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        updateSelectedInfo()
    }, [props.selected])

    // Обработчик клика на поле
    const clickHandler = (e: React.MouseEvent) => {
        openPopupDistrictSelector(document.body, {
            selected: props.selected,
            onSave: (selected: string[]) => {
                props.onSelect(selected)
            }
        })
    }

    // Обработчик сброса выбора
    const resetHandler = () => {
        props.onSelect([])
    }

    // Обновление отображаемого текста в поле по выбранному значению
    const updateSelectedInfo = () => {
        let tmpText = ''
        let tmpTitle = ''

        if (props.selected && props.selected.length) {
            const firstDistrict: string = props.selected[0]

            if (firstDistrict) {
                tmpText += firstDistrict
            }

            if (props.selected.length > 1) {
                tmpText += ` + ещё ${props.selected.length - 1}`
            }

            tmpTitle = props.selected.join('\n')
        }

        setText(tmpText)
        setTitle(tmpTitle)
    }

    const {onSelect, ...otherProps} = props
    return (
        <Box {...otherProps}
             value={text}
             type='picker'
             title={otherProps.title || title}
             onChange={clickHandler.bind(this)}
             onClear={resetHandler.bind(this)}
             showSelect
        />
    )
}

DistrictBox.defaultProps = defaultProps
DistrictBox.displayName = 'DistrictBox'

export default DistrictBox