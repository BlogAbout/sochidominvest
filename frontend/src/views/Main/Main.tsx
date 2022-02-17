import React, {useState} from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import ForgotForm from '../../components/ForgotForm/ForgotForm'
import classes from './Main.module.scss'

const Main: React.FC = () => {
    const [formType, setFormType] = useState('login')

    return (
        <div className={classes.Main}>
            <main className={classes.Content}>
                <div className={classes.container}>
                    <section className={classes.login}>
                        <p>Сервис в стадии разработки</p>

                        {formType === 'login' && <LoginForm onChangeType={(value: string) => setFormType(value)}/>}

                        {formType === 'registration' &&
                        <RegistrationForm onChangeType={(value: string) => setFormType(value)}/>}

                        {formType === 'forgot' && <ForgotForm onChangeType={(value: string) => setFormType(value)}/>}
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Main