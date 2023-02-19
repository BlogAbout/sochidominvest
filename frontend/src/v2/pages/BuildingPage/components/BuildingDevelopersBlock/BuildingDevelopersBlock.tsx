import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getDeveloperTypeText} from '../../../../../helpers/developerHelper'
import {RouteNames} from '../../../../helpers/routerHelper'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import {IBuilding} from '../../../../../@types/IBuilding'
import {IFilter} from '../../../../../@types/IFilter'
import DeveloperService from '../../../../../api/DeveloperService'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../../../components/Empty/Empty'
import Title from '../../../../components/ui/Title/Title'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import classes from './BuildingDevelopersBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingDevelopersBlock: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [developers, setDevelopers] = useState<IDeveloper[]>([])

    useEffect(() => {
        onFetchDevelopers()
    }, [props.building.developers])

    const onFetchDevelopers = (): void => {
        if (!props.building || !props.building.id || !props.building.developers || !props.building.developers.length) {
            return
        }

        setFetching(true)

        const filter: IFilter = {
            active: [0, 1],
            id: props.building.developers
        }

        DeveloperService.fetchDevelopers(filter)
            .then((response: any) => setDevelopers(response.data))
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetching(false))
    }

    return (
        <BlockingElement fetching={fetching} className={classes.BuildingDevelopersBlock}>
            <Title type='h2'>Застройщик</Title>

            {props.building.developers && props.building.developers.length && developers && developers.length ?
                <div className={classes.list}>
                    {developers.map((developer: IDeveloper) => {
                        return (
                            <div key={developer.id}>
                                <span>
                                    <Link to={`${RouteNames.P_DEVELOPER}/${developer.id}`}>
                                        {developer.name}
                                    </Link>
                                </span>
                                <span>{getDeveloperTypeText(developer.type)}</span>
                            </div>
                        )
                    })}
                </div>
                : <Empty message='Отсутствует информация о застройщике'/>
            }
        </BlockingElement>
    )
}

BuildingDevelopersBlock.defaultProps = defaultProps
BuildingDevelopersBlock.displayName = 'BuildingDevelopersBlock'

export default BuildingDevelopersBlock