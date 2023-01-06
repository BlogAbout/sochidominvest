import React, {useEffect} from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../helpers/routerHelper'
import {ToastContainer} from 'react-toastify'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import MainPage from '../../pages/MainPage/MainPage'
import AboutPage from '../../pages/AboutPage/AboutPage'
import PolicyPage from '../../pages/PolicyPage/PolicyPage'
import FaqPage from '../../pages/FaqPage/FaqPage'
import ArticlesPage from '../../pages/ArticlesPage/ArticlesPage'
import ArticlePage from '../../pages/ArticlePage/ArticlePage'
import BuildingsPage from '../../pages/BuildingsPage/BuildingsPage'
import BuildingPage from '../../pages/BuildingPage/BuildingPage'
import CatalogPage from '../../pages/CatalogPage/CatalogPage'
import ReportPage from '../../pages/ReportsPage/ReportsPage'
import ToolPage from '../../pages/ToolPage/ToolPage'
import AdministrationPage from '../../pages/AdministrationPage/AdministrationPage'
import SupportPage from '../../pages/SupportPage/SupportPage'
import QuestionPage from '../../pages/QuestionsPage/QuestionsPage'
import DevelopersPage from '../../pages/DevelopersPage/DevelopersPage'
import AgentsPage from '../../pages/AgentsPage/AgentsPage'
import PostsPage from '../../pages/PostsPage/PostsPage'
import CompilationsPage from '../../pages/CompilationsPage/CompilationsPage'
import classes from './AppRouter.module.scss'
import 'react-toastify/dist/ReactToastify.css'

const AppRouter: React.FC = () => {
    const {isAuth, user} = useTypedSelector(state => state.userReducer)

    const {fetchSettings} = useActions()

    useEffect(() => {
        if (isAuth) {
            fetchSettings()
        }
    }, [isAuth])

    return (
        <div className={classes.AppRouter}>
            <Routes>
                <Route path={RouteNames.MAIN} element={<MainPage/>}/>
                <Route path={RouteNames.ABOUT} element={<AboutPage/>}/>
                <Route path={RouteNames.POLICY} element={<PolicyPage/>}/>
                <Route path={RouteNames.FAQ} element={<FaqPage/>}/>
                <Route path={RouteNames.ARTICLE} element={<ArticlesPage/>}/>
                <Route path={RouteNames.ARTICLE_ITEM} element={<ArticlePage isPublic/>}/>
                <Route path={RouteNames.BUILDING} element={<BuildingsPage/>}/>
                <Route path={RouteNames.BUILDING_ITEM} element={<BuildingPage role={user.role} isPublic/>}/>
                <Route path={RouteNames.RENT} element={<BuildingsPage isRent/>}/>
                <Route path={RouteNames.RENT_ITEM} element={<BuildingPage role={user.role} isPublic isRent/>}/>

                {isAuth ?
                    <>
                        <Route path={RouteNames.P_CATALOG} element={<CatalogPage name='Каталоги' type='catalog'/>}/>
                        <Route path={RouteNames.P_CRM} element={<CatalogPage name='CRM' type='crm'/>}/>
                        <Route path={RouteNames.P_REPORT} element={<ReportPage/>}/>
                        <Route path={RouteNames.P_TOOL} element={<ToolPage/>}/>
                        <Route path={RouteNames.P_ADMINISTRATION} element={<AdministrationPage/>}/>
                        <Route path={RouteNames.P_SUPPORT} element={<SupportPage/>}/>
                        <Route path={RouteNames.P_QUESTION} element={<QuestionPage/>}/>
                        <Route path={RouteNames.P_DEVELOPER} element={<DevelopersPage/>}/>
                        <Route path={RouteNames.P_AGENT} element={<AgentsPage/>}/>
                        <Route path={RouteNames.P_POST} element={<PostsPage/>}/>
                        <Route path={RouteNames.P_COMPILATION} element={<CompilationsPage/>}/>
                    </>
                    : null
                }
            </Routes>

            <ToastContainer position={'bottom-right'}
                            autoClose={5000}
                            draggablePercent={60}
                            pauseOnHover={true}
                            closeOnClick={true}
                            hideProgressBar={true}
                            draggable={true}
            />
        </div>
    )
}

export {AppRouter}