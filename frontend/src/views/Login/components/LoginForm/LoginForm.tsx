import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {IAuth} from '../../../../@types/IAuth'
import TextBox from '../../../../components/TextBox/TextBox'
import Button from '../../../../components/Button/Button'
import classes from './LoginForm.module.scss'

const LoginForm: React.FC = () => {
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
        <div className={classes.loginContainer}>
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
                    <Link to="/forgot">Восстановить пароль</Link>
                    <span>или</span>
                    <Link to="/registration">Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginForm