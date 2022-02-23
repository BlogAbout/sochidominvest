import React, {CSSProperties} from 'react'
import classNames from 'classnames'
import {removePopup} from '../../helpers/popupHelper'
import classes from './Popup.module.scss'

interface PopupProps {
    className?: string
}

const defaultPopupProps: PopupProps = {
    className: ''
}

const cx = classNames.bind(classes)

const Popup: React.FC<PopupProps> = (props) => {
    const classList = cx({[`${props.className}`]: true}, classes.popup)

    return <div className={classList}>{props.children}</div>
}

Popup.defaultProps = defaultPopupProps

interface HeaderProps {
    popupId: string
    title: string
    icon?: string
    noClose?: boolean
    closeTitle?: string

    onClose?(): void
}

const defaultHeaderProps: HeaderProps = {
    popupId: '',
    title: 'Заголовок',
    closeTitle: 'Закрыть',
    noClose: false
}

const Header: React.FC<HeaderProps> = (props) => {
    const closePopup = () => {
        removePopup(props.popupId)
    }

    return (
        <div className={props.icon ? classes.header_big : classes.header}>
            {!props.icon ? null : <div className={props.icon}/>}

            {props.title !== '' && <div className={classes.title}>{props.title}</div>}

            <div className={classes.items}>{props.children}</div>

            {props.noClose ? null :
                <div className={classes.cross}
                     title={props.closeTitle}
                     onClick={props.onClose || closePopup.bind(this)} onMouseDown={e => e.stopPropagation()}
                />
            }
        </div>
    )
}

Header.defaultProps = defaultHeaderProps

interface ContentProps {
    className: string | null
    style?: CSSProperties
}

const defaultContentProps: ContentProps = {
    className: null
}

const Content: React.FC<ContentProps> = (props) => {
    const contentStyle = cx(classes.content, props.className)

    return (
        <div className={contentStyle} style={props.style}>{props.children}</div>
    )
}

Content.defaultProps = defaultContentProps

const Footer: React.FC = (props) => (
    <div className={classes.footer}>{props.children}</div>
)

const Left: React.FC = (props) => (
    <div className={classes.left}>{props.children}</div>
)

const Right: React.FC = (props) => (
    <div className={classes.right}>{props.children}</div>
)

export {
    Popup,
    Header,
    Footer,
    Content,
    Left,
    Right
}