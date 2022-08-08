import React, {CSSProperties} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {IBusinessProcess} from '../../../../../@types/IBusinessProcess'
import BusinessProcessItem from './components/BusinessProcessItem/BusinessProcessItem'
import Title from '../../../../ui/Title/Title'
import classes from './BusinessProcessList.module.scss'

interface Props {
    businessProcesses: IBusinessProcess[]
    fetching: boolean

    onClick(businessProcess: IBusinessProcess): void

    onEdit(businessProcess: IBusinessProcess): void

    onRemove(businessProcess: IBusinessProcess): void

    onContextMenu(e: React.MouseEvent, businessProcess: IBusinessProcess): void
}

const defaultProps: Props = {
    businessProcesses: [],
    fetching: false,
    onClick: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessList onClick', businessProcess)
    },
    onEdit: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessList onEdit', businessProcess)
    },
    onRemove: (businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessList onRemove', businessProcess)
    },
    onContextMenu: (e: React.MouseEvent, businessProcess: IBusinessProcess) => {
        console.info('BusinessProcessList onContextMenu', e, businessProcess)
    }
}

const BusinessProcessList: React.FC<Props> = (props) => {
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

    // Обработчик на завершение перемещения элемента (поля), когда отпустили
    const onDragEnd = (result: any) => {
        // Todo
        // const {source, destination, draggableId} = result
        //
        // if (!destination) { // Бросили по пути
        //     return
        // }
        //
        // const cloneFiles = [...props.files]
        //
        // const [removed] = cloneFiles.splice(source.index, 1)
        // cloneFiles.splice(destination.index, 0, removed)
        //
        // if (props.onUpdateOrdering) {
        //     props.onUpdateOrdering(cloneFiles)
        // }
    }

    const steps: { [key: string]: string } = {
        default: 'Общие',
        process: 'В работе',
        discussion: 'На обсуждении',
        complete: 'Завершены',
        rejected: 'Отклонены',
        waitingResponse: 'Ожидают ответа',
        final: 'Итог'
    }

    return (
        <div className={classes.BusinessProcessList}>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={classes.list}>
                    {Object.keys(steps).map((step: string) => {
                        return (
                            <Droppable key={step} droppableId={step} direction='vertical'>
                                {(provided, snapshot) => (
                                    <div className={classes.board}
                                         ref={provided.innerRef}
                                         style={getDragListStyle(snapshot.isDraggingOver)}
                                    >
                                        <Title type={2}>{steps[step]}</Title>

                                        <div className={classes.boardList}>
                                            {props.businessProcesses.map((businessProcess: IBusinessProcess, index: number) => {
                                                if (businessProcess.step !== step) {
                                                    return null
                                                }

                                                return (
                                                    <Draggable
                                                        key={businessProcess.id}
                                                        draggableId={businessProcess.id ? businessProcess.id.toString() : ''}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div key={businessProcess.id}
                                                                 ref={provided.innerRef}
                                                                 {...provided.draggableProps}
                                                                 {...provided.dragHandleProps}
                                                                 style={getDragItemStyle(
                                                                     snapshot.isDragging,
                                                                     provided.draggableProps.style
                                                                 )}
                                                            >
                                                                <BusinessProcessItem
                                                                    businessProcess={businessProcess}
                                                                    fetching={props.fetching}
                                                                    onClick={props.onClick}
                                                                    onEdit={props.onEdit}
                                                                    onRemove={props.onRemove}
                                                                    onContextMenu={props.onContextMenu}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}

                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        )
                    })}
                </div>
            </DragDropContext>
        </div>
    )
}

BusinessProcessList.defaultProps = defaultProps
BusinessProcessList.displayName = 'BusinessProcessList'

export default BusinessProcessList