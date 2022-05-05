import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import FavoriteService from '../../../api/FavoriteService'
import BuildingList from '../../../components/BuildingList/BuildingList'
import {IBuilding} from '../../../@types/IBuilding'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './FavoritePagePanel.module.scss'

const FavoritePagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [favorites, setFavorites] = useState<number[]>([])
    const [fetchingFavorite, setFetchingFavorite] = useState(false)
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])

    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
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

    return (
        <main className={classes.FavoritePagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Избранное - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Избранное</span>
                </h1>
            </div>

            <BuildingList buildings={filterBuilding}
                          fetching={fetching || fetchingFavorite}
                          onSave={() => setIsUpdate(true)}
                          isFavorite={true}
            />
        </main>
    )
}

FavoritePagePanel.displayName = 'FavoritePagePanel'

export default FavoritePagePanel