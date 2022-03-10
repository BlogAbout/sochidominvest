import React, {useEffect, useState} from 'react'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {ISelector} from '../../@types/ISelector'
import openPopupSelector from '../PopupSelector/PopupSelector'
import Box from '../Box/Box'

interface Props {
    selected: string[]
    items: ISelector[]
    multi?: boolean
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

    onSelect(value: string[]): void
}

const defaultProps: Props = {
    selected: [],
    items: [],
    onSelect: (value: string[]) => {
        console.info('SelectorBox onSelect', value)
    }
}

const SelectorBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        updateSelectedInfo()
    }, [props.items, props.selected])

    // Обработчик клика на поле
    const clickHandler = () => {
        openPopupSelector(document.body, {
            title: props.title || 'Выбрать',
            multi: props.multi,
            selected: props.selected,
            items: props.items,
            onSelect: (value: string[]) => {
                props.onSelect(value)
            }
        }, {
            center: true
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

        if (props.items.length && props.selected.length) {
            const names: string[] = []
            const firstInfo = props.items.find((item: ISelector) => item.key === props.selected[0])

            if (firstInfo) {
                tmpText += firstInfo.text
            }

            if (props.selected.length > 1) {
                tmpText += ` + еще ${props.selected.length - 1}`
            }

            props.selected.map((key: string) => {
                const itemInfo = props.items.find((item: ISelector) => item.key === key)

                if (itemInfo) {
                    names.push(itemInfo.text)
                }
            })

            tmpTitle = names.join('\n')
        }

        setText(tmpText)
        setTitle(tmpTitle)
    }

    const {onSelect, ...otherProps} = props

    return (
        <Box {...otherProps}
             value={text}
             title={otherProps.title || title}
             type='picker'
             onChange={clickHandler.bind(this)}
             onClear={resetHandler.bind(this)}
             showSelect
        />
    )
}

SelectorBox.defaultProps = defaultProps
SelectorBox.displayName = 'SelectorBox'

export default SelectorBox