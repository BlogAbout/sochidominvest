import React, {useState} from 'react'
import {useActions} from '../../../../../../hooks/useActions'
import UserService from '../../../../../../api/UserService'
import TextBox from '../../../../../../components/form/TextBox/TextBox'
import Button from '../../../../../../components/form/Button/Button'
import Field from '../../../../form/Field/Field'
import Title from '../../../../ui/Title/Title'
import classes from '../../PopupAuth.module.scss'

interface Props {
    onChangeType(type: string): void

    onClose(): void
}

const defaultProps: Props = {
    onChangeType: (type: string) => {
        console.info('ForgotForm onChange', type)
    },
    onClose: () => {
        console.info('ForgotForm onClose')
    }
}

const ForgotForm: React.FC<Props> = (props): React.ReactElement => {
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
            <div className={classes.links}>
                <strong onClick={() => props.onChangeType('login')}>Войти</strong>
                <span>или</span>
                <strong onClick={() => props.onChangeType('registration')}>Зарегистрироваться</strong>
            </div>
        )
    }

    const renderForgotForm = () => {
        return (
            <div className={classes.form}>
                <Title type='h2'>Восстановление пароля</Title>

                <Field label='E-mail'
                       title='E-mail'
                       type='hor'
                       style='dark'
                       labelWidth={150}
                >
                    <TextBox value={email}
                             placeHolder='E-mail'
                             error={email === ''}
                             errorText={'Укажите Ваш E-mail для восстановления пароля'}
                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                 setEmail(e.target.value)
                             }}
                             styleType='minimal'
                             width='100%'
                    />
                </Field>

                {error !== '' && <div className={classes.errorMessage}>{error}</div>}

                <div className={classes.buttons}>
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
                <Title type='h2'>Проверочный код</Title>

                <Field label='Проверочный код'
                       title='Проверочный код'
                       type='hor'
                       style='dark'
                       labelWidth={150}
                >
                    <TextBox value={validationCode}
                             placeHolder='Проверочный код'
                             error={validationCode === ''}
                             errorText={'Укажите код из письма для проверки'}
                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                 setValidationCode(e.target.value)
                             }}
                             styleType='minimal'
                             width='100%'
                    />
                </Field>

                {error !== '' && <div className={classes.errorMessage}>{error}</div>}

                <div className={classes.buttons}>
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
                <Title type='h2'>Смена пароля</Title>

                <Field label='Новый пароль'
                       title='Новый пароль'
                       type='hor'
                       style='dark'
                       labelWidth={150}
                >
                    <TextBox password={true}
                             value={password}
                             placeHolder='Новый пароль'
                             error={password === ''}
                             errorText='Укажите новый пароль'
                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                 setPassword(e.target.value)
                             }}
                             styleType='minimal'
                             width='100%'
                    />
                </Field>

                {error !== '' && <div className={classes.errorMessage}>{error}</div>}

                <div className={classes.buttons}>
                    <Button type='apply'
                            disabled={fetching || password === ''}
                            onClick={onResetPasswordHandler.bind(this)}
                    >Изменить пароль</Button>

                    {renderLinks()}
                </div>
            </div>
        )
    }

    return step === 2 ? renderValidationCodeForm() : step === 3 ? renderResetPasswordForm() : renderForgotForm()
}

ForgotForm.defaultProps = defaultProps
ForgotForm.displayName = 'ForgotForm'

export default React.memo(ForgotForm)