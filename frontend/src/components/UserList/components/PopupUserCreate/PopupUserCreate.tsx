import React from 'React'
import {PopupProps} from '../../../../@types/IPopup'
import {IUser} from '../../../../@types/IUser'
import classes from './PopupUserCreate.module.scss'

interface Props extends PopupProps {
    user: IUser | null
    onSave(): void
}

const defaultProps: Props = {
    user: null,
    onSave: () => {
        console.info('PopupUserCreate onSave')
    }
}

const PopupUserCreate: React.FC<Props> = (props) => {
    // Сохранение изменений
    const saveHandler = () => {
        // Todo
    }

    return (
        <div className={classes.PopupUserCreate}>

        </div>
    )
}

PopupUserCreate.defaultProps = defaultProps
PopupUserCreate.displayName = 'PopupUserCreate'

export default PopupUserCreate