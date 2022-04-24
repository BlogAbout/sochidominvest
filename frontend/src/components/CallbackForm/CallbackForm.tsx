import React, {useState} from 'react'
import {IBuilding} from '../../@types/IBuilding'
import {IFeed} from '../../@types/IFeed'
import FeedService from '../../api/FeedService'
import Preloader from '../Preloader/Preloader'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import classes from './CallbackForm.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const CallbackForm: React.FC<Props> = (props) => {
    const [info, setInfo] = useState<IFeed>({
        id: null,
        author: null,
        phone: '',
        name: '',
        title: `Запрос информации о ${props.building.name}`,
        type: 'callback',
        objectId: props.building.id,
        objectType: props.building.id ? 'building' : null,
        active: 1,
        status: 'new'
    })

    const [validationPhone, setValidationPhone] = useState('')
    const [fetching, setFetching] = useState(false)
    const [resultResponse, setResultResponse] = useState({
        success: '',
        error: ''
    })

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
        <div className={classes.CallbackForm}>
            {fetching && <Preloader/>}

            <h2>Узнать подробнее</h2>

            <div className={classes.info}>Заполните форму и мы Вам перезвоним!</div>

            {resultResponse.success !== '' ?
                <div className={classes.successMessage}>{resultResponse.success}</div>
                :
                <>
                    <div className={classes['field-wrapper']}>
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

                    <div className={classes['field-wrapper']}>
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

                    {resultResponse.error !== '' && <div className={classes.errorMessage}>{resultResponse.error}</div>}

                    <div className={classes['buttons-wrapper']}>
                        <Button type='apply'
                                disabled={fetching || validationPhone !== ''}
                                onClick={sendCallbackHandler.bind(this)}
                        >Запросить звонок</Button>
                    </div>
                </>
            }
        </div>
    )
}

CallbackForm.defaultProps = defaultProps
CallbackForm.displayName = 'CallbackForm'

export default CallbackForm