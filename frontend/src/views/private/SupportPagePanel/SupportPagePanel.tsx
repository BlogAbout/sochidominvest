import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {compareText} from '../../../helpers/filterHelper'
import {feedStatuses} from '../../../helpers/supportHelper'
import {IFeed} from '../../../@types/IFeed'
import {IFilterContent} from '../../../@types/IFilter'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import FeedService from '../../../api/FeedService'
import SearchBox from '../../../components/SearchBox/SearchBox'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import Button from '../../../components/Button/Button'
import SupportList from '../../../components/SupportList/SupportList'
import openPopupSupportCreate from '../../../components/PopupSupportCreate/PopupSupportCreate'
import classes from './SupportPagePanel.module.scss'

const SupportPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [feeds, setFeeds] = useState<IFeed[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterFeeds, setFilterFeeds] = useState<IFeed[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({
        status: ['new', 'process', 'clarification']
    })

    const {role, userId} = useTypedSelector(state => state.userReducer)


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
    }, [feeds, selectedType])

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

        if (['director', 'administrator', 'manager'].includes(role)) {
            if (value !== '') {
                setFilterFeeds(filterItemsHandler(feeds.filter((feed: IFeed) => {
                    return (!selectedType.length || selectedType.includes(feed.type)) &&
                        (compareText(feed.title, value) || (feed.name && compareText(feed.name, value)) || (feed.phone && compareText(feed.phone, value)))
                })))
            } else {
                setFilterFeeds(filterItemsHandler(!selectedType.length ? feeds : feeds.filter((feed: IFeed) => selectedType.includes(feed.type))))
            }
        } else {
            if (value !== '') {
                setFilterFeeds(filterItemsHandler(feeds.filter((feed: IFeed) => {
                    return (feed.author === userId) &&
                        (feed.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                            (feed.name && feed.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) ||
                            (feed.phone && feed.phone.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1))
                })))
            } else {
                setFilterFeeds(filterItemsHandler(feeds.filter((feed: IFeed) => feed.author === userId)))
            }
        }
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    const addHandler = () => {
        openPopupSupportCreate(document.body, {
            onSave: () => onSave()
        })
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IFeed[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IFeed) => {
            return filters.status.includes(item.status)
        })
    }

    const filtersContent: IFilterContent[] = [
        {
            title: 'Статус',
            type: 'checker',
            multi: true,
            items: feedStatuses,
            selected: filters.status,
            onSelect: (values: string[]) => {
                setFilters({...filters, status: values})
            }
        }
    ]

    return (
        <main className={classes.SupportPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Техническая поддержка - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <SidebarLeft filters={filtersContent}/>

            {['director', 'administrator', 'manager'].includes(role) ?
                <div className={classes.filter}>
                    <Button type={selectedType.includes('feed') ? 'regular' : 'save'}
                            icon={'headset'}
                            onClick={() => onClickFilterButtonHandler('feed')}
                    >Заявки</Button>

                    <Button type={selectedType.includes('callback') ? 'regular' : 'save'}
                            icon={'phone'}
                            onClick={() => onClickFilterButtonHandler('callback')}
                    >Звонки</Button>

                    <Button type={selectedType.includes('question') ? 'regular' : 'save'}
                            icon={'circle-question'}
                            onClick={() => onClickFilterButtonHandler('question')}
                    >Вопросы</Button>

                    <Button type={selectedType.includes('other') ? 'regular' : 'save'}
                            icon={'star'}
                            onClick={() => onClickFilterButtonHandler('other')}
                    >Другое</Button>

                    <SearchBox value={searchText} onChange={search.bind(this)}/>
                </div>
                : null
            }

            <div className={classes.Content}>
                <h1>
                    <span>Техническая поддержка</span>
                    <Button type='apply' icon='plus' onClick={addHandler.bind(this)}>Создать заявку</Button>
                </h1>

                <SupportList feeds={filterFeeds} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

SupportPagePanel.displayName = 'SupportPagePanel'

export default SupportPagePanel