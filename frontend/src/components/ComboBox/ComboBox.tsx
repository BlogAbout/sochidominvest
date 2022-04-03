import React from 'react'
import classNames from 'classnames'
import openContextMenu from '../ContextMenu/ContextMenu'
import Box from '../Box/Box'
import {PopupDisplayOptions} from '../../@types/IPopup'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import styles from './ComboBox.module.scss'

interface Item {
    key: number | string
    text: string
    readOnly?: boolean
    hidden?: boolean // Прячет поле для ситуаций когда значение из поля нужно подставить, но для выбора его нельзя отображать
    title?: string
    className?: string
}

interface Props {
    selected: number | string | boolean | null // Должно быть key выделенного, строка или null
    items: Item[]
    width?: number | string
    margin?: number | string
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    displayOptions?: PopupDisplayOptions
    styleType: 'standard' | 'minimal'
    icon?: IconProp

    onSelect(value: number | string, e: React.MouseEvent<HTMLInputElement>): void
}

const defaultProps: Props = {
    selected: null,
    items: [],
    placeHolder: 'Выберите значение',
    styleType: 'standard',
    onSelect(value: number | string, e: React.MouseEvent<HTMLInputElement>): void {
        console.info('ComboBox onSelect', value, e)
    }
}

const cx = classNames.bind(styles)

const ComboBox: React.FC<Props> = (props) => {
    let text = null
    let placeHolder = props.placeHolder
    let title = props.title
    let imageClass = null

    let selectedItem = props.items.find(item => props.selected === item.key)
    if (selectedItem) {
        text = selectedItem.text
        placeHolder = ''
        title = selectedItem.title || props.title
        imageClass = selectedItem.className
    }

    const pickerClass = cx({
        [imageClass || '']: imageClass,
        [styles['with_image']]: imageClass
    })

    const onChangeHandler = (e: React.MouseEvent) => {
        let items = props.items.map(item => {
            return {
                text: item.text,
                readOnly: item.readOnly,
                title: item.title,
                hidden: item.hidden,
                className: item.className,
                onClick: (event: React.MouseEvent<HTMLInputElement>) => {
                    props.onSelect(item.key, event)
                }
            }
        })

        openContextMenu(e.currentTarget, items, {}, props.displayOptions)
    }

    const onClearHandler = (e: React.MouseEvent<HTMLInputElement>) => {
        props.onSelect('', e)
    }

    return (
        <Box {...props}
             value={text}
             title={title}
             placeHolder={placeHolder}
             pickerClass={pickerClass}
             type='picker'
             onChange={onChangeHandler.bind(this)}
             onClear={onClearHandler.bind(this)}
             showArrow
             styleType={props.styleType}
        />
    )
}

ComboBox.defaultProps = defaultProps
ComboBox.displayName = 'ComboBox'

export default ComboBox