import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import * as Showdown from 'showdown'
import {useParams} from 'react-router-dom'
import {developerTypes} from '../../../helpers/developerHelper'
import {ISelector} from '../../../@types/ISelector'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IBuilding} from '../../../@types/IBuilding'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BuildingList from '../../../components/BuildingList/BuildingList'
import Preloader from '../../../components/Preloader/Preloader'
import classes from './DeveloperItemPagePanel.module.scss'

type DeveloperItemPagePanelParams = {
    id: string
}

const DeveloperItemPagePanel: React.FC = () => {
    const params = useParams<DeveloperItemPagePanelParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [isUpdateBuildings, setIsUpdateBuildings] = useState(false)
    const [developer, setDeveloper] = useState<IDeveloper>({} as IDeveloper)

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
            <BuildingList buildings={relationList}
                          fetching={fetchingDeveloperList || fetchingBuildingList}
                          onSave={() => setIsUpdateBuildings(true)}
            />
        )
    }

    const developerType = developerTypes.find((type: ISelector) => type.key === developer.type)

    return (
        <main className={classes.DeveloperItemPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
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