import React from 'react'
import Wrapper from '../../../../components/ui/Wrapper/Wrapper'
import GridColumn from '../../../../components/ui/GridColumn/GridColumn'
import Grid from '../../../../components/ui/Grid/Grid'
import Title from '../../../../components/ui/Title/Title'
import classes from './SectionAbout.module.scss'

const SectionAbout: React.FC = (): React.ReactElement => {
    return (
        <section className={classes.SectionAbout}>
            <Wrapper>
                <div className={classes.inner}>
                    <Grid className={classes.cols} isVerticalCenter isHorizontalCenter>
                        <GridColumn width='35%'>
                            <Title type='h2' className={classes.title}>
                                Покупка, продажа и аренда первоклассной недвижимости в Сочи
                            </Title>
                        </GridColumn>

                        <GridColumn width='65%'>
                            <p>Многофункциональный сервис в теме недвижимость. Покупка, продажа, аренда, инвестирование.
                                Сопровождение сделок под ключ с прозрачным сервисом, отчётами и уведомлениями.</p>

                            <p>Актуальный каталог новостроек (застройщики) и вторичной недвижимости (собственники).</p>

                            <p>CRM система для управления сделками по недвижимости (продавец, клиент, риелтор. Просмотры
                                объектов, задачи, переговоры, договоры, оплата, ипотека, материнский капитал, военный
                                сертификат)</p>

                            <p>Система - авто заполнение договоров под любую ситуацию и подача в нужные инстанции.
                                Система проверки документов, экспертиза объектов.</p>

                            <p>Аренда (посуточная и на долгий срок) отелей и квартир, система бронирование отелей и
                                квартир.
                                CRM - система для управления персоналом и клиентами в теме аренда квартир, для
                                владельцев
                                квартир, и управляющих компаний.</p>

                            <p>Сервис предназначен для собственников квартир, застройщиков, риэлторов, агентов,
                                покупателей, арендаторов и предпринимателей.</p>

                            <p>Проект создаётся в рамках импорт замещение, цель: улучшение качества сервисов по продаже
                                и
                                аренде недвижимости.</p>
                        </GridColumn>
                    </Grid>
                </div>
            </Wrapper>
        </section>
    )
}

SectionAbout.displayName = 'SectionAbout'

export default React.memo(SectionAbout)