import React from 'react'
import LoginForm from './components/LoginForm/LoginForm'
import classes from './Login.module.scss'

const Login: React.FC = () => {
    return (
        <div className={classes['login-page-wrapper']}>
            <LoginForm/>
        </div>
    )
}

export default Login