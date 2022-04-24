import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IBuilding} from '../../../@types/IBuilding'
import {ICompilation} from '../../../@types/ICompilation'
import BuildingList from '../../../components/BuildingList/BuildingList'
import classes from './CompilationItemPagePanel.module.scss'

type CompilationItemPagePanelParams = {
    id: string
}

const CompilationItemPagePanel: React.FC = () => {
    const params = useParams<CompilationItemPagePanelParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [compilation, setCompilation] = useState<ICompilation>({} as ICompilation)
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])

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

    return (
        <main className={classes.CompilationItemPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>
                    {!compilation ? 'Подборки - СочиДомИнвест' : `${compilation.name} - СочиДомИнвест`}
                </title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1><span>{compilation.name}</span></h1>
            </div>

            <BuildingList buildings={filterBuilding}
                          fetching={fetchingBuilding || fetchingCompilation}
                          onSave={() => setIsUpdate(true)}
                          compilationId={compilation.id}
            />
        </main>
    )
}

CompilationItemPagePanel.displayName = 'CompilationItemPagePanel'

export default CompilationItemPagePanel