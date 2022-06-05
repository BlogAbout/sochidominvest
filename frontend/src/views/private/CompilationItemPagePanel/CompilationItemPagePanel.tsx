import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import Helmet from 'react-helmet'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IBuilding} from '../../../@types/IBuilding'
import {ICompilation} from '../../../@types/ICompilation'
import BuildingTill from '../../../components/container/BuildingListContainer/components/BuildingTill/BuildingTill'
import openPopupBuildingCreate from '../../../components/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import BuildingService from '../../../api/BuildingService'
import FavoriteService from '../../../api/FavoriteService'
import CompilationService from '../../../api/CompilationService'
import Title from '../../../components/ui/Title/Title'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './CompilationItemPagePanel.module.scss'

type CompilationItemPagePanelParams = {
    id: string
}

const CompilationItemPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const params = useParams<CompilationItemPagePanelParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [compilation, setCompilation] = useState<ICompilation>({} as ICompilation)
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching: fetchingBuilding} = useTypedSelector(state => state.buildingReducer)
    const {compilations, fetching: fetchingCompilation} = useTypedSelector(state => state.compilationReducer)
    const {fetchBuildingList, fetchCompilationList} = useActions()

    useEffect(() => {
        if (isUpdate || !compilations.length) {
            fetchCompilationList()

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (compilations && compilations.length && params.id) {
            const compilationId = parseInt(params.id)
            const compilationInfo = compilations.find((compilation: ICompilation) => compilation.id === compilationId)

            if (compilationInfo) {
                setCompilation(compilationInfo)
            }
        }
    }, [compilations])

    useEffect(() => {
        fetchBuildingList({active: [0, 1]})
    }, [compilation])

    useEffect(() => {
        if (buildings && buildings.length && compilation.buildings && compilation.buildings.length) {
            setFilterBuilding(buildings.filter((building: IBuilding) => building.id && compilation.buildings && compilation.buildings.includes(building.id)))
        } else {
            setFilterBuilding([])
        }
    }, [buildings])

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

    return (
        <main className={classes.CompilationItemPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>
                    {!compilation ? 'Подборки - СочиДомИнвест' : `${compilation.name} - СочиДомИнвест`}
                </title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <Title type={1}>{compilation.name}</Title>

                <BuildingTill buildings={filterBuilding}
                              fetching={fetching || fetchingBuilding || fetchingCompilation}
                              compilationId={compilation.id}
                              onClick={onClickHandler.bind(this)}
                              onEdit={onEditHandler.bind(this)}
                              onRemove={onRemoveHandler.bind(this)}
                              onContextMenu={onContextMenuItem.bind(this)}
                              onRemoveFromFavorite={onRemoveBuildingFromFavoriteHandler.bind(this)}
                              onRemoveFromCompilation={onRemoveBuildingFromCompilationHandler.bind(this)}
                />
            </div>
        </main>
    )
}

CompilationItemPagePanel.displayName = 'CompilationItemPagePanel'

export default CompilationItemPagePanel