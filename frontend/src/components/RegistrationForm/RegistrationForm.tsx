import React, {useState} from 'react'
// @ts-ignore
import is from 'is_js'
import {useActions} from '../../hooks/useActions'
import UserService from '../../api/UserService'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import Preloader from '../Preloader/Preloader'
import ComboBox from '../ComboBox/ComboBox'
import {rolesList} from '../../helpers/userHelper'
import {ISignUp} from '../../@types/ISignUp'
import classes from './RegistrationForm.module.scss'

interface Props {
    onChangeType(value: string): void
}

const defaultProps: Props = {
    onChangeType: (value: string) => {
        console.info('RegistrationForm onChangeType', value)
    }
}

const RegistrationForm: React.FC<Props> = (props) => {
    const [signUp, setSignUp] = useState<ISignUp>({
        phone: '',
        email: '',
        password: '',
        firstName: '',
        role: 'subscriber'
    })

    const [validationError, setValidationError] = useState({
        phone: '',
        email: '',
        password: '',
        firstName: ''
    })

    const [info, setInfo] = useState({
        fetching: false,
        error: ''
    })

    const {setUserAuth} = useActions()

    const validationHandler = (): boolean => {
        let phoneError = ''
        let emailError = ''
        let passwordError = ''
        let nameError = ''

        if (signUp.phone === '') {
            phoneError = 'Введите номер телефона'
        }

        if (signUp.email === '') {
            emailError = 'Введите E-mail'
        } else if (!is.email(signUp.email)) {
            emailError = 'E-mail имеет неверный формат'
        }

        if (signUp.password === '') {
            passwordError = 'Введите пароль'
        }

        if (signUp.firstName === '') {
            nameError = 'Введите имя'
        }

        setValidationError({
            phone: phoneError,
            email: emailError,
            password: passwordError,
            firstName: nameError
        })

        return !(phoneError || emailError || passwordError || nameError)
    }

    const registrationHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()

        if (validationHandler()) {
            setInfo({
                fetching: true,
                error: ''
            })

            UserService.registrationUser(signUp)
                .then((response: any) => {
                    setUserAuth(response.data)

                    setInfo({
                        fetching: false,
                        error: ''
                    })
                })
                .catch((error: any) => {
                    setInfo({
                        fetching: false,
                        error: error.data
                    })
                })
        }
    }

    return (
        <div className={classes.RegistrationForm}>
            {info.fetching && <Preloader/>}

            <h2>Регистрация</h2>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type='text'
                    value={signUp.firstName}
                    placeHolder='Имя'
                    error={validationError.firstName !== ''}
                    errorText={validationError.firstName}
                    icon='user'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            firstName: e.target.value
                        })

                        if (e.target.value.trim().length === 0) {
                            setValidationError({...validationError, firstName: 'Введите имя'})
                        } else {
                            setValidationError({...validationError, firstName: ''})
                        }
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type='text'
                    value={signUp.email}
                    placeHolder='Email'
                    error={validationError.email !== ''}
                    errorText={validationError.email}
                    icon='at'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            email: e.target.value
                        })

                        if (e.target.value.trim().length === 0) {
                            setValidationError({...validationError, email: 'Введите имя'})
                        } else if (!is.email(e.target.value)) {
                            setValidationError({...validationError, email: 'E-mail имеет неверный формат'})
                        } else {
                            setValidationError({...validationError, email: ''})
                        }
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type='tel'
                    value={signUp.phone}
                    placeHolder='Телефон'
                    error={validationError.phone !== ''}
                    errorText={validationError.phone}
                    icon='phone'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            phone: e.target.value
                        })

                        if (e.target.value.trim().length === 0) {
                            setValidationError({...validationError, phone: 'Введите номер телефона'})
                        } else {
                            setValidationError({...validationError, phone: ''})
                        }
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type='password'
                    password={true}
                    value={signUp.password}
                    placeHolder='Пароль'
                    error={validationError.password !== ''}
                    errorText={validationError.password}
                    icon='lock'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            password: e.target.value
                        })

                        if (e.target.value.length > 0 && e.target.value.length < 6) {
                            setValidationError({...validationError, password: 'Минимальная длина пароля 6 символов'})
                        } else if (e.target.value.length === 0) {
                            setValidationError({...validationError, password: 'Введите пароль'})
                        } else {
                            setValidationError({...validationError, password: ''})
                        }
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <ComboBox selected={signUp.role || 'subscriber'}
                          items={Object.values(rolesList.filter(role => role.isRegistration))}
                          onSelect={(value: string) => setSignUp({...signUp, role: value})}
                          placeHolder={'Выберите тип аккаунта'}
                          styleType='standard'
                />
            </div>

            {info.error !== '' && <div className={classes.errorMessage}>{info.error}</div>}

            <div className={classes['buttons-wrapper']}>
                <Button type='apply'
                        disabled={info.fetching || validationError.firstName !== '' || validationError.email !== '' || validationError.phone !== '' || validationError.password !== ''}
                        onClick={registrationHandler.bind(this)}
                >Создать аккаунт</Button>

                <div className={classes['links']}>
                    <strong onClick={() => props.onChangeType('login')}>Войти</strong>
                    <span>или</span>
                    <strong onClick={() => props.onChangeType('forgot')}>Восстановить пароль</strong>
                </div>
            </div>
        </div>
    )
}

RegistrationForm.defaultProps = defaultProps
RegistrationForm.displayName = 'RegistrationForm'

export default RegistrationForm