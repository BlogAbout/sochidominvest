import React from 'react'
import Helmet from 'react-helmet'
import classes from './AboutPage.module.scss'

const AboutPage: React.FC = () => {
    return (
        <main className={classes.AboutPage}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>О Компании - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.container}>
                    <div className={classes.block}>
                        <h1>
                            <span>О Компании</span>
                        </h1>

                        <p>Компания СОЧИДОМИНВЕСТ, создана в 2022 году, по инициативе группы инвесторов,
                            обладающих собственными объектами недвижимости, с целью упрощения процедуры входа и
                            выхода из объектов инвестирования с прозрачным сервисом, отчётами для полного понимания
                            всех этапов сделок.</p>
                        <p>Проект реализуется силами опытных специалистов-экспертов IT сферы, консалтинга, риелторов и
                            инвесторов.</p>
                        <p>СОЧИДОМИНВЕСТ сотрудничает со всеми застройщиками большого Сочи и собственниками
                            недвижимости.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

AboutPage.displayName = 'AboutPage'

export default AboutPage