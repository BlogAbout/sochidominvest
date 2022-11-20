import React, {useEffect, useState} from 'react'
import withStore from '../../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../../@types/IPopup'
import {Footer, Popup} from '../../../../components/popup/Popup/Popup'
import {getPopupContainer, openPopup, removePopup} from '../../../../helpers/popupHelper'
import showBackgroundBlock from '../../../../components/ui/BackgroundBlock/BackgroundBlock'
import BlockingElement from '../../../../components/ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import LoginForm from './components/LoginForm/LoginForm'
import RegistrationForm from './components/RegistrationForm/RegistrationForm'
import ForgotForm from './components/ForgotForm/ForgotForm'
import classes from './PopupAuth.module.scss'

interface Props extends PopupProps {

}

const defaultProps: Props = {}

const PopupAuth: React.FC<Props> = (props): React.ReactElement => {
    const [type, setType] = useState('login')

    useEffect(() => {
        return () => {
            removePopup(props.blockId || '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    const onChangeType = (type: string) => {
        setType(type)
    }

    const renderForm = () => {
        switch (type) {
            case 'login':
                return <LoginForm onChangeType={(type: string) => onChangeType(type)}
                                  onClose={close.bind(this)}/>
            case 'registration':
                return <RegistrationForm onChangeType={(type: string) => onChangeType(type)}
                                         onClose={close.bind(this)}/>
            case 'forgot':
                return <ForgotForm onChangeType={(type: string) => onChangeType(type)}
                                   onClose={close.bind(this)}/>
        }
    }

    return (
        <Popup className={classes.PopupAuth}>
            <BlockingElement fetching={false} className={classes.content}>
                {renderForm()}
            </BlockingElement>

            <Footer>
                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        title='Закрыть'
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupAuth.defaultProps = defaultProps
PopupAuth.displayName = 'PopupAuth'

export default function openPopupAuth(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupAuth), popupProps, undefined, block, displayOptions)
}