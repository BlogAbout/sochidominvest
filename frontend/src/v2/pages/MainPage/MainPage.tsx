import React from 'react'
import DefaultView from '../../views/DefaultView/DefaultView'
import SectionAbout from './components/SectionAbout/SectionAbout'
import SectionBanner from './components/SectionBanner/SectionBanner'
import SectionBuildings from './components/SectionBuildings/SectionBuildings'
import SectionCallback from './components/SectionCallback/SectionCallback'
import SectionAdvantages from './components/SectionAdvantages/SectionAdvantages'
import SectionArticles from './components/SectionArticles/SectionArticles'

const MainPage: React.FC = (): React.ReactElement => {
    return (
        <DefaultView isMain
                     pageTitle='СочиДомИнвест'
                     pageDescription='Многофункциональный сервис в теме недвижимость. Покупка, продажа, аренда, инвестирование. Сопровождение сделок под ключ с прозрачным сервисом, отчётами и уведомлениями.'
        >
            <SectionBanner/>

            <SectionBuildings/>

            <SectionCallback/>

            <SectionAbout/>

            <SectionAdvantages/>

            <SectionArticles/>
        </DefaultView>
    )
}

MainPage.displayName = 'MainPage'

export default React.memo(MainPage)