import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {agentTypes} from '../../../helpers/agentHelper'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {allowForRole, allowForTariff} from '../../helpers/accessHelper'
import {IAgent} from '../../../@types/IAgent'
import {IFilter, IFilterContent} from '../../../@types/IFilter'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import AgentService from '../../../api/AgentService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import AgentList from './components/AgentList/AgentList'
import AgentTill from './components/AgentTill/AgentTill'
import openPopupAgentCreate from '../../../components/popup/PopupAgentCreate/PopupAgentCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './AgentsPage.module.scss'

const AgentsPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [agents, setAgents] = useState<IAgent[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterAgent, setFilterAgent] = useState<IAgent[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['agent']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('agents'))

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchAgentsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [agents, filters])

    const fetchAgentsHandler = () => {
        setFetching(true)

        const filter: IFilter = {active: [0, 1]}

        if (user && user.id && user.role === 'subscriber' && allowForTariff(['base', 'business', 'effectivePlus'], user.tariff)) {
            filter.author = [user.id]
        }

        AgentService.fetchAgents(filter)
            .then((response: any) => setAgents(response.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchAgentsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!agents || !agents.length) {
            setFilterAgent([])
        }

        if (value !== '') {
            setFilterAgent(filterItemsHandler(agents.filter((agent: IAgent) => {
                return compareText(agent.name, value) || compareText(agent.address, value) || compareText(agent.phone, value.toLocaleLowerCase())
            })))
        } else {
            setFilterAgent(filterItemsHandler(agents))
        }
    }

    const onClickHandler = (agent: IAgent) => {
        navigate('/agent/' + agent.id)
    }

    const onAddHandler = () => {
        openPopupAgentCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование
    const onEditHandler = (agent: IAgent) => {
        openPopupAgentCreate(document.body, {
            agent: agent,
            onSave: () => onSaveHandler()
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
                                .then(() => onSaveHandler())
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

    // Открытие контекстного меню на элементе
    const onContextMenuHandler = (agent: IAgent, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [{text: 'Открыть', onClick: () => navigate('/agent/' + agent.id)}]

        if (allowForRole(['director', 'administrator', 'manager'])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(agent)})

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(agent)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('agents', value)
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IAgent[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IAgent) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: agentTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Агентства'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Агентства</Title>

                {layout === 'till'
                    ? <AgentTill list={filterAgent}
                                 fetching={fetching}
                                 onClick={(agent: IAgent) => onClickHandler(agent)}
                                 onContextMenu={(agent: IAgent, e: React.MouseEvent) => onContextMenuHandler(agent, e)}
                    />
                    : <AgentList list={filterAgent}
                                 fetching={fetching}
                                 onClick={(agent: IAgent) => onClickHandler(agent)}
                                 onContextMenu={(agent: IAgent, e: React.MouseEvent) => onContextMenuHandler(agent, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

AgentsPage.displayName = 'AgentsPage'

export default React.memo(AgentsPage)