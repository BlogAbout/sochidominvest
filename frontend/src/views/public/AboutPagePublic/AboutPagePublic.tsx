import React from 'react'
import classes from './AboutPagePublic.module.scss'

const AboutPagePublic: React.FC = () => {
    return (
        <main className={classes.AboutPagePublic}>
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

AboutPagePublic.displayName = 'AboutPagePublic'

export default AboutPagePublic