import React from 'react'
import openPopupFileManager from '../../popup/PopupFileManager/PopupFileManager'
import Button from '../Button/Button'
import classes from './AvatarBox.module.scss'

interface Props {
    avatarId: number | null
    fetching?: boolean

    onSelect(attachmentId: number | null): void
}

const defaultProps: Props = {
    avatarId: null,
    fetching: false,
    onSelect: (attachmentId: number | null) => {
        console.info('AvatarBox onSelect', attachmentId)
    }
}

const AvatarBox: React.FC<Props> = (props) => {
    return (
        <div className={classes.AvatarBox}>
            <Button type='save'
                    icon='arrow-pointer'
                    onClick={() => openPopupFileManager(document.body, {
                        type: 'image',
                        selected: props.avatarId ? [props.avatarId] : [],
                        onSelect: (selected: number[]) => {
                            props.onSelect(selected.length ? selected[0] : null)
                        }
                    })}
                    disabled={props.fetching}
            >{props.avatarId ? 'Заменить' : 'Выбрать / Загрузить'}</Button>
        </div>
    )
}

AvatarBox.defaultProps = defaultProps
AvatarBox.displayName = 'AvatarBox'

export default AvatarBox