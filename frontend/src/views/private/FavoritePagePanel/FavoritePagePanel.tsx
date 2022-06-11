import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import FavoriteService from '../../../api/FavoriteService'
import BuildingTill from '../../../components/container/BuildingListContainer/components/BuildingTill/BuildingTill'
import {IBuilding} from '../../../@types/IBuilding'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import BuildingService from '../../../api/BuildingService'
import CompilationService from '../../../api/CompilationService'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import Spacer from '../../../components/ui/Spacer/Spacer'
import classes from './FavoritePagePanel.module.scss'

const FavoritePagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [favorites, setFavorites] = useState<number[]>([])
    const [fetchingFavorite, setFetchingFavorite] = useState(false)
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {buildings, fetching: fetchingBuilding} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate || !buildings.length) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        setFetchingFavorite(true)

        FavoriteService.fetchFavorites()
            .then((response: any) => {
                setFavorites(response.data)
            })
            .catch((error: any) => {
                console.error('Ошибка загрузки избранного', error)
            })
            .finally(() => {
                setFetchingFavorite(false)
            })
    }, [isUpdate, buildings])

    useEffect(() => {
        if (favorites && favorites.length && buildings && buildings.length) {
            setFilterBuilding(buildings.filter((building: IBuilding) => building.id && favorites.includes(building.id)))
        } else {
            setFilterBuilding([])
        }
    }, [favorites])

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

        if (favorites && favorites.length && building.id && favorites.includes(building.id)) {
            menuItems.push({text: 'Удалить из избранного', onClick: () => onRemoveBuildingFromFavoriteHandler(building)})
        }

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
        <main className={classes.FavoritePagePanel}>
            <PageInfo title='Избранное'/>

            <div className={classes.Content}>
                <Title type={1}>Избранное</Title>

                <Spacer/>

                <BuildingTill buildings={filterBuilding}
                              fetching={fetching || fetchingBuilding || fetchingFavorite}
                              isFavorite={true}
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

FavoritePagePanel.displayName = 'FavoritePagePanel'

export default FavoritePagePanel