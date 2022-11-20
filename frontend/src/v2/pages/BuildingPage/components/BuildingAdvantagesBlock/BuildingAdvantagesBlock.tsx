import React from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import {buildingAdvantages} from '../../../../../helpers/buildingHelper'
import classes from './BuildingAdvantagesBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingAdvantagesBlock: React.FC<Props> = (props): React.ReactElement | null => {
    if (!props.building.advantages || !props.building.advantages.length) {
        return null
    }

    return (
        <div className={classes.BuildingAdvantagesBlock}>
            <h2>Преимущества</h2>

            <div className={classes.info}>
                {props.building.advantages.map((item: string, index: number) => {
                    const advantage = buildingAdvantages.find(element => element.key === item)

                    if (!advantage) {
                        return null
                    }

                    return (
                        <div key={index} className={classes.advantage}>
                            <span>{advantage.text}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

BuildingAdvantagesBlock.defaultProps = defaultProps
BuildingAdvantagesBlock.displayName = 'BuildingAdvantagesBlock'

export default BuildingAdvantagesBlock