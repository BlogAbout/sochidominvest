import React from 'react'
import Box from '../Box/Box'
import openPopupAddressSelector from '../../popup/PopupAddressSelector/PopupAddressSelector'

interface Props {
    address?: string
    coordinates?: string
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

    onSelect(address: string, coordinates: string): void
}

const defaultProps: Props = {
    address: '',
    coordinates: '',
    onSelect: (address: string, coordinates: string) => {
        console.info('AddressBox onSelect', address, coordinates)
    }
}

const AddressBox: React.FC<Props> = (props) => {
    // Обработчик клика на поле
    const clickHandler = (e: React.MouseEvent) => {
        openPopupAddressSelector(document.body, {
            address: props.address || '',
            coordinates: props.coordinates || '',
            onSave: (address: string, coordinates: string) => {
                props.onSelect(address, coordinates)
            }
        })
    }

    // Обработчик сброса выбора
    const resetHandler = () => {
        props.onSelect('', '')
    }

    const {onSelect, ...otherProps} = props
    return (
        <Box {...otherProps}
             value={otherProps.address || ''}
             type='picker'
             title={otherProps.address || otherProps.title}
             onChange={clickHandler.bind(this)}
             onClear={resetHandler.bind(this)}
             showSelect
        />
    )
}

AddressBox.defaultProps = defaultProps
AddressBox.displayName = 'AddressBox'

export default AddressBox