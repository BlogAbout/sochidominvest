import React, {useEffect, useState} from 'react'
import {IFeed} from '../../../@types/IFeed'
import FeedService from '../../../api/FeedService'
import Button from '../../../components/Button/Button'
import SupportList from '../../../components/SupportList/SupportList'
import classes from './SupportPage.module.scss'

const SupportPage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [feeds, setFeeds] = useState<IFeed[]>([])

    useEffect(() => {
        if (isUpdate) {
            FeedService.fetchFeeds({active: [0, 1]})
                .then((response: any) => {
                    setFeeds(response.data)
                })
                .catch((error: any) => {
                    console.error('Произошла ошибка загрузки данных', error)
                })
                .finally(() => {
                    setFetching(false)
                    setIsUpdate(false)
                })
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    return (
        <main className={classes.SupportPage}>
            <div className={classes.filter}>
                <Button type='save' icon={'headset'} onClick={() => console.log('add')}>Заявки</Button>

                <Button type='save' icon={'circle-question'} onClick={() => console.log('add')}>Вопросы</Button>

                <Button type='save' icon={'star'} onClick={() => console.log('add')}>Другое</Button>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Техническая поддержка</span>
                </h1>

                <SupportList feeds={feeds} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

SupportPage.displayName = 'SupportPage'

export default SupportPage