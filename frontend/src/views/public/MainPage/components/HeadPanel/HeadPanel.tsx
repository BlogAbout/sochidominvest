import React, {useState} from 'react'
import {configuration} from '../../../../../helpers/utilHelper'
import LoginForm from '../../../../../components/LoginForm/LoginForm'
import RegistrationForm from '../../../../../components/RegistrationForm/RegistrationForm'
import ForgotForm from '../../../../../components/ForgotForm/ForgotForm'
import classes from './HeadPanel.module.scss'

const HeadPanel: React.FC = () => {
    const [formType, setFormType] = useState('login')

    return (
        <section className={classes.HeadPanel}>
            <div className={classes.container}>
                <div className={classes.block}>
                    <div className={classes.logo}>
                        <div className={classes.logoImage}/>
                    </div>

                    <div className={classes.slogan}>
                        <h1>Авторизованный брокер недвижимости Сочи</h1>
                    </div>

                    <div className={classes.contacts}>
                        <a href={configuration.sitePhoneUrl} className={classes.phone}>{configuration.sitePhone}</a>
                        <a href={configuration.siteEmailUrl} className={classes.email}>{configuration.siteEmail}</a>
                    </div>
                </div>

                <div className={classes.block}>
                    {formType === 'login' && <LoginForm onChangeType={(value: string) => setFormType(value)}/>}

                    {formType === 'registration' &&
                    <RegistrationForm onChangeType={(value: string) => setFormType(value)}/>}

                    {formType === 'forgot' && <ForgotForm onChangeType={(value: string) => setFormType(value)}/>}
                </div>
            </div>
        </section>
    )
}

HeadPanel.displayName = 'HeadPanel'

export default HeadPanel