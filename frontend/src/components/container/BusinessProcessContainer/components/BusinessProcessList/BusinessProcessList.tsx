import React, {CSSProperties, useEffect, useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import classNames from 'classnames/bind'
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

    onSaveOrder(orderings: { [key: string]: number[] }): void
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
    onSaveOrder: (orderings: { [key: string]: number[] }) => {
        console.info('BusinessProcessList onSaveOrder', orderings)
    }
}

const cx = classNames.bind(classes)

const BusinessProcessList: React.FC<Props> = (props) => {
    const [businessProcesses, setBusinessProcesses] = useState<IBusinessProcessesBySteps>({} as IBusinessProcessesBySteps)

    useEffect(() => {
        const prepareBusinessProcesses: IBusinessProcessesBySteps = {} as IBusinessProcessesBySteps

        if (props.businessProcesses) {
            const sortBp = props.businessProcesses.sort((bpA: IBusinessProcess, bpB: IBusinessProcess) => bpA.ordering - bpB.ordering)

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
            ].map((businessProcess: IBusinessProcess, index: number) => {
                businessProcess.ordering = index

                return businessProcess
            })

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
            ].map((businessProcess: IBusinessProcess, index: number) => {
                businessProcess.ordering = index

                return businessProcess
            })

            updatedListBusinessProcesses = {
                ...businessProcesses,
                [`${source.droppableId}`]: sourceBusinessProcesses,
                [`${destination.droppableId}`]: destinationBusinessProcesses
            }
        }

        setBusinessProcesses(updatedListBusinessProcesses)

        const orderings: { [key: string]: number[] } = {}
        Object.keys(updatedListBusinessProcesses).forEach((step: string) => {
            if (updatedListBusinessProcesses[step] && updatedListBusinessProcesses[step].length) {
                orderings[step] = updatedListBusinessProcesses[step].map((bp: IBusinessProcess) => bp.id ? bp.id : 0)
            } else {
                orderings[step] = []
            }
        })

        props.onSaveOrder(orderings)
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