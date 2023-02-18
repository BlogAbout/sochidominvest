import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getBuildingTypesText, getDistrictText, getPassedText} from '../../../../../helpers/buildingHelper'
import {RouteNames} from '../../../../helpers/routerHelper'
import {IBuilding} from '../../../../../@types/IBuilding'
import BuildingService from '../../../../../api/BuildingService'
import Wrapper from '../../../../components/ui/Wrapper/Wrapper'
import Title from '../../../../components/ui/Title/Title'
import Button from '../../../../components/form/Button/Button'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import BlockItem from '../../../../components/ui/BlockItem/BlockItem'
import classes from './SectionBuildings.module.scss'

const SectionBuildings: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [filteredBuildings, setFilteredBuildings] = useState<IBuilding[]>([])
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if (isUpdate) {
            setFetching(true)

            BuildingService.fetchBuildings({active: [1], publish: 1})
                .then((response: any) => {
                    setBuildings(response.data)
                })
                .catch((error: any) => {
                    console.error('Произошла ошибка загрузки данных', error)
                })
                .finally(() => {
                    setFetching(false)
                    setIsUpdate(false)
                })
        }
    }, [isUpdate])

    useEffect(() => {
        const listBuildings: IBuilding[] = []
        let i = 1

        for (let building of buildings) {
            if (i > 9) {
                break
            }

            listBuildings.push(building)
            i++
        }

        setFilteredBuildings(listBuildings)
    }, [buildings])

    return (
        <section className={classes.SectionBuildings}>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h2' style='center' className={classes.title}>Недвижимость</Title>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {filteredBuildings.length ?
                            filteredBuildings.map((building: IBuilding) => {
                                return (
                                    <BlockItem key={building.id}
                                               title={building.name}
                                               avatar={building.avatar || ''}
                                               address={building.address || ''}
                                               districtText={getDistrictText(building.district, building.districtZone)}
                                               date={building.dateCreated || undefined}
                                               type={getBuildingTypesText(building.type)}
                                               passed={getPassedText(building.passed)}
                                               isPassed={!!(building.passed && building.passed.is)}
                                               rentType={building.rentData ? building.rentData.type === 'short' ? '/в сутки' : '/в месяц' : undefined}
                                               rentCost={building.rentData && building.rentData.cost ? building.rentData.cost : undefined}
                                               countCheckers={building.countCheckers || undefined}
                                               buildingType={building.type}
                                               cost={building.type === 'building' ? (building.costMin || 0) : (building.cost || 0)}
                                               areaMin={building.type === 'building' ? (building.areaMin || 0) : (building.area || 0)}
                                               areaMax={building.type === 'building' ? (building.areaMax || 0) : undefined}
                                               cadastrNumber={building.type === 'land' ? building.cadastrNumber : null}
                                               isDisabled={!building.active}
                                               onContextMenu={() => {
                                               }}
                                               onClick={() => navigate(`${RouteNames.BUILDING}/${building.id}`)}
                                    />
                                )
                            })
                            : <Empty message='Нет объектов недвижимости'/>}
                    </BlockingElement>

                    <div className={classes.buttons}>
                        <Button type='apply' onClick={() => navigate(RouteNames.BUILDING)}>Покупка</Button>
                        <Button type='apply' onClick={() => navigate(RouteNames.RENT)}>Аренда</Button>
                    </div>
                </div>
            </Wrapper>
        </section>
    )
}

SectionBuildings.displayName = 'SectionBuildings'

export default SectionBuildings