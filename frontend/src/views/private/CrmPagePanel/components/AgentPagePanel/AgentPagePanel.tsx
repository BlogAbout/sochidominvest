import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IAgent} from '../../../../../@types/IAgent'
import {IFilterBase, IFilterContent} from '../../../../../@types/IFilter'
import AgentService from '../../../../../api/AgentService'
import {compareText} from '../../../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../../../helpers/utilHelper'
import Title from '../../../../../components/ui/Title/Title'
import FilterBase from '../../../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import AgentListContainer from '../../../../../components/container/AgentListContainer/AgentListContainer'
import SidebarLeft from '../../../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupAgentCreate from '../../../../../components/popup/PopupAgentCreate/PopupAgentCreate'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './AgentPagePanel.module.scss'

const AgentPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterAgent, setFilterAgent] = useState<IAgent[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({})
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('agents'))
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {agents, fetching: fetchingAgent} = useTypedSelector(state => state.agentReducer)
    const {fetchAgentList} = useActions()

    useEffect(() => {
        if (isUpdate || !agents.length) {
            fetchAgentList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [agents, selectedType, filters])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!agents || !agents.length) {
            setFilterAgent([])
        }

        if (value !== '') {
            setFilterAgent(filterItemsHandler(agents.filter((agent: IAgent) => {
                return (!selectedType.length || selectedType.includes(agent.type)) &&
                    (compareText(agent.name, value) || compareText(agent.address, value) || compareText(agent.phone, value.toLocaleLowerCase()))
            })))
        } else {
            setFilterAgent(filterItemsHandler(!selectedType.length ? agents : agents.filter((agent: IAgent) => selectedType.includes(agent.type))))
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('agents', value)
    }

    const onClickHandler = (agent: IAgent) => {
        navigate('/panel/crm/agent/' + agent.id)
    }

    // Добавление нового агентства
    const onAddHandler = () => {
        openPopupAgentCreate(document.body, {
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Редактирование
    const onEditHandler = (agent: IAgent) => {
        openPopupAgentCreate(document.body, {
            agent: agent,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (agent: IAgent) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${agent.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (agent.id) {
                            setFetching(true)

                            AgentService.removeAgent(agent.id)
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

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, agent: IAgent) => {
        e.preventDefault()

        const menuItems = [{text: 'Открыть', onClick: () => navigate('/panel/crm/agent/' + agent.id)}]

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(agent)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(agent)})
            }

            openContextMenu(e, menuItems)
        }
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IAgent[]) => {
        if (!list || !list.length) {
            return []
        }

        return list
        // Todo: Придумать фильтры
        // return list.filter((item: IAgent) => {
        //     return filters.block.includes(String(item.block))
        // })
    }

    const filtersContent: IFilterContent[] = []

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'constructionCompany',
            title: 'Строительные компании',
            icon: 'building-columns',
            active: selectedType.includes('constructionCompany'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.AgentPagePanel}>
            <PageInfo title='Агентства'/>

            <SidebarLeft filters={filtersContent}/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       activeLayout={layout}
                       layouts={['list', 'till']}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Агентства</Title>

                <AgentListContainer agents={filterAgent}
                                    fetching={fetching || fetchingAgent}
                                    layout={layout}
                                    onClick={onClickHandler.bind(this)}
                                    onEdit={onEditHandler.bind(this)}
                                    onRemove={onRemoveHandler.bind(this)}
                                    onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

AgentPagePanel.displayName = 'AgentPagePanel'

export default AgentPagePanel