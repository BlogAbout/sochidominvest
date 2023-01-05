import React, {useState} from 'react'
// @ts-ignore
import is from 'is_js'
import {useActions} from '../../../../../../hooks/useActions'
import {IAuth} from '../../../../../../@types/IAuth'
import TextBox from '../../../../form/TextBox/TextBox'
import Button from '../../../../form/Button/Button'
import UserService from '../../../../../../api/UserService'
import Field from '../../../../form/Field/Field'
import Title from '../../../../ui/Title/Title'
import classes from '../../PopupAuth.module.scss'

interface Props {
    onChangeType(type: string): void

    onClose(): void
}

const defaultProps: Props = {
    onChangeType: (type: string) => {
        console.info('LoginForm onChange', type)
    },
    onClose: () => {
        console.info('LoginForm onClose')
    }
}

const LoginForm: React.FC<Props> = (props): React.ReactElement => {
    const [auth, setAuth] = useState<IAuth>({
        email: '',
        password: ''
    })

    const [validationError, setValidationError] = useState({
        email: '',
        password: ''
    })

    const [info, setInfo] = useState({
        fetching: false,
        error: ''
    })

    const {setUserAuth} = useActions()

    const validationHandler = (): boolean => {
        let emailError = ''
        let passwordError = ''

        if (auth.email.trim().length === 0) {
            emailError = 'Введите E-mail'
        } else if (!is.email(auth.email)) {
            emailError = 'E-mail имеет неверный формат'
        }

        if (auth.password === '') {
            passwordError = 'Введите пароль'
        }

        setValidationError({email: emailError, password: passwordError})

        return !(emailError || passwordError)
    }

    const loginHandler = async (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()

        if (validationHandler()) {
            setInfo({
                fetching: true,
                error: ''
            })

            UserService.authUser(auth)
                .then((response: any) => {
                    setUserAuth(response.data)

                    setInfo({
                        fetching: false,
                        error: ''
                    })

                    props.onClose()
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
        <div className={classes.form}>
            <Title type='h2'>Вход в систему</Title>

            <Field label='E-mail'
                   title='E-mail'
                   type='hor'
                   style='dark'
                   labelWidth={150}
            >
                <TextBox value={auth.email}
                         placeHolder='E-mail'
                         error={validationError.email !== ''}
                         errorText={validationError.email}
                         onChange={(value: string) => {
                             setAuth({
                                 ...auth,
                                 email: value
                             })

                             if (value.length === 0) {
                                 setValidationError({...validationError, email: 'Введите E-mail'})
                             } else if (!is.email(value)) {
                                 setValidationError({...validationError, email: 'E-mail имеет неверный формат'})
                             } else {
                                 setValidationError({...validationError, email: ''})
                             }
                         }}
                         styleType='minimal'
                         width='100%'
                />
            </Field>

            <Field label='Пароль'
                   title='Пароль'
                   type='hor'
                   style='dark'
                   labelWidth={150}
            >
                <TextBox password={true}
                         value={auth.password}
                         placeHolder='Пароль'
                         error={validationError.password !== ''}
                         errorText={validationError.password}
                         onChange={(value: string) => {
                             setAuth({
                                 ...auth,
                                 password: value
                             })

                             if (value.length === 0) {
                                 setValidationError({...validationError, password: 'Введите пароль'})
                             } else {
                                 setValidationError({...validationError, password: ''})
                             }
                         }}
                         styleType='minimal'
                         width='100%'
                />
            </Field>

            {info.error !== '' && <div className={classes.errorMessage}>{info.error}</div>}

            <div className={classes.buttons}>
                <Button type='apply'
                        disabled={info.fetching || validationError.email !== '' || validationError.password !== ''}
                        onClick={loginHandler.bind(this)}
                >Войти</Button>

                <div className={classes.links}>
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

export default React.memo(LoginForm)