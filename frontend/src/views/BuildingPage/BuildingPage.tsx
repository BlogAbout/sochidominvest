import React from 'react'
import Button from '../../components/Button/Button'
import openPopupBuildingCreate from '../../components/PopupBuildingCreate/PopupBuildingCreate'
import classes from './BuildingPage.module.scss'

const BuildingPage: React.FC = () => {
    const onClickAddHandler = () => {
        openPopupBuildingCreate(document.body, {
            onSave: () => {
                // Todo
            }
        })
    }

    return (
        <main className={classes.BuildingPage}>
            <div className={classes.filter}>
                <Button type='save' icon={'bolt'} onClick={() => console.log('add')}>Новинки</Button>

                <Button type='save' icon={'percent'} onClick={() => console.log('add')}>Акции</Button>

                <Button type='save' icon={'star'} onClick={() => console.log('add')}>Популярное</Button>

                <Button type='save' icon={'flag'} onClick={() => console.log('add')}>Незаконные</Button>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Недвижимость</span>
                    <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
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

BuildingPage.displayName = 'BuildingPage'

export default BuildingPage