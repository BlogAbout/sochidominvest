import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../routes'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import Main from '../../../views/Main/Main'
import Policy from '../../../views/Policy/Policy'
import MainService from '../../../views/MainService/MainService'
import UserPage from '../../../views/UserPage/UserPage'
import BuildingPage from '../../../views/BuildingPage/BuildingPage'
import Document from '../../../views/Document/Document'
import Report from '../../../views/Report/Report'
import Tool from '../../../views/Tool/Tool'
import Navigation from '../../../components/Navigation/Navigation'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import SidebarRight from '../../../components/SidebarRight/SidebarRight'
import classes from './AppRouter.module.scss'

const AppRouter: React.FC = () => {
    const {isAuth} = useTypedSelector(state => state.userReducer)

    return (
        <div className={classes.AppRouter}>
            {!isAuth ?
                <div className={classes.container}>
                    <Routes>
                        <Route path={RouteNames.MAIN} element={<Main/>}/>
                        <Route path={RouteNames.POLICY} element={<Policy/>}/>
                    </Routes>
                </div>
                :
                <div className={classes.container}>
                    <Navigation/>

                    <SidebarLeft/>

                    <div className={classes.serviceContent}>
                        <Routes>
                            <Route path={RouteNames.MAIN} element={<MainService/>}/>
                            <Route path={RouteNames.USER} element={<UserPage/>}/>
                            <Route path={RouteNames.BUILDING} element={<BuildingPage/>}/>
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