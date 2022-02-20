import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../routes'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import Main from '../../../views/Main/Main'
import Policy from '../../../views/Policy/Policy'
import MainService from '../../../views/MainService/MainService'
import User from '../../../views/User/User'
import Building from '../../../views/Building/Building'
import Document from '../../../views/Document/Document'
import Report from '../../../views/Report/Report'
import Tool from '../../../views/Tool/Tool'
import HeaderDefault from '../../../components/HeaderDefault/HeaderDefault'
import FooterDefault from '../../../components/FooterDefault/FooterDefault'
import Navigation from '../../../components/Navigation/Navigation'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import SidebarRight from '../../../components/SidebarRight/SidebarRight'
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
                            <Route path={RouteNames.USER} element={<User/>}/>
                            <Route path={RouteNames.BUILDING} element={<Building/>}/>
                            <Route path={RouteNames.DOCUMENT} element={<Document/>}/>
                            <Route path={RouteNames.REPORT} element={<Report/>}/>
                            <Route path={RouteNames.TOOL} element={<Tool/>}/>
                        </Routes>
                    </div>

                    <SidebarRight/>
                </div>
            }
        </div>
    )
}

export default AppRouter