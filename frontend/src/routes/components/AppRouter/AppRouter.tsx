import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../routes'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import Main from '../../../views/Main/Main'
import Policy from '../../../views/Policy/Policy'
import MainService from '../../../views/MainService/MainService'
import Building from '../../../views/Building/Building'
import HeaderDefault from '../../../components/HeaderDefault/HeaderDefault'
import FooterDefault from '../../../components/FooterDefault/FooterDefault'
import Navigation from '../../../components/Navigation/Navigation'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import SidebarRight from '../../../components/SidebarRight/SidebarRight'
import FooterService from '../../../components/FooterService/FooterService'
import classes from './AppRouter.module.scss'

const AppRouter: React.FC = () => {
    const {isAuth} = useTypedSelector(state => state.authReducer)

    return (
        <div className={classes.AppRouter}>
            {!isAuth ?
                <div className={classes.container}>
                    <HeaderDefault/>

                    <Routes>
                        <Route path={RouteNames.MAIN} element={<Main/>}/>
                        <Route path={RouteNames.POLICY} element={<Policy/>}/>
                    </Routes>

                    <FooterDefault/>
                </div>
                :
                <div className={classes.container}>
                    <Navigation/>

                    <SidebarLeft/>

                    <div className={classes.serviceContent}>
                        <Routes>
                            <Route path={RouteNames.MAIN} element={<MainService/>}/>
                            <Route path={RouteNames.BUILDING} element={<Building/>}/>
                        </Routes>

                        <FooterService/>
                    </div>

                    <SidebarRight/>
                </div>
            }
        </div>
    )
}

export default AppRouter