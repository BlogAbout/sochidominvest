import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {RouteNames} from '../../helpers/routerHelper'
import {ICompilation} from '../../../@types/ICompilation'
import {IBuilding} from '../../../@types/IBuilding'
import {IMailing} from '../../../@types/IMailing'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import BuildingService from '../../../api/BuildingService'
import FavoriteService from '../../../api/FavoriteService'
import CompilationService from '../../../api/CompilationService'
import BuildingTill from '../BuildingsPanelPage/components/BuildingTill/BuildingTill'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import openPopupBuildingCreate from '../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openPopupMailingCreate from '../../../components/popup/PopupMailingCreate/PopupMailingCreate'
import classes from './CompilationPage.module.scss'

type CompilationItemPagePanelParams = {
    id: string
}

const CompilationPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const params = useParams<CompilationItemPagePanelParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [compilation, setCompilation] = useState<ICompilation>({} as ICompilation)
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    const {userId, role} = useTypedSelector(state => state.userReducer)
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
        navigate(`${RouteNames.BUILDING}/${building.id}`)
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
    const onContextMenuItem = (building: IBuilding, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = []

        if (params.id) {
            const compilationId = parseInt(params.id)

            menuItems.push({
                text: 'Удалить из подборки',
                onClick: () => onRemoveBuildingFromCompilationHandler(building, compilationId)
            })
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

    const onAddHandler = () => {
        if (!compilation.id) {
            return
        }

        const mailing: IMailing = {
            id: null,
            name: '',
            content: compilation.id.toString(),
            contentHtml: '',
            type: 'compilation',
            author: userId,
            active: 1,
            status: 0,
            countRecipients: 0
        }

        openPopupMailingCreate(document.body, {
            mailing: mailing,
            onSave: () => {
                navigate(RouteNames.P_MAILING)
            }
        })
    }

    return (
        <PanelView pageTitle={compilation.name}>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       addText='Создать рассылку'
                       className={classes.title}
                >{compilation.name}</Title>

                <BuildingTill list={filterBuilding}
                              fetching={fetching || fetchingBuilding || fetchingCompilation}
                              onClick={(building: IBuilding) => onClickHandler(building)}
                              onContextMenu={(building: IBuilding, e: React.MouseEvent) => onContextMenuItem(building, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

CompilationPage.displayName = 'CompilationPage'

export default React.memo(CompilationPage)