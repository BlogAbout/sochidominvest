import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import classes from './Box.module.scss'

interface Props extends React.PropsWithChildren<any> {
    value?: string | number
    type: 'input' | 'picker'
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    inputType: 'password' | 'text' // Для input
    pickerStyle?: React.CSSProperties, // Для picker
    pickerClass?: string, // Для picker
    eye?: boolean
    find?: number | boolean
    showSelect?: boolean
    showDate?: boolean
    showArrow?: boolean
    showArrowLeft?: boolean
    showArrowRight?: boolean
    showArrows?: boolean
    width?: string | number
    margin?: string | number
    fontSize?: string
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    autoFocus?: boolean
    icon?: IconProp
    errorText?: string

    onEdit?(e: React.MouseEvent): void

    onChange(e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent): string

    onBlur?(e: React.ChangeEvent<HTMLInputElement>): void

    onClear?(e: React.MouseEvent): void

    onSelect?(e: React.MouseEvent): void // Метод по клику на три точки
    onArrow?(e: React.MouseEvent): void // Метод по клику на стрелку вниз
    onPasswordEye?(): void,

    onArrows?(value: boolean, e: React.MouseEvent): void
}

const defaultProps: Props = {
    value: '',
    type: 'input',
    inputType: 'text',
    find: false,
    width: 'auto',
    margin: '',
    flexGrow: false,
    placeHolder: '',
    title: '',
    readOnly: false,
    error: false,
    showValidate: false,
    showRequired: false,
    showClear: false,
    disableTitle: false,
    onChange(e: React.ChangeEvent<HTMLInputElement>): string {
        return e.target.value
    }
}

const cx = classNames.bind(classes)

// Todo: Рефакторинг

const Box = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [dateActive, setDateActive] = useState(false)

    const renderInput = () => {
        let pickerStyle = props.pickerStyle

        if (!pickerStyle) {
            pickerStyle = {} as React.CSSProperties
        }

        if (props.fontSize) {
            pickerStyle.fontSize = props.fontSize
        }

        const isMinimal = props.styleType === 'minimal'
        const borderDisabled = props.styleType === 'borderDisabled'

        return (
            props.type === 'input' ?
                <input className={cx(classes['input'], {'minimal': isMinimal, 'borderDisabled': borderDisabled})}
                       onChange={props.onChange.bind(this)}
                       onBlur={props.onBlur}
                       value={props.value === null ? '' : props.value}
                       placeholder={props.placeHolder || ''}
                       readOnly={props.readOnly}
                       type={props.inputType}
                       autoFocus={props.autoFocus}
                       autoComplete={props.inputType === 'password' ? 'new-password' : 'off'}
                /> :
                <div style={pickerStyle}
                     className={cx(
                         classes['input_style'],
                         classes['text_hidden'],
                         props.pickerClass,
                         {
                             [classes['minimal']]: isMinimal,
                             [classes['placeholder_minimal']]: isEmptyValue() && isMinimal
                         }
                     )}
                >
                    {props.value || props.placeHolder}
                </div>
        )
    }

    const isEmptyValue = () => {
        return !props.value && props.value !== 0
    }

    const isShowClear = () => {
        const emptyValue = isEmptyValue()

        return !emptyValue && props.showClear && !props.readOnly
    }

    const renderClear = () => {
        const showClear = isShowClear()
        const onClear = (e: React.MouseEvent) => {
            e.stopPropagation()

            if (props.onClear) {
                props.onClear(e)
            }
        }
        const isMinimal = props.styleType === 'minimal'

        return (
            <div className={cx({'minimal': isMinimal, 'cross': showClear, 'hidden': !showClear})}
                 onClick={onClear}
                 title='Очистить'
                 style={{borderRight: props.showRequired && !isMinimal ? '1px solid #075ea5' : undefined}}
            />
        )
    }

    const renderArrows = () => {
        if (!props.showArrows) {
            return
        }

        const onUp = (up: boolean, e: React.MouseEvent) => {
            if (props.readOnly) {
                return false
            }

            e.stopPropagation()

            if (props.onArrows) {
                props.onArrows(up, e)
            }
        }

        const isMinimal = props.styleType === 'minimal'

        return (
            <div className={cx({'box_item': true, 'minimal': isMinimal})}>
                <div onClick={onUp.bind(this, true)}
                     title='Увеличить'
                     className={cx({'box_arrow_up': true, 'minimal': isMinimal})}
                />
                <div onClick={onUp.bind(this, false)}
                     title='Уменьшить'
                     className={cx({'box_arrow_down': true, 'minimal': isMinimal})}
                />
            </div>
        )
    }

    const renderEdit = () => {
        if (!props.onEdit) {
            return
        }

        const onClick = (e: React.MouseEvent) => {
            e.stopPropagation()

            if (props.onEdit) {
                props.onEdit(e)
            }
        }

        const isMinimal = props.styleType === 'minimal'

        return (
            <div className={cx({'edit': true, 'minimal': isMinimal})}
                 title='Редактировать'
                 onClick={onClick}
            />
        )
    }

    const renderArrow = () => {
        if (!props.showArrow) {
            return
        }

        const onClick = (e: React.MouseEvent) => {
            if (!props.onArrow || props.readOnly) {
                return false
            }

            e.stopPropagation()
            props.onArrow(e)
        }
        const isMinimal = props.styleType === 'minimal'

        return (
            <div className={cx({'arrow': true, 'minimal': isMinimal})} onClick={onClick}>
                <FontAwesomeIcon icon='angle-down'/>
            </div>
        )
    }

    const renderArrowLeft = () => {
        if (!props.showArrowLeft) {
            return
        }

        const onClick = (e: React.MouseEvent) => {
            e.stopPropagation()

            if (props.onArrows) {
                props.onArrows(true, e)
            }
        }

        return (
            <div className={classes['arrow_left']}
                 title='Предыдущий'
                 onClick={onClick}
            />
        )
    }

    const renderArrowRight = () => {
        if (!props.showArrowRight) {
            return
        }

        const onClick = (e: React.MouseEvent) => {
            e.stopPropagation()

            if (props.onArrows) {
                props.onArrows(false, e)
            }
        }

        return (
            <div className={classes['arrow_right']}
                 title='Следующий'
                 onClick={onClick}
            />
        )
    }

    const renderSelect = () => {
        if (!props.showSelect) {
            return
        }

        const onSelect = (e: React.MouseEvent) => {
            if (!props.onSelect || props.readOnly) {
                return false
            }

            e.stopPropagation()
            props.onSelect(e)
        }

        return (
            <div className={cx({'select': true, 'minimal': props.styleType === 'minimal'})}
                 title='Выбрать'
                 onClick={onSelect}>
                <FontAwesomeIcon icon='ellipsis'/>
            </div>
        )
    }

    const renderRequired = () => {
        if (props.showRequired) {
            return (
                <div className={cx({'required': true, 'minimal': props.styleType === 'minimal'})}
                     title='Поле обязательно для заполнения'
                />
            )
        }
    }

    const renderDate = () => {
        return null
        // if (props.showDate) {
        //     return (
        //         <div className={classes['date']}
        //              onMouseOver={() => setDateActive(true)}
        //              onMouseOut={() => setDateActive(false)}
        //         />
        //     )
        // }
    }

    const renderValidate = () => {
        if (props.showValidate) {
            return (
                <div className={cx({'validate': true, 'minimal': props.styleType === 'minimal'})}/>
            )
        }
    }

    const renderEye = () => {
        if (props.onPasswordEye) {
            return (
                <div className={cx({'eye_active': props.eye, 'eye': !props.eye, 'minimal': props.styleType === 'minimal'})}
                     onClick={props.onPasswordEye}
                     title={props.eye ? 'Скрыть пароль' : 'Показать пароль'}
                />
            )
        }
    }

    const renderError = () => {
        if (props.error) {
            return (
                <div className={classes['error-text']}>{props.errorText || 'Поле содержит ошибку'}</div>
            )
        }
    }

    const renderIcon = () => {
        if (props.icon) {
            return (
                <div className={classes['icon']}>
                    <FontAwesomeIcon icon={props.icon}/>
                </div>
            )
        }
    }

    const emptyValue = isEmptyValue()
    const showClear = isShowClear()
    const boxStyle = cx({
        'box': true,
        'minimal': props.styleType === 'minimal',
        'borderDisabled': props.styleType === 'borderDisabled',
        'error': props.error,
        'success': props.showValidate && !props.error,
        'read_only': props.readOnly,
        'show_clear': showClear,
        'place_holder': emptyValue
    })

    return (
        <div className={boxStyle}
             style={{
                 margin: props.margin,
                 width: props.width,
                 flexGrow: props.flexGrow ? 1 : undefined
             }}
             title={props.disableTitle ? undefined : (props.title || String(props.value) || props.placeHolder)}
             onClick={(props.readOnly || props.type === 'input') ? undefined : props.onChange.bind(this)}
        >
            {renderArrowLeft()}
            {renderIcon()}
            {renderInput()}
            {renderValidate()}
            {renderEye()}
            {renderClear()}
            {renderRequired()}
            {renderEdit()}
            {renderArrow()}
            {renderArrowRight()}
            {renderArrows()}
            {renderSelect()}
            {renderDate()}
            {renderError()}
        </div>
    )
})

Box.defaultProps = defaultProps
Box.displayName = 'Box'

export default Box