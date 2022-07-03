import React, {useEffect} from 'react'
import {Route, Routes} from 'react-router-dom'
import {RouteNames} from '../../routes'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import MainPage from '../../../views/public/MainPage/MainPage'
import PolicyPage from '../../../views/public/PolicyPage/PolicyPage'
import AboutPage from '../../../views/public/AboutPage/AboutPage'
import PartnerItemPage from '../../../views/public/PartnerItemPage/PartnerItemPage'
import DesktopPagePanel from '../../../views/private/DesktopPagePanel/DesktopPagePanel'
import UserItemPagePanel from '../../../views/private/UserItemPagePanel/UserItemPagePanel'
import UserPagePanel from '../../../views/private/UserPagePanel/UserPagePanel'
import BuildingItemPagePanel from '../../../views/private/BuildingItemPagePanel/BuildingItemPagePanel'
import BuildingPagePanel from '../../../views/private/BuildingPagePanel/BuildingPagePanel'
import BuildingItemPage from '../../../views/public/BuildingItemPage/BuildingItemPage'
import BuildingPage from '../../../views/public/BuildingPage/BuildingPage'
import ArticleItemPagePanel from '../../../views/private/ArticleItemPagePanel/ArticleItemPagePanel'
import ArticlePagePanel from '../../../views/private/ArticlePagePanel/ArticlePagePanel'
import ArticlePage from '../../../views/public/ArticlePage/ArticlePage'
import CrmPagePanel from '../../../views/private/CrmPagePanel/CrmPagePanel'
import DeveloperItemPagePanel from '../../../views/private/CrmPagePanel/components/DeveloperItemPagePanel/DeveloperItemPagePanel'
import DeveloperPagePanel from '../../../views/private/CrmPagePanel/components/DeveloperPagePanel/DeveloperPagePanel'
import DocumentPagePanel from '../../../views/private/DocumentPagePanel/DocumentPagePanel'
import ReportPanel from '../../../views/private/ReportPanel/ReportPanel'
import ToolPanel from '../../../views/private/ToolPanel/ToolPanel'
import FileManagerPagePanel from '../../../views/private/FileManagerPagePanel/FileManagerPagePanel'
import SupportPagePanel from '../../../views/private/SupportPagePanel/SupportPagePanel'
import FavoritePagePanel from '../../../views/private/FavoritePagePanel/FavoritePagePanel'
import CompilationPagePanel from '../../../views/private/CompilationPagePanel/CompilationPagePanel'
import CompilationItemPagePanel from '../../../views/private/CompilationItemPagePanel/CompilationItemPagePanel'
import AdministrationPagePanel from '../../../views/private/AdministrationPagePanel/AdministrationPagePanel'
import AdvertisingMaterialsPagePanel from '../../../views/private/AdvertisingMaterialsPagePanel/AdvertisingMaterialsPagePanel'
import PartnerPanel from '../../../views/private/AdvertisingMaterialsPagePanel/components/PartnerPanel/PartnerPanel'
import BannerPanel from '../../../views/private/AdvertisingMaterialsPagePanel/components/BannerPanel/BannerPanel'
import WidgetPanel from '../../../views/private/AdvertisingMaterialsPagePanel/components/WidgetPanel/WidgetPanel'
import Navigation from '../../../components/ui/Navigation/Navigation'
import SidebarRight from '../../../components/ui/SidebarRight/SidebarRight'
import HeaderDefault from '../../../components/HeaderDefault/HeaderDefault'
import FooterDefault from '../../../components/ui/FooterDefault/FooterDefault'
import FaqPage from '../../../views/public/FaqPage/FaqPage'
import FaqPanel from '../../../views/private/AdvertisingMaterialsPagePanel/components/FaqPanel/FaqPanel'
import PostPagePanel from '../../../views/private/CrmPagePanel/components/PostPagePanel/PostPagePanel'
import classes from './AppRouter.module.scss'

const AppRouter: React.FC = () => {
    const {isAuth, role} = useTypedSelector(state => state.userReducer)

    const {fetchSettings} = useActions()

    useEffect(() => {
        if (isAuth) {
            fetchSettings()
        }
    }, [isAuth])

    return (
        <div className={classes.AppRouter}>
            {!isAuth ?
                <div className={classes.container}>
                    <HeaderDefault/>

                    <Routes>
                        <Route path={RouteNames.MAIN} element={<MainPage/>}/>
                        <Route path={RouteNames.PUBLIC_POLICY} element={<PolicyPage/>}/>
                        <Route path={RouteNames.PUBLIC_BUILDING_ITEM} element={<BuildingItemPage/>}/>
                        <Route path={RouteNames.PUBLIC_BUILDING} element={<BuildingPage/>}/>
                        <Route path={RouteNames.PUBLIC_ARTICLE_ITEM} element={<ArticleItemPagePanel public/>}/>
                        <Route path={RouteNames.PUBLIC_ARTICLE} element={<ArticlePage/>}/>
                        <Route path={RouteNames.PUBLIC_ABOUT} element={<AboutPage/>}/>
                        <Route path={RouteNames.PUBLIC_FAQ} element={<FaqPage/>}/>
                        <Route path={RouteNames.PUBLIC_PARTNER_ITEM} element={<PartnerItemPage/>}/>
                    </Routes>

                    <FooterDefault/>
                </div>
                :
                <div className={classes.container}>
                    <Navigation/>

                    <div className={classes.serviceContent}>
                        <Routes>
                            {['director', 'administrator'].includes(role) &&
                            <>
                                <Route path={RouteNames.USER_ITEM} element={<UserItemPagePanel/>}/>
                                <Route path={RouteNames.USER} element={<UserPagePanel/>}/>
                                <Route path={RouteNames.TOOL} element={<ToolPanel/>}/>
                                <Route path={RouteNames.ADMINISTRATION} element={<AdministrationPagePanel/>}/>
                                <Route path={RouteNames.ADVERTISING} element={<AdvertisingMaterialsPagePanel/>}/>
                                <Route path={RouteNames.ADVERTISING_PARTNER} element={<PartnerPanel/>}/>
                                <Route path={RouteNames.ADVERTISING_BANNER} element={<BannerPanel/>}/>
                                <Route path={RouteNames.ADVERTISING_WIDGET} element={<WidgetPanel/>}/>
                                <Route path={RouteNames.ADVERTISING_FAQ} element={<FaqPanel/>}/>
                            </>
                            }

                            {['director', 'administrator', 'manager'].includes(role) &&
                            <>
                                <Route path={RouteNames.CRM} element={<CrmPagePanel/>}/>
                                <Route path={RouteNames.CRM_DEVELOPER_ITEM} element={<DeveloperItemPagePanel/>}/>
                                <Route path={RouteNames.CRM_DEVELOPER} element={<DeveloperPagePanel/>}/>
                                <Route path={RouteNames.CRM_POST} element={<PostPagePanel/>}/>
                                <Route path={RouteNames.DOCUMENT} element={<DocumentPagePanel/>}/>
                                <Route path={RouteNames.REPORT} element={<ReportPanel/>}/>
                                <Route path={RouteNames.FILE_MANAGER} element={<FileManagerPagePanel/>}/>
                            </>
                            }

                            <Route path={RouteNames.MAIN} element={<DesktopPagePanel/>}/>
                            <Route path={RouteNames.BUILDING_ITEM} element={<BuildingItemPagePanel/>}/>
                            <Route path={RouteNames.BUILDING} element={<BuildingPagePanel/>}/>
                            <Route path={RouteNames.ARTICLE_ITEM} element={<ArticleItemPagePanel/>}/>
                            <Route path={RouteNames.ARTICLE} element={<ArticlePagePanel/>}/>
                            <Route path={RouteNames.SUPPORT} element={<SupportPagePanel/>}/>
                            <Route path={RouteNames.FAVORITE} element={<FavoritePagePanel/>}/>
                            <Route path={RouteNames.COMPILATION_ITEM} element={<CompilationItemPagePanel/>}/>
                            <Route path={RouteNames.COMPILATION} element={<CompilationPagePanel/>}/>
                        </Routes>
                    </div>

                    <SidebarRight/>
                </div>
            }
        </div>
    )
}

export default AppRouter