import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IBusinessProcess} from '../../../../../@types/IBusinessProcess'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import Title from '../../../../../components/ui/Title/Title'
import BusinessProcessListContainer
    from '../../../../../components/container/BusinessProcessContainer/BusinessProcessContainer'
import openPopupBusinessProcessCreate
    from '../../../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import BusinessProcessService from '../../../../../api/BusinessProcessService'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './BusinessProcessPanel.module.scss'

const BusinessProcessPanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [filterBusinessProcesses, setFilterBusinessProcesses] = useState<IBusinessProcess[]>([])
    const [fetching, setFetching] = useState(false)

    const {users, role, fetching: fetchingUsers} = useTypedSelector(state => state.userReducer)
    const {
        businessProcesses,
        fetching: fetchingBusinessProcess
    } = useTypedSelector(state => state.businessProcessReducer)
    const {fetchUserList, fetchBusinessProcessList} = useActions()

    useEffect(() => {
        if (isUpdate || !businessProcesses || !businessProcesses.length) {
            fetchBusinessProcessList({active: [0, 1]})
        }

        if (isUpdate || !users || !users.length) {
            fetchUserList({active: [0, 1]})
        }

        setIsUpdate(false)
    }, [isUpdate])

    useEffect(() => {
        setFilterBusinessProcesses(businessProcesses)
    }, [businessProcesses])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    const onAddHandler = () => {
        openPopupBusinessProcessCreate(document.body, {
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    const onClickHandler = (businessProcess: IBusinessProcess) => {
        // Todo
    }

    const onEditHandler = (businessProcess: IBusinessProcess) => {
        openPopupBusinessProcessCreate(document.body, {
            businessProcess: businessProcess,
            onSave: () => {
                onSaveHandler()
            }
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
                                .then(() => {
                                    onSaveHandler()
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

    const onContextMenu = (e: React.MouseEvent, businessProcess: IBusinessProcess) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(businessProcess)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(businessProcess)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const onSaveOrder = (orderings: { [key: string]: number[] }) => {
        setFetching(true)

        BusinessProcessService.saveBusinessProcessOrdering(orderings)
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

    return (
        <main className={classes.BusinessProcessPanel}>
            <PageInfo title='Бизнес-процессы'/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Бизнес-процессы</Title>

                <BusinessProcessListContainer businessProcesses={filterBusinessProcesses}
                                              users={users}
                                              fetching={fetching || fetchingBusinessProcess || fetchingUsers}
                                              onClick={onClickHandler.bind(this)}
                                              onEdit={onEditHandler.bind(this)}
                                              onRemove={onRemoveHandler.bind(this)}
                                              onContextMenu={onContextMenu.bind(this)}
                                              onSaveOrder={onSaveOrder.bind(this)}
                />
            </div>
        </main>
    )
}

BusinessProcessPanel.displayName = 'BusinessProcessPanel'

export default BusinessProcessPanel