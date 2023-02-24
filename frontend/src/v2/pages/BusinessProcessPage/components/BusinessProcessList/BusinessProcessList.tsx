import React, {CSSProperties, useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import classNames from 'classnames/bind'
import {IBusinessProcess, IBusinessProcessesBySteps} from '../../../../../@types/IBusinessProcess'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {getUserName} from '../../../../../helpers/userHelper'
import {bpSteps, getBpTypesText} from '../../../../../helpers/businessProcessHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import BusinessProcessService from '../../../../../api/BusinessProcessService'
import Title from '../../../../../components/ui/Title/Title'
import Preloader from '../../../../../components/ui/Preloader/Preloader'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupBusinessProcessCreate
    from '../../../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import classes from './BusinessProcessList.module.scss'

interface Props {
    list: IBusinessProcess[]
    ordering: number[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    ordering: [],
    fetching: false,
    onSave: () => {
        console.info('BusinessProcessList onSave')
    }
}

const cx = classNames.bind(classes)

const BusinessProcessList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)
    const [businessProcesses, setBusinessProcesses] = useState<IBusinessProcessesBySteps>({} as IBusinessProcessesBySteps)

    const {userId, users} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        const prepareBusinessProcesses: IBusinessProcessesBySteps = {} as IBusinessProcessesBySteps

        if (props.list) {
            const sortBp = props.list.sort((a: IBusinessProcess, b: IBusinessProcess) => {
                if (!a.id || !b.id) {
                    return -1
                }

                return props.ordering.indexOf(a.id) - props.ordering.indexOf(b.id)
            })

            Object.keys(bpSteps).forEach((step: string) => {
                prepareBusinessProcesses[`${step}`] = sortBp.filter((bp: IBusinessProcess) => bp.step === step)
            })
        }

        setBusinessProcesses(prepareBusinessProcesses)
    }, [props.list])

    const onEditHandler = (businessProcess: IBusinessProcess) => {
        openPopupBusinessProcessCreate(document.body, {
            businessProcess: businessProcess,
            onSave: () => props.onSave()
        })
    }

    const onRemoveHandler = (businessProcess: IBusinessProcess) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${businessProcess.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (businessProcess.id) {
                            setFetching(true)

                            BusinessProcessService.removeBusinessProcess(businessProcess.id)
                                .then(() => props.onSave())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const onSaveOrder = (businessProcess: IBusinessProcess, ids: number[]) => {
        setFetching(true)

        BusinessProcessService.saveBusinessProcessOrdering(businessProcess, ids)
            .then(() => {

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

    const onContextMenuHandler = (businessProcess: IBusinessProcess, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(businessProcess)}]

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(businessProcess)})
            }

            openContextMenu(e, menuItems)
        }
    }

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

        onSaveOrder(updateBusinessProcess, ids)
    }

    return (
        <div className={classes.BusinessProcessList}>
            {props.fetching || fetching ? <Preloader/> : null}

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
                                                                        <div className={classes.BusinessProcessItem}
                                                                             onClick={() => {
                                                                             }}
                                                                             onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(businessProcess, e)}
                                                                        >
                                                                            <div className={classes.meta}>
                                                                                <div
                                                                                    className={classes.id}>#{businessProcess.id}</div>
                                                                                <div
                                                                                    className={classes.dateCreated}>{getFormatDate(businessProcess.dateCreated)}</div>
                                                                            </div>
                                                                            <div
                                                                                className={classes.name}>{businessProcess.name}</div>
                                                                            <div className={classes.info} title='Тип'>
                                                                                <FontAwesomeIcon icon='star'/>
                                                                                <span>{getBpTypesText(businessProcess.type)}</span>
                                                                            </div>
                                                                            <div className={classes.info}
                                                                                 title='Ответственный'>
                                                                                <FontAwesomeIcon icon='user'/>
                                                                                <span>{getUserName(users, businessProcess.responsible)}</span>
                                                                            </div>
                                                                        </div>
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

export default React.memo(BusinessProcessList)