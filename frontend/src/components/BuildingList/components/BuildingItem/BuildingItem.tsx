import React from 'React'
import {IBuilding} from '../../../../@types/IBuilding'
import classes from './BuildingItem.module.scss'

interface Props {
    user: IBuilding
    onSave(): void
}

const defaultProps: Props = {
    user: {} as IBuilding,
    onSave: () => {
        console.info('BuildingItem onSave')
    }
}

const BuildingItem: React.FC<Props> = (props) => {
    // Создание нового объекта
    const createHandler = () => {

    }

    // Редактирование объекта
    const updateHandler = () => {

    }

    // Удаление объекта
    const removeHandler = () => {

    }

    // Смена статуса объекта
    const blockingHandler = () => {

    }

    return (
        <div className={classes.BuildingItem}>

        </div>
    )
}

BuildingItem.defaultProps = defaultProps
BuildingItem.displayName = 'BuildingItem'

export default BuildingItem