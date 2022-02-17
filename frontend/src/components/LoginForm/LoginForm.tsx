import React, {useState} from 'react'
import {IAuth} from '../../@types/IAuth'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
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
        login: '',
        password: ''
    })

    const [validationError, setValidationError] = useState({
        login: false,
        password: false
    })

    // const {fetching} = useTypedSelector(state => state.authReducer)
    // const {login} = useActions()

    const validationHandler = (): boolean => {
        let authError = false
        let passwordError = false

        if (auth.login === '') {
            authError = true
        }

        if (auth.password === '') {
            passwordError = true
        }

        setValidationError({login: authError, password: passwordError})

        return !(authError || passwordError)
    }

    const loginHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()

        if (validationHandler()) {
            // login(auth)
        }
    }

    return (
        <div className={classes.LoginForm}>
            <h2>Вход в приложение</h2>
            {/*{fetching && <Preloader/>}*/}

            <div className={classes['field-wrapper']}>
                <TextBox
                    type="text"
                    value={auth.login}
                    placeholder='Логин или E-mail'
                    error={validationError.login}
                    errorText={validationError.login ? 'Введите логин или E-mail' : undefined}
                    icon="user"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAuth({
                            ...auth,
                            login: e.target.value
                        })
                        setValidationError({...validationError, login: false})
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

            <div className={classes['buttons-wrapper']}>
                <Button type="save"
                        disabled={false}
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