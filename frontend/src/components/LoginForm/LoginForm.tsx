import React, {useState} from 'react'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import {IAuth} from '../../@types/IAuth'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import Preloader from '../Preloader/Preloader'
import classes from './LoginForm.module.scss'

interface Props {
    onChangeType(value: string): void
}

const defaultProps: Props = {
    onChangeType: (value: string) => {
        console.info('RegistrationForm onChangeType', value)
    }
}

const LoginForm: React.FC<Props> = (props) => {
    const [auth, setAuth] = useState<IAuth>({
        email: '',
        password: ''
    })

    const [validationError, setValidationError] = useState({
        email: false,
        password: false
    })

    const {fetching, error} = useTypedSelector(state => state.authReducer)
    const {login} = useActions()

    const validationHandler = (): boolean => {
        let emailError = false
        let passwordError = false

        if (auth.email === '') {
            emailError = true
        }

        if (auth.password === '') {
            passwordError = true
        }

        setValidationError({email: emailError, password: passwordError})

        return !(emailError || passwordError)
    }

    const loginHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()

        if (validationHandler()) {
            login(auth)
        }
    }

    return (
        <div className={classes.LoginForm}>
            {fetching && <Preloader/>}

            <h2>Вход в приложение</h2>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type="text"
                    value={auth.email}
                    placeholder='E-mail'
                    error={validationError.email}
                    errorText={validationError.email ? 'Введите E-mail' : undefined}
                    icon="at"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAuth({
                            ...auth,
                            email: e.target.value
                        })
                        setValidationError({...validationError, email: false})
                    }}
                />
            </div>

            <div className={classes['field-wrapper']}>
                <TextBox
                    type="password"
                    value={auth.password}
                    placeholder='Пароль'
                    error={validationError.password}
                    errorText={validationError.password ? 'Введите пароль' : undefined}
                    icon="lock"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAuth({
                            ...auth,
                            password: e.target.value
                        })
                        setValidationError({...validationError, password: false})
                    }}
                />
            </div>

            {error && <div className={classes.errorMessage}>{error}</div>}

            <div className={classes['buttons-wrapper']}>
                <Button type="save"
                        disabled={fetching}
                        onClick={loginHandler.bind(this)}
                >Войти</Button>

                <div className={classes['links']}>
                    <strong onClick={() => props.onChangeType('forgot')}>Восстановить пароль</strong>
                    <span>или</span>
                    <strong onClick={() => props.onChangeType('registration')}>Зарегистрироваться</strong>
                </div>
            </div>
        </div>
    )
}

LoginForm.defaultProps = defaultProps
LoginForm.displayName = 'LoginForm'

export default LoginForm