import React, {useEffect, useState} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../@types/IPopup'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import Button from '../Button/Button'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Content} from '../Popup/Popup'
import styles from './PopupAlert.module.scss'

interface ButtonProps {
    text: string // Текст кнопки, обязательный параметр
    onClick?(e: any): void // Функция при нажатии кнопки
}

interface Props extends PopupProps {
    prompt?: boolean // Отображать поле вопроса
    promptRequired?: boolean // Требовать ответа на вопрос
    promptPlaceholder?: string // Placeholder textarea
    confirm?: boolean // Попап в виде вопроса (ок, отмена) или просто ок.
    title?: string // Заголовок
    text?: string | object // текст вопроса
    autoClose?: boolean // Закрывать попап при клике на затемнение? при закрытии будет вызвана функция onCancel
    maxWidth?: number
    maxHeight?: number
    width?: number
    buttons?: ButtonProps[] // Массив кнопок для вывода. При подаче массива, отключатся встроенные кнопки ок, отмена
    onOk?(result?: string, e?: any): void // Функция при нажатии ок
    onCancel?(): void // Функция при нажатии отмена
}

const defaultProps: Props = {
    id: '',
    blockId: '',
    prompt: false,
    promptRequired: true,
    promptPlaceholder: 'Введите текст',
    confirm: false,
    title: 'Внимание',
    maxHeight: 500,
    width: 0
}

const PopupAlert: React.FC<Props> = (props) => {
    const [promptResult, setPromptResult] = useState('')
    let clicked = false

    useEffect(() => {
        return () => {
            let cancelFunction = props.onCancel

            // Если это простой алерт с одной кнопкой ОК, тогда кнопка ОК будет вызываться и при закрытии попапа
            if (!cancelFunction && !props.prompt && !props.confirm && !props.buttons) {
                cancelFunction = props.onOk
            }
            if (!clicked && cancelFunction) {
                cancelFunction()
            }

            removePopup(props.blockId ? props.blockId : '') // Удаление окна блокировки при закрытии основного окна
        }
    }, [])

    const close = () => {
        clicked = true
        removePopup(props.id ? props.id : '')
    }

    const handlerOnClick = (func: any, e: any) => {
        if (func) {
            func(e)
        }

        close()
    }

    const getButtons = () => {
        let buttons = []
        if (props.prompt) {
            buttons.push({
                text: 'OK',
                onClick: (e: any) => {
                    if (props.promptRequired && !promptResult.trim()) {
                        return false
                    }

                    if (props.onOk) {
                        props.onOk(promptResult, e)
                    }

                    close()
                }
            })
        } else if (props.buttons) {
            buttons = props.buttons
            buttons.forEach(button => button.onClick = handlerOnClick.bind(this, button.onClick))
        } else {
            buttons.push({
                text: 'OK',
                onClick: handlerOnClick.bind(this, props.onOk)
            })
        }

        if (props.confirm || props.prompt) {
            buttons.push({
                text: 'Отмена',
                onClick: handlerOnClick.bind(this, props.onCancel)
            })
        }

        return buttons
    }

    let buttons = getButtons().map((button, index) => {
        return (
            <Button key={props.id + '-' + index} type={'regular'}
                    onClick={button.onClick ? button.onClick : close.bind(this)}
            >{button.text}</Button>
        )
    })

    const handlePromptChange = (e: any) => {
        setPromptResult(e.target.value)
    }

    return (
        <div className={styles['popup']}>
            <div className={styles['title']}>
                {props.title}
                <div className={styles['title-close']} onClick={close.bind(this)}/>
            </div>

            <Content className={styles['content']}>
                {props.text ? <div className={styles['text']}>{props.text}</div> : null}

                {props.prompt ?
                    <textarea
                        className={styles['text-area']}
                        placeholder={props.promptPlaceholder}
                        style={{borderColor: props.promptRequired && !promptResult.trim() ? '#ac4747' : '#e8e8e8'}}
                        onChange={handlePromptChange}
                        value={promptResult}
                    />
                    : null}
            </Content>

            <div className={styles['footer']}>{buttons}</div>
        </div>
    )
}

PopupAlert.defaultProps = defaultProps

export default function openPopupAlert(target: any, popupProps: Props = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: popupProps.autoClose || false,
        center: true
    }
    const blockId = showBackgroundBlock(target, popupProps, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupAlert, popupProps, undefined, block, displayOptions)
}