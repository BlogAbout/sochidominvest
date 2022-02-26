import React, {MouseEventHandler, useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './SearchBox.module.scss'

interface Props extends React.PropsWithChildren<any> {
    value?: string
    className?: string
    width?: string | number
    margin?: string | number
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    readOnly?: boolean
    showClear?: boolean
    disableTitle?: boolean
    autoFocus?: boolean,
    autoResult?: boolean
    countFind?: number | null // Количесво найденных объектов
    ignoreKeyDown?: boolean // Игнорируем нажатие Enter

    onChange(value: string, e: React.ChangeEvent<HTMLInputElement> | MouseEventHandler): string  // Функция отправляющая значение инпута

    onBlur?(e: React.ChangeEvent<HTMLInputElement>): void // Функция, вызываемая при потери фокуса

    customFunc?(value: string): void // Функция, вызываемая при нажатии Enter
}

const defaultProps: Props = {
    value: '',
    autoFocus: false,
    autoResult: true,
    countFind: null, // null для отключения, цифры для показа
    width: 'auto',
    margin: '',
    flexGrow: false,
    placeHolder: 'Поиск',
    title: '',
    readOnly: false,
    showClear: false,
    disableTitle: false,
    ignoreKeyDown: false,
    onChange(value: string, e: React.ChangeEvent<HTMLInputElement>): string {
        return e.target.value
    }
}

const cx = classNames.bind(classes)

const SearchBox = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [search, setSearch] = useState({
        active: false,
        value: ''
    })

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.autoResult) {
            props.onChange(e.target.value, e)
        } else {
            setSearch({...search, value: e.target.value})
        }
    }

    const onClearHandler = (e: any) => {
        if (props.autoResult) {
            props.onChange('', e)
        } else {
            setSearch({...search, value: ''})
            changeActive(false, e)
        }
    }

    const onKeyDown = (e: any) => {
        const keyCode = e.keyCode || e.charCode

        if (keyCode === 13) {
            if (props.ignoreKeyDown) {
                if (props.customFunc && props.value) {
                    props.customFunc(props.value)
                }
            } else {
                changeActive(false, e)
                e.preventDefault()
            }
        }
    }

    const changeActive = (active: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!active && props.onBlur) {
            props.onBlur(e)
        }

        if (active === search.active) {
            return false
        }

        setSearch({...search, active: active})
    }

    let text = props.value || props.placeHolder
    let title = props.disableTitle ? null : (props.title || text)
    let disabled = !props.value || props.readOnly
    let value = props.autoResult ? props.value : search.value

    return (
        <div
            className={props.className ? cx(props.className, classes['search_wrapper']) : classes['search_wrapper']}
            style={{
                width: props.width,
                margin: props.margin,
                flexGrow: props.flexGrow ? 1 : '',
                cursor: props.readOnly ? 'default' : 'pointer',
            }}
            title={title || ''}
        >
            <div className={classes['ico_search']}>
                <FontAwesomeIcon icon='magnifying-glass' />
            </div>

            <input className={classes['input_search']}
                   value={value}
                   placeholder={props.placeHolder}
                   onChange={onChangeHandler.bind(this)}
                   onFocus={changeActive.bind(this, true)}
                   onBlur={changeActive.bind(this, false)}
                   autoFocus={props.autoFocus}
                   readOnly={props.readOnly}
                   onKeyDown={onKeyDown}
            />

            {props.countFind === null ? null : <div className={classes['count_find']}>Найдено: {props.countFind}</div>}

            {(disabled || !props.showClear) ? null :
                <div className={classes['cross']}
                     title='Очистить'
                     onClick={onClearHandler.bind(this)}
                />
            }
        </div>
    )
})

SearchBox.defaultProps = defaultProps
SearchBox.displayName = 'SearchBox'

export default SearchBox