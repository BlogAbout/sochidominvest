import React, {CSSProperties, useEffect, useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {bpSteps} from '../../../../../helpers/businessProcessHelper'
import {IUser} from '../../../../../@types/IUser'
import {IBusinessProcess, IBusinessProcessesBySteps} from '../../../../../@types/IBusinessProcess'
import BusinessProcessItem from './components/BusinessProcessItem/BusinessProcessItem'
import Title from '../../../../ui/Title/Title'
import classes from './BusinessProcessList.module.scss'

interface Props {
    businessProcesses: IBusinessProcess[]
    users: IUser[]
    fetching: boolean

    onClick(businessProcess: IBusinessProcess): void

    onEdit(businessProcess: IBusinessProcess): void

    onRemove(businessProcess: IBusinessProcess): void

    onContextMenu(e: React.MouseEvent, businessProcess: IBusinessProcess): void

    onSaveOrder(businessProcess: IBusinessProcess, ids: number[]): void
}

const defaultProps: Props = {
    businessProcesses: [],
    users: [],
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
    },
    onSaveOrder: (businessProcess: IBusinessProcess, ids: number[]) => {
        console.info('BusinessProcessList onSaveOrder', businessProcess, ids)
    }
}

const cx = classNames.bind(classes)

const BusinessProcessList: React.FC<Props> = (props) => {
    const [businessProcesses, setBusinessProcesses] = useState<IBusinessProcessesBySteps>({} as IBusinessProcessesBySteps)

    const {ordering} = useTypedSelector(state => state.businessProcessReducer)
    const {userId} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        const prepareBusinessProcesses: IBusinessProcessesBySteps = {} as IBusinessProcessesBySteps

        if (props.businessProcesses) {
            const sortBp = props.businessProcesses.sort((a: IBusinessProcess, b: IBusinessProcess) => {
                if (!a.id || !b.id) {
                    return -1
                }

                return ordering.indexOf(a.id) - ordering.indexOf(b.id)
            })

            Object.keys(bpSteps).forEach((step: string) => {
                prepareBusinessProcesses[`${step}`] = sortBp.filter((bp: IBusinessProcess) => bp.step === step)
            })
        }

        setBusinessProcesses(prepareBusinessProcesses)
    }, [props.businessProcesses])

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
        const {source, destination, draggableId} = result

        if (!destination) { // Бросили по пути
            return
        }

        const updateBusinessProcess = businessProcesses[source.droppableId].find((item: IBusinessProcess) => item.id == draggableId)

        if (!updateBusinessProcess) {
            return
        }

        let updatedListBusinessProcesses: IBusinessProcessesBySteps

        if (source.droppableId === destination.droppableId) { // Если внутри одного списка
            let prepareBusinessProcess: IBusinessProcess[] = [
                ...businessProcesses[destination.droppableId].slice(0, source.index),
                ...businessProcesses[destination.droppableId].slice(source.index + 1)
            ]

            prepareBusinessProcess = [
                ...prepareBusinessProcess.slice(0, destination.index),
                updateBusinessProcess,
                ...prepareBusinessProcess.slice(destination.index)
            ]

            updatedListBusinessProcesses = {
                ...businessProcesses,
                [`${destination.droppableId}`]: prepareBusinessProcess
            }
        } else { // Если разные списки
            updateBusinessProcess.step = destination.droppableId

            const sourceBusinessProcesses: IBusinessProcess[] = [
                ...businessProcesses[source.droppableId].slice(0, source.index),
                ...businessProcesses[source.droppableId].slice(source.index + 1)
            ]

            const destinationBusinessProcesses = [
                ...businessProcesses[destination.droppableId].slice(0, destination.index),
                updateBusinessProcess,
                ...businessProcesses[destination.droppableId].slice(destination.index)
            ]

            updatedListBusinessProcesses = {
                ...businessProcesses,
                [`${source.droppableId}`]: sourceBusinessProcesses,
                [`${destination.droppableId}`]: destinationBusinessProcesses
            }
        }

        setBusinessProcesses(updatedListBusinessProcesses)

        const ids: number[] = []
        Object.values(updatedListBusinessProcesses).forEach((businessProcesses: IBusinessProcess[]) => {
            businessProcesses.forEach((bp: IBusinessProcess) => {
                if (bp.id) {
                    ids.push(bp.id)
                }
            })
        })

        props.onSaveOrder(updateBusinessProcess, ids)
    }

    return (
        <div className={classes.BusinessProcessList}>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={classes.list}>
                    {Object.keys(bpSteps).map((step: string) => {
                        return (
                            <div key={step} className={cx({'board': true, [step]: true})}>
                                <Title type={2}>{bpSteps[step]}</Title>

                                <Droppable key={step} droppableId={step} direction='vertical'>
                                    {(provided, snapshot) => (
                                        <div className={classes.boardDnd}
                                             ref={provided.innerRef}
                                             style={getDragListStyle(snapshot.isDraggingOver)}
                                        >
                                            <div className={classes.boardList}>
                                                {businessProcesses[step] && businessProcesses[step].length ?
                                                    businessProcesses[step].map((businessProcess: IBusinessProcess, index: number) => {
                                                        if (businessProcess.author !== userId && businessProcess.responsible !== userId) {
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
                                                                            users={props.users}
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
                                                    })
                                                    : null
                                                }

                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
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