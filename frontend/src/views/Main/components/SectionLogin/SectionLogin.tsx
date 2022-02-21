import React, {useState} from 'react'
import LoginForm from '../../../../components/LoginForm/LoginForm'
import RegistrationForm from '../../../../components/RegistrationForm/RegistrationForm'
import ForgotForm from '../../../../components/ForgotForm/ForgotForm'
import classes from './SectionLogin.module.scss'

const SectionLogin: React.FC = () => {
    const [formType, setFormType] = useState('login')

    return (
        <section className={classes.SectionLogin}>
            <div className={classes.container}>
                {formType === 'login' &&
                <div className={classes.info}>Если у Вас уже есть аккаунт, авторизуйтесь и получите доступ ко всем функциям сервиса.</div>}

                {formType === 'registration' &&
                <div className={classes.info}>Зарегистрируйтесь в сервисе и получите доступ к обширной базе недвижимости.</div>}

                {formType === 'forgot' &&
                <div className={classes.info}>Восстановите доступ к сервису с помощью формы восстановления пароля.</div>}

                {formType === 'login' && <LoginForm onChangeType={(value: string) => setFormType(value)}/>}

                {formType === 'registration' &&
                <RegistrationForm onChangeType={(value: string) => setFormType(value)}/>}

                {formType === 'forgot' && <ForgotForm onChangeType={(value: string) => setFormType(value)}/>}
            </div>
        </section>
    )
}

SectionLogin.displayName = 'SectionLogin'

export default SectionLogin