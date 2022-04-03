import React from 'react'
import {Link} from 'react-router-dom'
import {RouteNames} from '../../../../../routes/routes'
import classes from './SectionAdvanced.module.scss'

const SectionAdvanced: React.FC = () => {
    return (
        <section className={classes.SectionAdvanced}>
            <div className={classes.container}>
                <div className={classes.list}>
                    <div className={classes.item}>
                        <div className={classes.content}>
                            <p>Чтобы получить доступ к полному функционалу системой, а также обширной базе данных недвижимости, авторизуйтесь или пройдите простую процедуру регистрации.</p>
                            <span onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Войти / Зарегистрироваться</span>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.content}>
                            <p>Ознакомьтесь с нашими предложениями на рынке недвижимости, узнайте актуальную информацию. Обширный выбор и постоянная актуализация данных.</p>
                            <Link to={RouteNames.PUBLIC_BUILDING}>Смотреть</Link>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.content}>
                            <p>Узнайте о последних событиях и будьте в курсе новостей на рынке недвижимости. Не пропустите наши выгодные акции от застройщиков.</p>
                            <Link to={RouteNames.PUBLIC_ARTICLE}>Узнать</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

SectionAdvanced.displayName = 'SectionAdvanced'

export default SectionAdvanced