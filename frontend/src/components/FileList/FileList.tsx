import React, {CSSProperties, useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {IAttachment} from '../../@types/IAttachment'
import AttachmentService from '../../api/AttachmentService'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import openContextMenu from '../ContextMenu/ContextMenu'
import openPopupAttachmentCreate from '../popup/PopupAttachmentCreate/PopupAttachmentCreate'
import openPopupAlert from '../PopupAlert/PopupAlert'
import Empty from '../ui/Empty/Empty'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import classes from './FileList.module.scss'

interface Props {
    files: IAttachment[]
    selected?: number[]
    fetching: boolean
    isOnlyList?: boolean

    onSave(file: IAttachment): void

    onSelect?(attachment: IAttachment): void

    onUpdateOrdering?(attachments: IAttachment[]): void

    onRemove?(attachment: IAttachment): void

    onFullRemove?(attachment: IAttachment): void
}

const defaultProps: Props = {
    files: [],
    selected: [],
    fetching: false,
    isOnlyList: false,
    onSave: (file: IAttachment) => {
        console.info('FileList onSave', file)
    }
}

const cx = classNames.bind(classes)

const FileList: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    // Стили для перемещаемого элемента
    const getDragItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        userSelect: 'none',
        background: isDragging ? 'lightgreen' : undefined,
        ...draggableStyle
    })

    // Стили для списка перемещаемых элементов
    const getDragListStyle = (isDraggingOver: boolean) => {
        const styles: CSSProperties = {
            background: isDraggingOver ? 'lightblue' : undefined
        }

        return styles
    }

    const updateHandler = (file: IAttachment) => {
        openPopupAttachmentCreate(document.body, {
            attachment: file,
            onSave: props.onSave.bind(this)
        })
    }

    const removeHandler = (file: IAttachment) => {
        if (props.onRemove) {
            props.onRemove(file)
        } else {
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
                                        if (props.onFullRemove) {
                                            props.onFullRemove(file)
                                        }
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
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, file: IAttachment) => {
        e.preventDefault()

        const menuItems = [{
            text: 'Открыть',
            onClick: () => {
                window.open(`https://api.sochidominvest.ru/uploads/${file.type}/${file.content}`, '_blank')
            }
        }]

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => updateHandler(file)})

            if (['director', 'administrator'].includes(role) && !props.onRemove) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(file)})
            }
        }

        if (props.onRemove) {
            menuItems.push({text: 'Удалить из списка', onClick: () => removeHandler(file)})
        }

        openContextMenu(e, menuItems)
    }

    // Обработчик на завершение перемещения элемента (поля), когда отпустили
    const onDragEnd = (result: any) => {
        const {source, destination, draggableId} = result

        if (!destination) { // Бросили по пути
            return
        }

        const cloneFiles = [...props.files]

        const [removed] = cloneFiles.splice(source.index, 1)
        cloneFiles.splice(destination.index, 0, removed)

        if (props.onUpdateOrdering) {
            props.onUpdateOrdering(cloneFiles)
        }
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
                    <img src={'https://api.sochidominvest.ru/uploads/image/thumb/' + file.content}
                         alt={file.name || file.content}/>
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
                    props.isOnlyList ?
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId='default' direction='horizontal'>
                                {(provided, snapshot) => (
                                    <div className={classes.dnd}
                                         ref={provided.innerRef}
                                         style={getDragListStyle(snapshot.isDraggingOver)}
                                    >
                                        {props.files.map((file: IAttachment, index: number) => {
                                            return (
                                                <Draggable
                                                    key={file.id}
                                                    draggableId={file.id.toString()}
                                                    index={index}>
                                                    {(provided, snapshot) => (
                                                        <div key={file.id}
                                                             ref={provided.innerRef}
                                                             {...provided.draggableProps}
                                                             {...provided.dragHandleProps}
                                                             style={getDragItemStyle(
                                                                 snapshot.isDragging,
                                                                 provided.draggableProps.style
                                                             )}
                                                        >
                                                            {renderFile(file)}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        : props.files.map((file: IAttachment) => renderFile(file))
                    : <Empty message='Нет файлов для отображения'/>
                }
            </BlockingElement>
        </div>
    )
}

FileList.defaultProps = defaultProps
FileList.displayName = 'FileList'

export default FileList