import React from 'react'
import classes from './TariffPagePanel.module.scss'
import PageInfo from "../../../components/ui/PageInfo/PageInfo";
import Title from "../../../components/ui/Title/Title";
import BlockingElement from "../../../components/ui/BlockingElement/BlockingElement";
import Button from "../../../components/form/Button/Button";

const TariffPagePanel: React.FC = () => {
    return (
        <div className={classes.TariffPagePanel}>
            <PageInfo title='Тарифы'/>

            <div className={classes.Content}>
                <Title type={1}>Тарифы</Title>

                <BlockingElement fetching={false} className={classes.list}>
                    <div className={classes.item}>
                        <div className={classes.head}>
                            <h3>Базовый</h3>
                            <div className={classes.cost}>3 000 руб.</div>
                        </div>
                        <div className={classes.advanced}>
                            <ul>
                                <li>3 активных объекта недвижимости</li>
                                <li>5 активных квартир в шахматке к каждому объекту недвижимости</li>
                                <li>300 уникальных просмотров на участие в публичных просмотрах</li>
                            </ul>
                        </div>
                        <div className={classes.buttons}>
                            <Button type='save'
                                    onClick={() => console.log('base')}
                                    disabled={true}
                                    title='Выбран'
                            >Выбран</Button>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.head}>
                            <h3>Бизнес</h3>
                            <div className={classes.cost}>5 000 руб.</div>
                        </div>
                        <div className={classes.advanced}>
                            <ul>
                                <li>5 активных объекта недвижимости</li>
                                <li>8 активных квартир в шахматке к каждому объекту недвижимости</li>
                                <li>500 уникальных просмотров на участие в публичных просмотрах</li>
                                <li>Доступ к конструктору документов</li>
                            </ul>
                        </div>
                        <div className={classes.buttons}>
                            <Button type='save'
                                    onClick={() => console.log('business')}
                                    title='Выбрать'
                            >Выбрать</Button>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.head}>
                            <h3>Эффективность Плюс</h3>
                            <div className={classes.cost}>10 000 руб.</div>
                        </div>
                        <div className={classes.advanced}>
                            <ul>
                                <li>20 активных объекта недвижимости</li>
                                <li>Нелимитированное количество активных квартир в шахматке к каждому объекту недвижимости</li>
                                <li>Нелимитированное количество уникальных просмотров на участие в публичных просмотрах</li>
                                <li>Доступ к конструктору документов</li>
                                <li>Прямая связь с агентствами и застройщиками</li>
                                <li>Помощь наших менеджеров в подборе и организации сделок</li>
                            </ul>
                        </div>
                        <div className={classes.buttons}>
                            <Button type='save'
                                    onClick={() => console.log('effective')}
                                    title='Выбрать'
                            >Выбрать</Button>
                        </div>
                    </div>
                </BlockingElement>
            </div>
        </div>
    )
}

TariffPagePanel.displayName = 'TariffPagePanel'

export default TariffPagePanel