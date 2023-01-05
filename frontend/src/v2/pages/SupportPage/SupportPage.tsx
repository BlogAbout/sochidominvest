import React, {useEffect, useMemo, useState} from 'react'
import {IFeed} from '../../../@types/IFeed'
import {IFilterContent} from '../../../@types/IFilter'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {feedStatuses, feedTypes} from '../../../helpers/supportHelper'
import {compareText} from '../../../helpers/filterHelper'
import PanelView from '../../views/PanelView/PanelView'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import FeedService from '../../../api/FeedService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupSupportCreate from '../../components/popup/PopupSupportCreate/PopupSupportCreate'
import FeedList from './components/FeedList/FeedList'
import classes from './SupportPage.module.scss'

const SupportPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [feeds, setFeeds] = useState<IFeed[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterFeeds, setFilterFeeds] = useState<IFeed[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['feed', 'ticket', 'callback'],
        status: ['new', 'process', 'clarification']
    })

    const {user} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        fetchFeedsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [feeds, filters])

    const fetchFeedsHandler = () => {
        FeedService.fetchFeeds({active: [0, 1]})
            .then((response: any) => {
                setFeeds(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Обработчик изменений
    const onSave = () => {
        fetchFeedsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!feeds || !feeds.length) {
            setFilterFeeds([])
        }

        if (['director', 'administrator', 'manager'].includes(user.role)) {
            if (value !== '') {
                setFilterFeeds(filterItemsHandler(feeds.filter((feed: IFeed) => {
                    return compareText(feed.title, value) || (feed.name && compareText(feed.name, value)) || (feed.phone && compareText(feed.phone, value))
                })))
            } else {
                setFilterFeeds(filterItemsHandler(feeds))
            }
        } else {
            if (value !== '') {
                setFilterFeeds(filterItemsHandler(feeds.filter((feed: IFeed) => {
                    return (feed.author === user.id) &&
                        (feed.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                            (feed.name && feed.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) ||
                            (feed.phone && feed.phone.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1))
                })))
            } else {
                setFilterFeeds(filterItemsHandler(feeds.filter((feed: IFeed) => feed.author === user.id)))
            }
        }
    }

    const onAddHandler = () => {
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
            return filters.status.includes(item.status) && filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: feedTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            },
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
    }, [filters])

    return (
        <PanelView pageTitle='Техническая поддержка'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Техническая поддержка</Title>

                <FeedList list={filterFeeds} fetching={fetching} onSave={() => fetchFeedsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

SupportPage.displayName = 'SupportPage'

export default React.memo(SupportPage)