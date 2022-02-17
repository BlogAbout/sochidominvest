import React from 'react'
import classes from './ForgotForm.module.scss'

interface Props {
    onChangeType(value: string): void
}

const defaultProps: Props = {
    onChangeType: (value: string) => {
        console.info('RegistrationForm onChangeType', value)
    }
}

const ForgotForm: React.FC<Props> = (props) => {
    return (
        <div className={classes.ForgotForm}>
            <h2>Восстановление пароля</h2>

            <p>В разработке</p>

            <div className={classes['buttons-wrapper']}>
                <div className={classes['links']}>
                    <strong onClick={() => props.onChangeType('login')}>Войти</strong>
                    <span>или</span>
                    <strong onClick={() => props.onChangeType('registration')}>Зарегистрироваться</strong>
                </div>
            </div>
        </div>
    )
}

ForgotForm.defaultProps = defaultProps
ForgotForm.displayName = 'ForgotForm'

export default ForgotForm