import React, {useState} from 'react'
import classes from './RegistrationForm.module.scss'
import TextBox from "../TextBox/TextBox";
import {ISignUp} from "../../@types/ISignUp";

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
        login: '',
        password: '',
        name: ''
    })

    const [validationError, setValidationError] = useState({
        phone: false,
        login: false,
        password: false,
        name: false
    })

    // const {fetching} = useTypedSelector(state => state.authReducer)
    // const {registration} = useActions()

    const validationHandler = (): boolean => {
        let phoneError = false
        let authError = false
        let passwordError = false
        let nameError = false

        if (signUp.phone === '') {
            phoneError = true
        }

        if (signUp.login === '') {
            authError = true
        }

        if (signUp.password === '') {
            passwordError = true
        }

        if (signUp.name === '') {
            nameError = true
        }

        setValidationError({
            phone: phoneError,
            login: authError,
            password: passwordError,
            name: nameError
        })

        return !(phoneError || authError || passwordError || nameError)
    }

    const registrationHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()

        if (validationHandler()) {
            // registration(signUp)
        }
    }

    return (
        <div className={classes.RegistrationForm}>
            <h2>Регистрация</h2>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type="text"
                    value={signUp.name}
                    placeholder='Имя'
                    error={validationError.login}
                    errorText={validationError.login ? 'Введите имя' : undefined}
                    icon="user"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            name: e.target.value
                        })
                        setValidationError({...validationError, name: false})
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type="text"
                    value={signUp.login}
                    placeholder='Логин'
                    error={validationError.login}
                    errorText={validationError.login ? 'Введите логин' : undefined}
                    icon="user"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            login: e.target.value
                        })
                        setValidationError({...validationError, login: false})
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type="tel"
                    value={signUp.password}
                    placeholder='Телефон'
                    error={validationError.password}
                    errorText={validationError.password ? 'Введите телефон' : undefined}
                    icon="phone"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            phone: e.target.value
                        })
                        setValidationError({...validationError, phone: false})
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type="password"
                    value={signUp.password}
                    placeholder='Пароль'
                    error={validationError.password}
                    errorText={validationError.password ? 'Введите пароль' : undefined}
                    icon="lock"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUp({
                            ...signUp,
                            password: e.target.value
                        })
                        setValidationError({...validationError, password: false})
                    }}
                />
            </div>

            <div className={classes['buttons-wrapper']}>
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