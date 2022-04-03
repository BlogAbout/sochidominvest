import React from 'react'
import Helmet from 'react-helmet'
import HeadPanel from './components/HeadPanel/HeadPanel'
import SectionInfo from './components/SectionInfo/SectionInfo'
import SectionAdvanced from './components/SectionAdvanced/SectionAdvanced'
import classes from './Main.module.scss'

const Main: React.FC = () => {
    return (
        <div className={classes.Main}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>СочиДомИнвест - Авторизованный брокер недвижимости Сочи</title>
                <meta name='description'
                      content='Многофункциональный сервис в теме недвижимость. Покупка, продажа, аренда, инвестирование. Сопровождение сделок под ключ с прозрачным сервисом, отчётами и уведомлениями.'
                />
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <main className={classes.Content}>
                <HeadPanel/>

                <SectionAdvanced/>

                <SectionInfo/>
            </main>
        </div>
    )
}

export default Main