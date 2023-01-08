import React, {useEffect, useMemo, useState} from 'react'
import {IFilterContent} from '../../../@types/IFilter'
import {IMailing} from '../../../@types/IMailing'
import {compareText} from '../../../helpers/filterHelper'
import {mailingTypes} from '../../../helpers/mailingHelper'
import MailingService from '../../../api/MailingService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import MailingList from './components/MailingList/MailingList'
import openPopupMailingCreate from '../../../components/popup/PopupMailingCreate/PopupMailingCreate'
import classes from './MailingsPage.module.scss'

const MailingsPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [mailings, setMailings] = useState<IMailing[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterMailing, setFilterMailing] = useState<IMailing[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['mail', 'compilation', 'notification'],
        status: ['-1', '0', '1', '2']
    })

    useEffect(() => {
        fetchMailingsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [mailings, filters])

    const fetchMailingsHandler = () => {
        setFetching(true)

        MailingService.fetchMailings({active: [0, 1]})
            .then((response: any) => setMailings(response.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchMailingsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!mailings || !mailings.length) {
            setFilterMailing([])
        }

        if (value !== '') {
            setFilterMailing(filterItemsHandler(mailings.filter((mailing: IMailing) => {
                return compareText(mailing.name, value)
            })))
        } else {
            setFilterMailing(filterItemsHandler(mailings))
        }
    }

    const onAddHandler = () => {
        openPopupMailingCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IMailing[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IMailing) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: mailingTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            },
            {
                title: 'Статус',
                type: 'checker',
                multi: true,
                items: [
                    {key: '-1', text: 'Ошибка'},
                    {key: '0', text: 'Остановлен'},
                    {key: '1', text: 'Запущен'},
                    {key: '2', text: 'Завершен'},
                ],
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Рассылки'>
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
                >Рассылки</Title>

                <MailingList list={filterMailing} fetching={fetching} onSave={() => fetchMailingsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

MailingsPage.displayName = 'MailingsPage'

export default React.memo(MailingsPage)