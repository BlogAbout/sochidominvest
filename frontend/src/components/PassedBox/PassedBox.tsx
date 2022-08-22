import React, {useEffect, useState} from 'react'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {IBuildingPassed} from '../../@types/IBuilding'
import openPopupPassedSelector from '../popup/PopupPassedSelector/PopupPassedSelector'
import Box from '../form/Box/Box'

interface Props {
    selected: IBuildingPassed | null
    width?: number | string
    margin?: number | string
    flexGrow?: boolean,
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    errorText?: string
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    icon?: IconProp
    styleType: 'standard' | 'minimal'

    onChange(value: IBuildingPassed | null): void
}

const defaultProps: Props = {
    selected: null,
    styleType: 'standard',
    onChange: (value: IBuildingPassed) => {
        console.info('PassedBox onSelect', value)
    }
}

const PassedBox: React.FC<Props> = (props) => {
    const [text, setText] = useState('')

    useEffect(() => {
        updateSelectedInfo()
    }, [props.selected])

    // Обработчик клика на поле
    const clickHandler = () => {
        openPopupPassedSelector(document.body, {
            selected: props.selected,
            onChange: (value: IBuildingPassed) => {
                props.onChange(value)
            }
        })
    }

    // Обработчик сброса выбора
    const resetHandler = () => {
        props.onChange(null)
    }

    // Обновление отображаемого текста в поле по выбранному значению
    const updateSelectedInfo = () => {
        let tmpText = ''

        if (props.selected) {
            if (props.selected.quarter) {
                tmpText += props.selected.quarter + ' квартал '
            }

            if (props.selected.year) {
                tmpText += props.selected.year
            }
        }

        setText(tmpText)
    }

    return (
        <Box {...props}
             value={text}
             title={props.title || text}
             type='picker'
             onChange={clickHandler.bind(this)}
             onClear={resetHandler.bind(this)}
             showSelect
             styleType={props.styleType}
        />
    )
}

PassedBox.defaultProps = defaultProps
PassedBox.displayName = 'PassedBox'

export default PassedBox