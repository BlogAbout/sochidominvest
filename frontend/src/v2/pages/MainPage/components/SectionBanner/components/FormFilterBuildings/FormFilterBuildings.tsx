import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {buildingClasses, buildingTypes, districtList} from '../../../../../../../helpers/buildingHelper'
import ComboBox from '../../../../../../components/form/ComboBox/ComboBox'
import Button from '../../../../../../components/form/Button/Button'
import NumberBox from '../../../../../../../components/NumberBox/NumberBox'
import classes from './FormFilterBuildings.module.scss'

interface IFilterBuildings {
    district: string | null
    houseType: string | null
    houseClass: string | null
    minCost: number | null
    maxCost: number | null
}

const FormFilterBuildings: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [selectedFilter, setSelectedFilter] = useState<IFilterBuildings>({
        district: null,
        houseType: null,
        houseClass: null,
        minCost: null,
        maxCost: null
    })

    const findBuildingsHandler = () => {
        localStorage.setItem('mainPageFilter', JSON.stringify(selectedFilter))

        navigate('/building/')
    }

    return (
        <div className={classes.FormFilterBuildings}>
            <div className={classes.inner}>
                <div className={classes.field}>
                    <ComboBox selected={selectedFilter.district || null}
                              items={Object.values(districtList)}
                              onSelect={(value: string) => setSelectedFilter({...selectedFilter, district: value})}
                              placeHolder='Выберите район'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <ComboBox selected={selectedFilter.houseType || null}
                              items={Object.values(buildingTypes)}
                              onSelect={(value: string) => setSelectedFilter({...selectedFilter, houseType: value})}
                              placeHolder='Выберите тип недвижимости'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <ComboBox selected={selectedFilter.houseClass || ''}
                              items={Object.values(buildingClasses)}
                              onSelect={(value: string) => setSelectedFilter({...selectedFilter, houseClass: value})}
                              placeHolder='Выберите класс дома'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <NumberBox value={selectedFilter.minCost || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               countAfterComma={0}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => {
                                   setSelectedFilter({...selectedFilter, minCost: value})
                               }}
                               placeHolder='Минимальная цена, руб.'
                    />
                </div>

                <div className={classes.field}>
                    <NumberBox value={selectedFilter.maxCost || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               countAfterComma={0}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => {
                                   setSelectedFilter({...selectedFilter, maxCost: value})
                               }}
                               placeHolder='Максимальная цена, руб.'
                    />
                </div>

                <div className={classes.buttons}>
                    <Button type='apply' onClick={() => findBuildingsHandler()}>Найти</Button>
                </div>
            </div>
        </div>
    )
}

FormFilterBuildings.displayName = 'FormFilterBuildings'

export default React.memo(FormFilterBuildings)