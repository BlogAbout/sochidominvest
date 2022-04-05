import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {IFeed} from '../../../@types/IFeed'
import FeedService from '../../../api/FeedService'
import SearchBox from '../../../components/SearchBox/SearchBox'
import Button from '../../../components/Button/Button'
import SupportList from '../../../components/SupportList/SupportList'
import classes from './SupportPagePanel.module.scss'

const SupportPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [feeds, setFeeds] = useState<IFeed[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterFeeds, setFilterFeeds] = useState<IFeed[]>([])

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

    useEffect(() => {
        search(searchText)
    }, [feeds])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!feeds || !feeds.length) {
            setFilterFeeds([])
        }

        if (value !== '') {
            setFilterFeeds(feeds.filter((feed: IFeed) => {
                return feed.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    (feed.name && feed.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) ||
                    (feed.phone && feed.phone.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1)
            }))
        } else {
            setFilterFeeds(feeds)
        }
    }

    return (
        <main className={classes.SupportPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Техническая поддержка - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type='save' icon={'headset'} onClick={() => console.log('add')}>Заявки</Button>

                <Button type='save' icon={'phone'} onClick={() => console.log('add')}>Звонки</Button>

                <Button type='save' icon={'circle-question'} onClick={() => console.log('add')}>Вопросы</Button>

                <Button type='save' icon={'star'} onClick={() => console.log('add')}>Другое</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Техническая поддержка</span>
                </h1>

                <SupportList feeds={filterFeeds} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

SupportPagePanel.displayName = 'SupportPagePanel'

export default SupportPagePanel