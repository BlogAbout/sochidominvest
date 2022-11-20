import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Wrapper from '../../../../components/ui/Wrapper/Wrapper'
import {IBuilding} from '../../../../../@types/IBuilding'
import BuildingService from '../../../../../api/BuildingService'
import Title from '../../../../components/ui/Title/Title'
import Button from '../../../../components/form/Button/Button'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import BuildingItem from '../../../BuildingsPage/components/BuildingItem/BuildingItem'
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
                                    <BuildingItem key={building.id}
                                                  building={building}
                                                  onClick={() => navigate('/building/' + building.id)}
                                    />
                                )
                            })
                            : <Empty message='Нет объектов недвижимости'/>}
                    </BlockingElement>

                    <div className={classes.buttons}>
                        <Button type='apply' onClick={() => navigate('/building/')}>Покупка</Button>
                        <Button type='apply' onClick={() => navigate('/rent/')}>Аренда</Button>
                    </div>
                </div>
            </Wrapper>
        </section>
    )
}

SectionBuildings.displayName = 'SectionBuildings'

export default SectionBuildings