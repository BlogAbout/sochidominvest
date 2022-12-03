import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import Helmet from 'react-helmet'
import * as Showdown from 'showdown'
import {agentTypes} from '../../../../../helpers/agentHelper'
import {ISelector} from '../../../../../@types/ISelector'
import {IAgent} from '../../../../../@types/IAgent'
import {IBuilding} from '../../../../../@types/IBuilding'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import BuildingTill
    from '../../../../../components/container/BuildingListContainer/components/BuildingTill/BuildingTill'
import Preloader from '../../../../../components/Preloader/Preloader'
import openPopupBuildingCreate from '../../../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import BuildingService from '../../../../../api/BuildingService'
import FavoriteService from '../../../../../api/FavoriteService'
import CompilationService from '../../../../../api/CompilationService'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './AgentItemPagePanel.module.scss'

type AgentItemPagePanelParams = {
    id: string
}

const AgentItemPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const params = useParams<AgentItemPagePanelParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [isUpdateBuildings, setIsUpdateBuildings] = useState(false)
    const [agent, setAgent] = useState<IAgent>({} as IAgent)
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {agents, fetching: fetchingAgentList} = useTypedSelector(state => state.agentReducer)
    const {buildings, fetching: fetchingBuildingList} = useTypedSelector(state => state.buildingReducer)
    const {fetchAgentList, fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate || !agents.length) {
            fetchAgentList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const agentId = parseInt(params.id)
            const agentInfo = agents.find((agent: IAgent) => agent.id === agentId)

            if (agentInfo) {
                setAgent(agentInfo)
            }
        }
    }, [agents, params.id])

    useEffect(() => {
        if ((agent.id && (!buildings || !buildings.length)) || isUpdateBuildings) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdateBuildings(false)
        }
    }, [agent, isUpdateBuildings])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    const onClickHandler = (building: IBuilding) => {
        navigate('/panel/building/' + building.id)
    }

    // Редактирование объекта
    const onEditHandler = (building: IBuilding) => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление объекта
    const onRemoveHandler = (building: IBuilding) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${building.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (building.id) {
                            setFetching(true)

                            BuildingService.removeBuilding(building.id)
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

    // Удаление объекта из избранного
    const onRemoveBuildingFromFavoriteHandler = (building: IBuilding) => {
        if (building.id) {
            FavoriteService.removeFavorite(building.id)
                .then(() => {
                    onSaveHandler()
                })
                .catch((error: any) => {
                    console.error('Ошибка удаления из избранного', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }

    // Удаление объекта из подборки
    const onRemoveBuildingFromCompilationHandler = (building: IBuilding, compilationId?: number) => {
        if (compilationId && building.id) {
            CompilationService.removeBuildingFromCompilation(compilationId, building.id)
                .then(() => {
                    onSaveHandler()
                })
                .catch((error: any) => {
                    console.error('Ошибка удаления из подборки', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }

    // Открытие контекстного меню на элементе
    const onContextMenuItem = (e: React.MouseEvent, building: IBuilding) => {
        e.preventDefault()

        const menuItems = []

        // Todo
        // if (props.isFavorite) {
        //     menuItems.push({text: 'Удалить из избранного', onClick: () => removeBuildingFromFavorite()})
        // }
        //
        // if (props.compilationId && props.building.id) {
        //     menuItems.push({text: 'Удалить из подборки', onClick: () => removeBuildingFromCompilation()})
        // }

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(building)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(building)})
            }
        }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    })

    const renderBuildingsInfo = () => {
        if (!agent.buildings || !agent.buildings.length || !buildings || !buildings.length) {
            return null
        }

        const relationList = buildings.filter((building: IBuilding) => {
            return agent.buildings && building.active === 1 && building.id && agent.buildings.includes(building.id)
        })

        if (!relationList || !relationList.length) {
            return null
        }

        return (
            <BuildingTill buildings={relationList}
                          fetching={fetching || fetchingAgentList || fetchingBuildingList}
                          onClick={onClickHandler.bind(this)}
                          onEdit={onEditHandler.bind(this)}
                          onRemove={onRemoveHandler.bind(this)}
                          onContextMenu={onContextMenuItem.bind(this)}
                          onRemoveFromFavorite={onRemoveBuildingFromFavoriteHandler.bind(this)}
                          onRemoveFromCompilation={onRemoveBuildingFromCompilationHandler.bind(this)}
            />
        )
    }

    const agentType = agentTypes.find((type: ISelector) => type.key === agent.type)

    return (
        <main className={classes.AgentItemPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>
                    {!agent ? 'Агентства - СочиДомИнвест' : `${agent.name} - СочиДомИнвест`}
                </title>
                <meta name='description'
                      content={!agent || !agent.description ? '' : agent.description}
                />
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.block}>
                    {fetchingAgentList || fetchingBuildingList ? <Preloader/> : null}

                    <h1><span>{agent.name}</span></h1>

                    <h2>Информация</h2>

                    <div className={classes.info}>
                        <div className={classes.row}>
                            <span>Адрес</span>
                            <span>{agent.address}</span>
                        </div>

                        <div className={classes.row}>
                            <span>Телефон</span>
                            <span>{agent.phone}</span>
                        </div>

                        {agentType ?
                            <div className={classes.row}>
                                <span>Тип</span>
                                <span>{agentType.text}</span>
                            </div>
                            : null
                        }

                        <div className={classes.row}>
                            <span>Создано</span>
                            <span>{agent.dateCreated}</span>
                        </div>

                        <div className={classes.row}>
                            <span>Обновлено</span>
                            <span>{agent.dateUpdate}</span>
                        </div>
                    </div>

                    {agent.description ?
                        <div className={classes.description}>
                            <h2>Описание</h2>
                            <div dangerouslySetInnerHTML={{__html: converter.makeHtml(agent.description)}}/>
                        </div>
                        : null}
                </div>

                {renderBuildingsInfo()}
            </div>
        </main>
    )
}

AgentItemPagePanel.displayName = 'AgentItemPagePanel'

export default AgentItemPagePanel