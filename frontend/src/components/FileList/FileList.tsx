import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IAttachment} from '../../@types/IAttachment'
import AttachmentService from '../../api/AttachmentService'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import openContextMenu from '../ContextMenu/ContextMenu'
import openPopupAttachmentCreate from '../PopupAttachmentCreate/PopupAttachmentCreate'
import openPopupAlert from '../PopupAlert/PopupAlert'
import Empty from '../Empty/Empty'
import BlockingElement from '../BlockingElement/BlockingElement'
import classes from './FileList.module.scss'

interface Props {
    files: IAttachment[]
    selected?: number[]
    fetching: boolean

    onSave(file: IAttachment): void
    onSelect?(attachment: IAttachment): void
}

const defaultProps: Props = {
    files: [],
    selected: [],
    fetching: false,
    onSave: (file: IAttachment) => {
        console.info('FileList onSave', file)
    }
}

const cx = classNames.bind(classes)

const FileList: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    const updateHandler = (file: IAttachment) => {
        openPopupAttachmentCreate(document.body, {
            attachment: file,
            onSave: props.onSave.bind(this)
        })
    }

    const removeHandler = (file: IAttachment) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${file.name || file.content}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (file.id) {
                            setFetching(true)

                            AttachmentService.removeAttachment(file.id)
                                .then(() => {
                                    props.onSave(file)
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => {
                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, file: IAttachment) => {
        e.preventDefault()

        const menuItems = [{
            text: 'Открыть',
            onClick: () => {
                window.open(`https://api.sochidominvest.ru/uploads/${file.content}`, '_blank')
            }
        }]

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => updateHandler(file)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(file)})
            }
        }

        openContextMenu(e, menuItems)
    }

    const renderFileImage = (file: IAttachment, selected = false) => {
        return (
            <div key={file.id} className={cx({'item': true, [`${file.type}`]: true, 'selected': selected})}>
                <div className={classes.wrapper}
                     onClick={() => {
                         if (props.onSelect) {
                             props.onSelect(file)
                         }
                     }}
                     onContextMenu={(e: React.MouseEvent) => onContextMenu(e, file)}
                >
                    <img src={'https://api.sochidominvest.ru/uploads/thumbs/400/' + file.content} alt={file.name || file.content}/>
                </div>
            </div>
        )
    }

    const renderFileVideo = (file: IAttachment, selected = false) => {
        return (
            <div key={file.id} className={cx({'item': true, [`${file.type}`]: true, 'selected': selected})}>
                <div className={classes.wrapper}
                     onClick={() => {
                         if (props.onSelect) {
                             props.onSelect(file)
                         }
                     }}
                     onContextMenu={(e: React.MouseEvent) => onContextMenu(e, file)}
                >
                    <div className={classes.icon}>
                        <FontAwesomeIcon icon='video'/>
                    </div>

                    <div className={classes.text}>{file.name || file.content}</div>
                </div>
            </div>
        )
    }

    const renderFileDocument = (file: IAttachment, selected = false) => {
        return (
            <div key={file.id} className={cx({'item': true, [`${file.type}`]: true, 'selected': selected})}>
                <div className={classes.wrapper}
                     onClick={() => {
                         if (props.onSelect) {
                             props.onSelect(file)
                         }
                     }}
                     onContextMenu={(e: React.MouseEvent) => onContextMenu(e, file)}
                >
                    <div className={classes.icon}>
                        <FontAwesomeIcon icon='file'/>
                    </div>

                    <div className={classes.text}>{file.name || file.content}</div>
                </div>
            </div>
        )
    }

    const renderFile = (file: IAttachment) => {
        if (file.active === -1) {
            return null
        }

        const selected = !!(props.selected && props.selected.length && props.selected.includes(file.id))

        switch (file.type) {
            case 'image':
                return renderFileImage(file, selected)
            case 'video':
                return renderFileVideo(file, selected)
            case 'document':
                return renderFileDocument(file, selected)
            default:
                return null
        }
    }

    return (
        <div className={classes.FileList}>
            <BlockingElement fetching={props.fetching || fetching} className={classes.content}>
                {props.files && props.files.length ?
                    props.files.map((file: IAttachment) => renderFile(file))
                    : <Empty message='Нет файлов для отображения'/>
                }
            </BlockingElement>
        </div>
    )
}

FileList.defaultProps = defaultProps
FileList.displayName = 'FileList'

export default FileList