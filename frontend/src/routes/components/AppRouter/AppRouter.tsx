import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../routes'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import Main from '../../../views/public/Main/Main'
import Policy from '../../../views/public/Policy/Policy'
import AboutPagePublic from '../../../views/public/AboutPagePublic/AboutPagePublic'
import Desktop from '../../../views/private/Desktop/Desktop'
import UserItemPage from '../../../views/UserItemPage/UserItemPage'
import UserPage from '../../../views/UserPage/UserPage'
import BuildingItemPage from '../../../views/BuildingItemPage/BuildingItemPage'
import BuildingPage from '../../../views/BuildingPage/BuildingPage'
import BuildingItemPagePublic from '../../../views/public/BuildingItemPagePublic/BuildingItemPagePublic'
import BuildingListPage from '../../../views/public/BuildingListPage/BuildingListPage'
import DeveloperPage from '../../../views/private/DeveloperPage/DeveloperPage'
import Document from '../../../views/Document/Document'
import Report from '../../../views/Report/Report'
import Tool from '../../../views/Tool/Tool'
import Support from '../../../views/private/Support/Support'
import FavoritePage from '../../../views/FavoritePage/FavoritePage'
import CompilationPage from '../../../views/CompilationPage/CompilationPage'
import Navigation from '../../../components/Navigation/Navigation'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import SidebarRight from '../../../components/SidebarRight/SidebarRight'
import HeaderDefault from '../../../components/HeaderDefault/HeaderDefault'
import FooterDefault from '../../../components/FooterDefault/FooterDefault'
import classes from './AppRouter.module.scss'

const AppRouter: React.FC = () => {
    const {isAuth} = useTypedSelector(state => state.userReducer)

    return (
        <div className={classes.AppRouter}>
            {!isAuth ?
                <div className={classes.container}>
                    <HeaderDefault/>

                    <Routes>
                        <Route path={RouteNames.MAIN} element={<Main/>}/>
                        <Route path={RouteNames.PUBLIC_POLICY} element={<Policy/>}/>
                        <Route path={RouteNames.PUBLIC_BUILDING_ITEM} element={<BuildingItemPagePublic/>}/>
                        <Route path={RouteNames.PUBLIC_BUILDING} element={<BuildingListPage/>}/>
                        <Route path={RouteNames.PUBLIC_ABOUT} element={<AboutPagePublic/>}/>
                    </Routes>

                    <FooterDefault/>
                </div>
                :
                <div className={classes.container}>
                    <Navigation/>

                    <SidebarLeft/>

                    <div className={classes.serviceContent}>
                        <Routes>
                            <Route path={RouteNames.MAIN} element={<Desktop/>}/>
                            <Route path={RouteNames.USER_ITEM} element={<UserItemPage/>}/>
                            <Route path={RouteNames.USER} element={<UserPage/>}/>
                            <Route path={RouteNames.BUILDING_ITEM} element={<BuildingItemPage/>}/>
                            <Route path={RouteNames.BUILDING} element={<BuildingPage/>}/>
                            <Route path={RouteNames.DEVELOPER} element={<DeveloperPage/>}/>
                            <Route path={RouteNames.DOCUMENT} element={<Document/>}/>
                            <Route path={RouteNames.REPORT} element={<Report/>}/>
                            <Route path={RouteNames.TOOL} element={<Tool/>}/>
                            <Route path={RouteNames.SUPPORT} element={<Support/>}/>
                            <Route path={RouteNames.FAVORITE} element={<FavoritePage/>}/>
                            <Route path={RouteNames.COMPILATION} element={<CompilationPage/>}/>
                        </Routes>
                    </div>

                    <SidebarRight/>
                </div>
            }
        </div>
    )
}

export default AppRouter