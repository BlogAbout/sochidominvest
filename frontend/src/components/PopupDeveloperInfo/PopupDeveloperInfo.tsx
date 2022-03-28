import React, {useEffect} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {IDeveloper} from '../../@types/IDeveloper'
import {ISelector} from '../../@types/ISelector'
import {developerTypes} from '../../helpers/developerHelper'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import Button from '../Button/Button'
import classes from './PopupDeveloperInfo.module.scss'

interface Props extends PopupProps {
    developer: IDeveloper
}

const defaultProps: Props = {
    developer: {} as IDeveloper
}

const PopupDeveloperInfo: React.FC<Props> = (props) => {
    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const developerType = developerTypes.find((type: ISelector) => type.key === props.developer.type)

    return (
        <Popup className={classes.PopupDeveloperInfo}>
            <Header title={props.developer.name}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={false} className={classes.content}>
                    <div className={classes.row}>
                        <span>Название</span>
                        <span>{props.developer.name}</span>
                    </div>

                    <div className={classes.row}>
                        <span>Адрес</span>
                        <span>{props.developer.address}</span>
                    </div>

                    <div className={classes.row}>
                        <span>Телефон</span>
                        <span>{props.developer.phone}</span>
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
                        <span>{props.developer.dateCreated}</span>
                    </div>

                    <div className={classes.row}>
                        <span>Обновлено</span>
                        <span>{props.developer.dateUpdate}</span>
                    </div>

                    {props.developer.description ?
                        <div className={classes.description}>
                            {props.developer.description}
                        </div>
                        : null
                    }
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={close.bind(this)}
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupDeveloperInfo.defaultProps = defaultProps
PopupDeveloperInfo.displayName = 'PopupDeveloperInfo'

export default function openPopupDeveloperInfo(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupDeveloperInfo, popupProps, undefined, block, displayOptions)
}