import React, {useEffect, useState} from 'react'
import {PDFDownloadLink} from '@react-pdf/renderer'
import FeedService from '../../../api/FeedService'
import {PopupProps} from '../../../@types/IPopup'
import {IFeed} from '../../../@types/IFeed'
import {IBuilding} from '../../../@types/IBuilding'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import PdfDocumentGenerator from '../../PdfDocumentGenerator/PdfDocumentGenerator'
import classes from './PopupFeedCreate.module.scss'

interface Props extends PopupProps {
    building?: IBuilding
    type: 'callback' | 'get-document' | 'get-presentation' | 'get-view'
}

const defaultProps: Props = {
    type: 'callback'
}

const PopupFeedCreate: React.FC<Props> = (props) => {
    const [info, setInfo] = useState<IFeed>({
        id: null,
        author: null,
        phone: '',
        name: '',
        title: '',
        type: 'feed',
        objectId: props.building ? props.building.id : null,
        objectType: props.building ? 'building' : null,
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
                title = `Запрос обратного звонка ${props.building ? ' по ' + props.building.name : ''}`
                text = `Запрос обратного звонка`
                break
            case 'get-document':
                title = `Запрос документов ${props.building ? ' по ' + props.building.name : ''}`
                text = `Запрос документов`
                break
            case 'get-presentation':
                title = `Запрос презентации ${props.building ? ' по ' + props.building.name : ''}`
                text = `Запрос презентации`
                break
            case 'get-view':
                title = `Заявка на просмотр объекта ${props.building ? ' по ' + props.building.name : ''}`
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
                .finally(() => setFetching(false))
        }
    }

    return (
        <Popup className={classes.PopupFeedCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>{titlePopup}</Title>

                    <div className={classes.field}>
                        <Label text='Номер телефона'/>

                        <TextBox type='tel'
                                 value={info.phone}
                                 placeHolder='Телефон'
                                 error={validationPhone !== ''}
                                 errorText={validationPhone}
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
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Имя'/>

                        <TextBox type='text'
                                 value={info.name}
                                 placeHolder='Имя'
                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                     setInfo({
                                         ...info,
                                         name: e.target.value
                                     })
                                 }}
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Соглашаюсь с условиями политики конфиденциальности'
                                  type='classic'
                                  width={110}
                                  checked={policy}
                                  onChange={() => setPolicy(!policy)}
                        />
                    </div>

                    {resultResponse.error !== '' &&
                    <div className={classes.errorMessage}>{resultResponse.error}</div>}
                    {resultResponse.success !== '' &&
                    <div className={classes.successMessage}>
                        {resultResponse.success}

                        {props.type === 'get-presentation' ?
                            <PDFDownloadLink className={classes.btn}
                                             document={
                                                 <PdfDocumentGenerator type='building' building={props.building}/>
                                             }
                            >
                                Скачать презентацию
                            </PDFDownloadLink>
                            : null}
                    </div>}
                </div>
            </BlockingElement>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => sendCallbackHandler()}
                        disabled={fetching || validationPhone !== '' || !policy}
                        title='Отправить заявку'
                >Отправить заявку</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
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
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupFeedCreate, popupProps, undefined, block, displayOptions)
}