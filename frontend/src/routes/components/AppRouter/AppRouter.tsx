import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../routes'
import Main from '../../../views/Main/Main'
import Login from '../../../views/Login/Login'
import Registration from '../../../views/Registration/Registration'
import classes from './AppRouter.module.scss'

const AppRouter: React.FC = () => {
    const isAuth = false

    return (
        <div className={classes.mainContainer}>
            {!isAuth ?
                <Routes>
                    <Route path={RouteNames.MAIN} element={<Main/>}/>
                    <Route path={RouteNames.LOGIN} element={<Login/>}/>
                    <Route path={RouteNames.REGISTRATION} element={<Registration/>}/>
                </Routes>
                :
                <Routes>
                    <Route path={RouteNames.PROFILE} element={<Main/>}/>
                </Routes>
            }
        </div>
    )
}

export default AppRouter