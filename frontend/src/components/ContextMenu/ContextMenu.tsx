import * as React from 'react'
import {openPopup, removePopup} from '../../helpers/popupHelper'
import {PopupDisplayOptions} from '../../@types/IPopup'
import DownloadLink from '../DownloadLink/DownloadLink'
import styles from './ContextMenu.module.scss'

interface Item {
    className: string
    hidden?: boolean
    readOnly?: boolean
    href?: string
    fileName?: string
    target?: '_self' | '_blank'
    title?: string
    text?: string
    module?: string

    onClick?(): void
}

interface Props {
    id: string
    menuItems: Item[]
    maxWidth?: number
    maxHeight?: number
    width?: number
}

const defaultProps: Props = {
    id: '',
    menuItems: [],
    maxWidth: 0,
    maxHeight: 400,
    width: 0
}

const ContextMenu: React.FC<Props> = (props) => {
    const close = () => {
        removePopup(props.id)
    }

    const closeContext = (e: any): void => {
        e.preventDefault()
        removePopup(props.id)
    }

    const style: React.CSSProperties = {
        maxWidth: props.maxWidth || undefined,
        maxHeight: props.maxHeight || undefined,
        overflowX: props.maxHeight ? 'auto' : undefined,
        width: props.width || undefined,
        minWidth: props.width ? undefined : 165
    }

    const renderList = () => {
        const id = Date.now() // Для генерации уникального key, чтоб небыло ошибок от реакта о использовании массива элементов
        const hasMenuClassMame = props.menuItems.filter(item => item.className && item.className !== 'separator').length > 0

        const handleClick = (e: any) => {
            e.stopPropagation()
        }

        return props.menuItems.map((menu, index) => {
            let menuStyle: React.CSSProperties = {
                paddingLeft: hasMenuClassMame ? 36 : 7
            }

            if (menu.hidden) {
                menuStyle = {
                    display: 'none'
                }
            }

            if (menu.readOnly) {
                menuStyle.color = '#ddd'
                menuStyle.cursor = 'default'
            }

            return (
                menu.href ?
                    menu.fileName ?
                        <DownloadLink key={`${id}-${index}`}
                                      className={menu.className}
                                      href={menu.href}
                                      target={menu.target}
                                      title={menu.title}
                                      download={menu.fileName}
                                      style={menuStyle}
                        >
                            {menu.text}
                        </DownloadLink>
                        :
                        <a key={`${id}-${index}`}
                           className={menu.className === 'separator' ? styles['separator'] : menu.className}
                           href={menu.href}
                           target={menu.target}
                           title={menu.title ? menu.title : menu.text}
                           style={menuStyle}
                        >
                            {menu.text}
                        </a>
                    :
                    <div
                        className={menu.className === 'separator' ? styles['separator'] : menu.className}
                        key={`${id}-${index}`}
                        onClick={menu.readOnly ? handleClick : menu.onClick}
                        onContextMenu={menu.onClick}
                        title={menu.title ? menu.title : menu.text}
                        style={menuStyle}
                    >
                        {menu.title || menu.text}
                    </div>
            )
        })
    }

    return (
        <div className={styles['normal']}
             onClick={close}
             onContextMenu={closeContext}
             style={style}
        >
            {renderList()}
        </div>
    )
}

ContextMenu.defaultProps = defaultProps
ContextMenu.displayName = 'ContextMenu'

export default function openContextMenu(e: any, menuItems: any[] = [], popupProps = {}, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    popupProps = {...popupProps, menuItems}

    return openPopup(ContextMenu, popupProps, undefined, e, displayOptions)
}