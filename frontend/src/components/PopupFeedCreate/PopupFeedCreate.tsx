import React, {useEffect, useState} from 'react'
import FeedService from '../../api/FeedService'
import {PopupProps} from '../../@types/IPopup'
import {IFeed} from '../../@types/IFeed'
import {IBuilding} from '../../@types/IBuilding'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import classes from './PopupFeedCreate.module.scss'

interface Props extends PopupProps {
    building: IBuilding
    type: 'callback' | 'get-document' | 'get-presentation' | 'get-view'
}

const defaultProps: Props = {
    building: {} as IBuilding,
    type: 'callback'
}

const PopupFeedCreate: React.FC<Props> = (props) => {
    const [info, setInfo] = useState<IFeed>({
        id: null,
        userId: null,
        author: null,
        phone: '',
        name: '',
        title: '',
        type: 'feed',
        objectId: props.building.id,
        objectType: props.building.id ? 'building' : null,
        active: 1,
        status: 'new'
    })

    const [policy, setPolicy] = useState(false)
    const [titlePopup, setTitlePopup] = useState('Отправить заявку')
    const [validationPhone, setValidationPhone] = useState('')
    const [fetching, setFetching] = useState(false)
    const [resultResponse, setResultResponse] = useState({
        success: '',
        error: ''
    })

    useEffect(() => {
        getTitleFeed()

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [])

    const getTitleFeed = () => {
        let title = ''
        let text = ''

        switch (props.type) {
            case 'callback':
                title = `Запрос обратного звонка по ${props.building.name}`
                text = `Запрос обратного звонка`
                break
            case 'get-document':
                title = `Запрос документов по ${props.building.name}`
                text = `Запрос документов`
                break
            case 'get-presentation':
                title = `Запрос презентации по ${props.building.name}`
                text = `Запрос презентации`
                break
            case 'get-view':
                title = `Заявка на просмотр объекта ${props.building.name}`
                text = `Заявка на просмотр объекта`
                break
        }

        setInfo({...info, title: title, type: props.type === 'callback' ? 'callback' : 'feed'})
        setTitlePopup(text)
    }

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const validationHandler = (): boolean => {
        let phoneError = ''

        if (info.phone === '') {
            phoneError = 'Введите номер телефона'
        }

        setValidationPhone(phoneError)

        return !phoneError
    }

    const sendCallbackHandler = async () => {
        if (validationHandler()) {
            setFetching(true)
            setResultResponse({
                success: '',
                error: ''
            })

            FeedService.saveFeed(info)
                .then(() => {
                    setResultResponse({
                        success: 'Ваша заявка получена. Мы свяжемся с Вами в ближайшее время.',
                        error: ''
                    })
                })
                .catch((error: any) => {
                    console.error(error.data)
                    setResultResponse({
                        success: '',
                        error: error.data
                    })
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }

    return (
        <Popup className={classes.PopupDeveloperCreate}>
            <Header title={titlePopup} popupId={props.id || ''}/>

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <div className={classes.info}>
                        <div className={classes.field}>
                            <div className={classes.field_label}>Номер телефона</div>

                            <TextBox
                                type='tel'
                                value={info.phone}
                                placeHolder='Телефон'
                                error={validationPhone !== ''}
                                errorText={validationPhone}
                                icon='phone'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setInfo({
                                        ...info,
                                        phone: e.target.value
                                    })

                                    if (e.target.value.trim().length === 0) {
                                        setValidationPhone('Введите номер телефона')
                                    } else {
                                        setValidationPhone('')
                                    }
                                }}
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Имя</div>

                            <TextBox
                                type='text'
                                value={info.name}
                                placeHolder='Имя'
                                icon='user'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setInfo({
                                        ...info,
                                        name: e.target.value
                                    })
                                }}
                            />
                        </div>

                        <div className={classes.field}>
                            <CheckBox label='Соглашаюсь с условиями политики конфиденциальности'
                                      type='classic'
                                      checked={policy}
                                      onChange={() => setPolicy(!policy)}
                            />
                        </div>

                        {resultResponse.error !== '' &&
                        <div className={classes.errorMessage}>{resultResponse.error}</div>}
                        {resultResponse.success !== '' &&
                        <div className={classes.successMessage}>{resultResponse.success}</div>}
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => sendCallbackHandler()}
                        disabled={fetching || validationPhone !== '' || !policy}
                >Отправить заявку</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupFeedCreate.defaultProps = defaultProps
PopupFeedCreate.displayName = 'PopupFeedCreate'

export default function openPopupFeedCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupFeedCreate, popupProps, undefined, block, displayOptions)
}