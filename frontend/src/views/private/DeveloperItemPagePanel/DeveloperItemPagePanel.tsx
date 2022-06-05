import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Helmet from 'react-helmet'
import * as Showdown from 'showdown'
import {useParams} from 'react-router-dom'
import {developerTypes} from '../../../helpers/developerHelper'
import {ISelector} from '../../../@types/ISelector'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IBuilding} from '../../../@types/IBuilding'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BuildingTill from '../../../components/container/BuildingListContainer/components/BuildingTill/BuildingTill'
import Preloader from '../../../components/Preloader/Preloader'
import classes from './DeveloperItemPagePanel.module.scss'
import openPopupBuildingCreate from "../../../components/PopupBuildingCreate/PopupBuildingCreate";
import openPopupAlert from "../../../components/PopupAlert/PopupAlert";
import BuildingService from "../../../api/BuildingService";
import FavoriteService from "../../../api/FavoriteService";
import CompilationService from "../../../api/CompilationService";
import openContextMenu from "../../../components/ContextMenu/ContextMenu";

type DeveloperItemPagePanelParams = {
    id: string
}

const DeveloperItemPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const params = useParams<DeveloperItemPagePanelParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [isUpdateBuildings, setIsUpdateBuildings] = useState(false)
    const [developer, setDeveloper] = useState<IDeveloper>({} as IDeveloper)
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {developers, fetching: fetchingDeveloperList} = useTypedSelector(state => state.developerReducer)
    const {buildings, fetching: fetchingBuildingList} = useTypedSelector(state => state.buildingReducer)
    const {fetchDeveloperList, fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate || !developers.length) {
            fetchDeveloperList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const developerId = parseInt(params.id)
            const developerInfo = developers.find((developer: IDeveloper) => developer.id === developerId)

            if (developerInfo) {
                setDeveloper(developerInfo)
            }
        }
    }, [developers, params.id])

    useEffect(() => {
        if ((developer.id && (!buildings || !buildings.length)) || isUpdateBuildings) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdateBuildings(false)
        }
    }, [developer, isUpdateBuildings])

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
        if (!developer.buildings || !developer.buildings.length || !buildings || !buildings.length) {
            return null
        }

        const relationList = buildings.filter((building: IBuilding) => {
            return developer.buildings && building.active === 1 && building.id && developer.buildings.includes(building.id)
        })

        if (!relationList || !relationList.length) {
            return null
        }

        return (
            <BuildingTill buildings={relationList}
                          fetching={fetching || fetchingDeveloperList || fetchingBuildingList}
                          onClick={onClickHandler.bind(this)}
                          onEdit={onEditHandler.bind(this)}
                          onRemove={onRemoveHandler.bind(this)}
                          onContextMenu={onContextMenuItem.bind(this)}
                          onRemoveFromFavorite={onRemoveBuildingFromFavoriteHandler.bind(this)}
                          onRemoveFromCompilation={onRemoveBuildingFromCompilationHandler.bind(this)}
            />
        )
    }

    const developerType = developerTypes.find((type: ISelector) => type.key === developer.type)

    return (
        <main className={classes.DeveloperItemPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>
                    {!developer ? 'Застройщики - СочиДомИнвест' : `${developer.name} - СочиДомИнвест`}
                </title>
                <meta name='description'
                      content={!developer || !developer.description ? '' : developer.description}
                />
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.block}>
                    {fetchingDeveloperList || fetchingBuildingList ? <Preloader/> : null}

                    <h1><span>{developer.name}</span></h1>

                    <h2>Информация</h2>

                    <div className={classes.info}>
                        <div className={classes.row}>
                            <span>Адрес</span>
                            <span>{developer.address}</span>
                        </div>

                        <div className={classes.row}>
                            <span>Телефон</span>
                            <span>{developer.phone}</span>
                        </div>

                        {developerType ?
                            <div className={classes.row}>
                                <span>Тип</span>
                                <span>{developerType.text}</span>
                            </div>
                            : null
                        }

                        <div className={classes.row}>
                            <span>Создано</span>
                            <span>{developer.dateCreated}</span>
                        </div>

                        <div className={classes.row}>
                            <span>Обновлено</span>
                            <span>{developer.dateUpdate}</span>
                        </div>
                    </div>

                    {developer.description ?
                        <div className={classes.description}>
                            <h2>Описание</h2>
                            <div dangerouslySetInnerHTML={{__html: converter.makeHtml(developer.description)}}/>
                        </div>
                        : null}
                </div>

                {renderBuildingsInfo()}
            </div>
        </main>
    )
}

DeveloperItemPagePanel.displayName = 'DeveloperItemPagePanel'

export default DeveloperItemPagePanel