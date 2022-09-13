import React from 'react'
import Title from '../../../components/ui/Title/Title'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import classes from './AboutPage.module.scss'

const AboutPage: React.FC = () => {
    return (
        <main className={classes.AboutPage}>
            <PageInfo title='О Компании' description=''/>

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

                        <Title type={2}>Реквизиты</Title>

                        <p><strong>Название организации:</strong> ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ПРОХОДОВА ТАМАРА
                            ПАВЛОВНА</p>
                        <p><strong>Юридический адрес организации:</strong> 354340, РОССИЯ, КРАСНОДАРСКИЙ КРАЙ, Г СОЧИ,
                            УЛ СТАРОНАСЫПНАЯ, Д 23, КВ 68</p>
                        <p><strong>ИНН:</strong> 540490031607</p>
                        <p><strong>ОГРН:</strong> 322237500179704</p>
                        <p><strong>Расчетный счет:</strong> 40802810400003399670</p>
                        <p><strong>Банк:</strong> АО "ТИНЬКОФФ БАНК"</p>
                        <p><strong>ИНН банка:</strong> 7710140679</p>
                        <p><strong>БИК банка:</strong> 044525974</p>
                        <p><strong>Корреспондентский счет банка:</strong> 30101810145250000974</p>
                        <p>
                            <strong>Юридический адрес банка: </strong> Москва, 127287, ул. Хуторская 2-я, д. 38А, стр.
                            26
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

AboutPage.displayName = 'AboutPage'

export default AboutPage