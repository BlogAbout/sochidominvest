import React from 'react'
import Button from '../../components/Button/Button'
import classes from './Building.module.scss'

const Building: React.FC = () => {
    return (
        <main className={classes.Building}>
            <div className={classes.filter}>
                <Button type='save' onClick={() => console.log('add')}>Все</Button>

                <Button type='save' onClick={() => console.log('add')}>Новинки</Button>

                <Button type='save' onClick={() => console.log('add')}>Акции</Button>

                <Button type='save' onClick={() => console.log('add')}>Популярное</Button>

                <Button type='save' onClick={() => console.log('add')}>Незаконные</Button>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Недвижимость</span>
                    <Button type='apply' onClick={() => console.log('add')}>+ Добавить</Button>
                </h1>

                <div className={classes.List}>
                    <div className={classes.item}>
                        <div className={classes.itemImage}>
                            image
                        </div>

                        <div className={classes.itemContent}>
                            <h2>ЖК Прибрежный</h2>
                            <div className={classes.address}>Курортный городок, ул. Ленина, 217а, Адлер</div>
                        </div>

                        <div className={classes.itemInfo}>
                            <div className={classes.counter}>1 квартира</div>
                            <div className={classes.cost}>От 4 890 000 руб.</div>
                            <div className={classes.costPer}>161 923 руб. за м<sup>2</sup></div>
                            <div className={classes.area}>26 м<sup>2</sup></div>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.itemImage}>
                            image
                        </div>

                        <div className={classes.itemContent}>
                            <h2>ЖК Прибрежный</h2>
                            <div className={classes.address}>Курортный городок, ул. Ленина, 217а, Адлер</div>
                        </div>

                        <div className={classes.itemInfo}>
                            <div className={classes.counter}>1 квартира</div>
                            <div className={classes.cost}>От 4 890 000 руб.</div>
                            <div className={classes.costPer}>161 923 руб. за м<sup>2</sup></div>
                            <div className={classes.area}>26 м<sup>2</sup></div>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.itemImage}>
                            image
                        </div>

                        <div className={classes.itemContent}>
                            <h2>ЖК Прибрежный</h2>
                            <div className={classes.address}>Курортный городок, ул. Ленина, 217а, Адлер</div>
                        </div>

                        <div className={classes.itemInfo}>
                            <div className={classes.counter}>1 квартира</div>
                            <div className={classes.cost}>От 4 890 000 руб.</div>
                            <div className={classes.costPer}>161 923 руб. за м<sup>2</sup></div>
                            <div className={classes.area}>26 м<sup>2</sup></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

Building.displayName = 'Building'

export default Building