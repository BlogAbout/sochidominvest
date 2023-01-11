import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {allowForRole} from '../../helpers/accessHelper'
import {RouteNames} from '../../helpers/routerHelper'
import {IBuilding} from '../../../@types/IBuilding'
import FavoriteService from '../../../api/FavoriteService'
import BuildingService from '../../../api/BuildingService'
import CompilationService from '../../../api/CompilationService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import BuildingTill from '../BuildingsPanelPage/components/BuildingTill/BuildingTill'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './FavoritePage.module.scss'

const FavoritePage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [favorites, setFavorites] = useState<number[]>([])
    const [fetchingFavorite, setFetchingFavorite] = useState(false)
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    const {buildings, fetching: fetchingBuilding} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        fetchBuildingsHandler()
    }, [])

    useEffect(() => {
        setFetchingFavorite(true)

        FavoriteService.fetchFavorites()
            .then((response: any) => setFavorites(response.data))
            .catch((error: any) => {
                console.error('Ошибка загрузки избранного', error)
            })
            .finally(() => setFetchingFavorite(false))
    }, [buildings])

    useEffect(() => {
        if (favorites && favorites.length && buildings && buildings.length) {
            setFilterBuilding(buildings.filter((building: IBuilding) => building.id && favorites.includes(building.id)))
        } else {
            setFilterBuilding([])
        }
    }, [favorites])

    const fetchBuildingsHandler = () => {
        fetchBuildingList({active: [0, 1]})
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchBuildingsHandler()
    }

    const onClickHandler = (building: IBuilding) => {
        navigate(`${RouteNames.BUILDING}/${building.id}`)
    }

    // Редактирование объекта
    const onEditHandler = (building: IBuilding) => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => onSaveHandler()
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

    // Удаление объекта из избранного
    const onRemoveBuildingFromFavoriteHandler = (building: IBuilding) => {
        if (building.id) {
            FavoriteService.removeFavorite(building.id)
                .then(() => onSaveHandler())
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
                .then(() => onSaveHandler())
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
    const onContextMenuItemHandler = (building: IBuilding, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = []

        if (favorites && favorites.length && building.id && favorites.includes(building.id)) {
            menuItems.push({
                text: 'Удалить из избранного',
                onClick: () => onRemoveBuildingFromFavoriteHandler(building)
            })
        }

        if (allowForRole(['director', 'administrator', 'manager'])) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(building)})

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(building)})
            }
        }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    return (
        <PanelView pageTitle='Избранное'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Избранное</Title>

                <BuildingTill list={filterBuilding}
                              fetching={fetching || fetchingBuilding || fetchingFavorite}
                              onClick={(building: IBuilding) => onClickHandler(building)}
                              onContextMenu={(building: IBuilding, e: React.MouseEvent) => onContextMenuItemHandler(building, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

FavoritePage.displayName = 'FavoritePage'

export default React.memo(FavoritePage)