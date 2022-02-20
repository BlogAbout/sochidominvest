import React from 'React'
import {PopupProps} from '../../../../@types/IPopup'
import {IBuilding} from '../../../../@types/IBuilding'
import classes from './PopupBuildingCreate.module.scss'

interface Props extends PopupProps {
    user: IBuilding | null
    onSave(): void
}

const defaultProps: Props = {
    user: null,
    onSave: () => {
        console.info('PopupBuildingCreate onSave')
    }
}

const PopupBuildingCreate: React.FC<Props> = (props) => {
    // Сохранение изменений
    const saveHandler = () => {
        // Todo
    }

    return (
        <div className={classes.PopupUserCreate}>

        </div>
    )
}

PopupBuildingCreate.defaultProps = defaultProps
PopupBuildingCreate.displayName = 'PopupBuildingCreate'

export default PopupBuildingCreate