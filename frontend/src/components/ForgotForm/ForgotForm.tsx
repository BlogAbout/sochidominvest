import React, {useState} from 'react'
import UserService from '../../api/UserService'
import TextBox from '../form/TextBox/TextBox'
import Button from '../form/Button/Button'
import {useActions} from '../../hooks/useActions'
import classes from './ForgotForm.module.scss'

interface Props {
    onChangeType(value: string): void
}

const defaultProps: Props = {
    onChangeType: (value: string) => {
        console.info('ForgotForm onChangeType', value)
    }
}

const ForgotForm: React.FC<Props> = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [validationCode, setValidationCode] = useState('')
    const [error, setError] = useState('')
    const [fetching, setFetching] = useState(false)
    const [step, setStep] = useState(1)

    const {setUserAuth} = useActions()

    const onForgotHandler = () => {
        if (email.trim() !== '') {
            setFetching(true)
            setError('')

            UserService.forgotPasswordUser(email)
                .then((response: any) => {
                    setCode(response.data)
                    setStep(2)
                })
                .catch((error: any) => {
                    console.error(error.data)
                    setError(error.data)
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }

    const onCompareCodeHandler = () => {
        if (validationCode.trim() === '') {
            return
        }

        if (code.trim() !== validationCode.trim()) {
            setError('Неверный проверочный код! Попробуйте снова.')
        } else {
            setStep(3)
        }
    }

    const onResetPasswordHandler = () => {
        if (password.trim() !== '') {
            setFetching(true)
            setError('')

            UserService.resetPasswordUser(email, password)
                .then((response: any) => {
                    setUserAuth(response.data)
                })
                .catch((error: any) => {
                    console.error(error.data)
                    setError(error.data)
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }

    const renderLinks = () => {
        return (
            <div className={classes['links']}>
                <strong onClick={() => props.onChangeType('login')}>Войти</strong>
                <span>или</span>
                <strong onClick={() => props.onChangeType('registration')}>Зарегистрироваться</strong>
            </div>
        )
    }

    const renderForgotForm = () => {
        return (
            <div className={classes.ForgotForm}>
                <h2>Восстановление пароля</h2>

                <div className={classes['field-wrapper']}>
                    <TextBox
                        type='text'
                        value={email}
                        placeHolder='E-mail'
                        error={email === ''}
                        errorText={'Укажите Ваш E-mail для восстановления пароля'}
                        icon='at'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(e.target.value)
                        }}
                    />
                </div>

                {error !== '' && <div className={classes.errorMessage}>{error}</div>}

                <div className={classes['buttons-wrapper']}>
                    <Button type='apply'
                            disabled={fetching || email === ''}
                            onClick={onForgotHandler.bind(this)}
                    >Восстановить</Button>

                    {renderLinks()}
                </div>
            </div>
        )
    }

    const renderValidationCodeForm = () => {
        return (
            <div className={classes.ForgotForm}>
                <h2>Проверочный код</h2>

                <div className={classes['field-wrapper']}>
                    <TextBox
                        type='text'
                        value={validationCode}
                        placeHolder='Проверочный код'
                        error={validationCode === ''}
                        errorText={'Укажите код из письма для проверки'}
                        icon='at'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setValidationCode(e.target.value)
                        }}
                    />
                </div>

                {error !== '' && <div className={classes.errorMessage}>{error}</div>}

                <div className={classes['buttons-wrapper']}>
                    <Button type='apply'
                            disabled={fetching || code === ''}
                            onClick={onCompareCodeHandler.bind(this)}
                    >Подтвердить</Button>

                    {renderLinks()}
                </div>
            </div>
        )
    }

    const renderResetPasswordForm = () => {
        return (
            <div className={classes.ForgotForm}>
                <h2>Смена пароля</h2>

                <div className={classes['field-wrapper']}>
                    <TextBox
                        type='password'
                        password={true}
                        value={password}
                        placeHolder='Новый пароль'
                        error={password === ''}
                        errorText='Укажите новый пароль'
                        icon='lock'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(e.target.value)
                        }}
                    />
                </div>

                {error !== '' && <div className={classes.errorMessage}>{error}</div>}

                <div className={classes['buttons-wrapper']}>
                    <Button type='apply'
                            disabled={fetching || password === ''}
                            onClick={onResetPasswordHandler.bind(this)}
                    >Изменить пароль</Button>

                    {renderLinks()}
                </div>
            </div>
        )
    }

    return (
        step === 2 ? renderValidationCodeForm() : step === 3 ? renderResetPasswordForm() : renderForgotForm()
    )
}

ForgotForm.defaultProps = defaultProps
ForgotForm.displayName = 'ForgotForm'

export default ForgotForm