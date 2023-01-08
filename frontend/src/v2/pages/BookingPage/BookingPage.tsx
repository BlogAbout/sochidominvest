import React, {useEffect, useMemo, useState} from 'react'
import {IFilterContent} from '../../../@types/IFilter'
import {IBooking} from '../../../@types/IBooking'
import {bookingStatuses} from '../../../helpers/bookingHelper'
import BookingService from '../../../api/BookingService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import BookingList from './components/BookingList/BookingList'
import openPopupBookingCreate from '../../../components/popup/PopupBookingCreate/PopupBookingCreate'
import classes from './BookingPage.module.scss'

const BookingPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [bookings, setBookings] = useState<IBooking[]>([])
    const [filterBooking, setFilterBooking] = useState<IBooking[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        status: ['new', 'process', 'finish', 'cancel', 'remove']
    })

    useEffect(() => {
        fetchBookingsHandler()
    }, [])

    useEffect(() => {
        search()
    }, [bookings, filters])

    const fetchBookingsHandler = () => {
        setFetching(true)

        BookingService.fetchBookings({active: [0, 1]})
            .then((response: any) => setBookings(response.data))
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchBookingsHandler()
    }

    // Поиск
    const search = () => {
        if (!bookings || !bookings.length) {
            setFilterBooking([])
        }

        setFilterBooking(filterItemsHandler(bookings))
    }

    const onAddHandler = () => {
        openPopupBookingCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IBooking[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IBooking) => {
            return filters.status.includes(item.status)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Статус',
                type: 'checker',
                multi: true,
                items: bookingStatuses,
                selected: filters.status,
                onSelect: (values: string[]) => {
                    setFilters({...filters, status: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Список бронирования'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       className={classes.title}
                >Список бронирования</Title>

                <BookingList list={filterBooking} fetching={fetching} onSave={() => fetchBookingsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

BookingPage.displayName = 'BookingPage'

export default React.memo(BookingPage)