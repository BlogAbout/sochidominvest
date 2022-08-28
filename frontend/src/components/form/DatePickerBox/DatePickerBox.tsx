import React, {useState} from 'react'
import moment, {Moment} from 'moment'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {openPopup, removePopup} from '../../../helpers/popupHelper'
import Box from '../Box/Box'
import classes from './DatePickerBox.module.scss'

interface Props extends PopupProps {
    date?: string | moment.MomentInput
    selectType?: 'month' | 'day' | 'year'
    existingDates?: string[]
    autoClose?: boolean

    onSelect(date: string, e?: React.MouseEvent): void

    onChangeMonth?(): void
}

const defaultProps: Props = {
    selectType: 'day',
    existingDates: [],
    autoClose: false,
    onSelect: (date: string, e?: React.MouseEvent) => {
        console.info('DatePicker onSelect', date, e)
    }
}

const DatePicker: React.FC<Props> = (props) => {
    const [info, setInfo] = useState({
        day: (getPropsDate()).date(),
        month: (getPropsDate()).month(),
        year: (getPropsDate()).year(),
        selected: moment()
            .year((getPropsDate()).year())
            .month((getPropsDate()).month())
            .date((getPropsDate()).date()),
        type: props.selectType
    })

    function getPropsDate(propsDate = props.date) {
        let m = moment(propsDate)

        if (propsDate && m.isValid()) {
            return moment(m.format('YYYY-MM-DD'))
        } else {
            if (propsDate) {
                console.warn('В DatePicker подана некорректная дата: ' + propsDate + '. Подставлена текущая дата.')
            }

            return moment()
        }
    }

    const firstDayOfMonth = () => {
        return moment().year(info.year).month(info.month).startOf('month')
    }

    // Обработка выбора ячейки года
    const handlerYearCellClick = (year: number) => {
        setInfo({
            ...info,
            type: 'month',
            year
        })
    }

    // Отрисовка контента по типу дней месяца, месяцев года или десятилетия
    const renderContent = () => {
        switch (info.type) {
            case 'year':
                return renderYears()
            case 'month':
                return renderMonths()
            case 'day':
            default:
                return renderWeeks()
        }
    }

    // Обработка клика в селектор
    const handlerHeaderClick = () => {
        switch (info.type) {
            case 'year':
                //this.setState({type: 'day'})
                break
            case 'month':
                setInfo({...info, type: 'year'})
                break
            case 'day':
            default:
                setInfo({...info, type: 'month'})
                break
        }
    }

    // Возвращение текста селектора между стрелочек
    const getSelectorText = () => {
        switch (info.type) {
            case 'year':
                let year10 = info.year - (info.year % 10)
                return `${year10 - 1} - ${year10 + 10}`
            case 'month':
                return info.year
            case 'day':
            default:
                return moment(firstDayOfMonth()).format('MMMM YYYY')
        }
    }

    // Отрисовка стрелочки влево
    const renderLeft = () => {
        let month = info.month
        let year = info.year

        switch (info.type) {
            case 'year':
                year -= 10
                break
            case 'month':
                year--
                break
            case 'day':
            default:
                month--
                if (month < 0) {
                    month = 11
                    year--
                }
                break
        }

        return (
            <div className={classes.arrowLeft}
                 onClick={() => setInfo({...info, month, year})}
            />
        )
    }

    // Отрисовка стрелочки вправо
    const renderRight = () => {
        let month = info.month
        let year = info.year

        switch (info.type) {
            case 'year':
                year += 10
                break
            case 'month':
                year++
                break
            case 'day':
            default:
                month++
                if (month > 11) {
                    month = 0
                    year++
                }
                break
        }

        return (
            <div className={classes.arrowRight}
                 onClick={() => setInfo({...info, month, year})}
            />
        )
    }

    // Отрисовка заголовка с названиями дней недели
    const renderWeekHeader = () => {
        let days = ['Пн', 'Вт', 'Ск', 'Чт', 'Пт', 'Сб', 'Вс']

        return days.map((day, index) => {
            return <div key={day + index} className={classes.cellHeader}>{day}</div>
        })
    }

    // Возвращение 42 дня для первого дня месяца со смещением назад на предыдущий месяц
    const getDaysOfPrevMonth = (countDays = 7) => {
        const count = 42
        let days = []

        for (let x = countDays; x--;) {
            let d = moment(firstDayOfMonth())
            d.date(-x)
            days.push(d)
        }

        for (let x = 1; days.length < count; x++) {
            let d = moment(firstDayOfMonth())
            d.date(x)
            days.push(d)
        }

        return days
    }

    // Отрисовка всех дней месяца
    const renderWeeks = () => {
        let dayOfWeek = moment(firstDayOfMonth()).isoWeekday()
        let countDayOfPrevMonth = dayOfWeek === 1 ? 7 : dayOfWeek - 1
        let days = getDaysOfPrevMonth(countDayOfPrevMonth)
        let weeks = []

        for (let week = 0; week < 6; week++) {
            weeks.push(renderWeek(days, week))
        }

        return (
            <div className={classes.weekContent}>
                <div className={classes.weekHeader}>{renderWeekHeader()}</div>
                <div className={classes.weekContentLine}>{weeks}</div>
            </div>
        )
    }

    // Отрисовка одной недели
    const renderWeek = (days: Moment[], week: number) => {
        let line = []

        for (let x = 0; x < 7; x++) {
            line.push(renderCell(days[week * 7 + x]))
        }

        return (
            <div key={'week' + week} className={classes.weekLine}>{line}</div>
        )
    }

    // Отрисовка ячейки дня
    const renderCell = (date: Moment) => {
        let cellClass = (info.month) === date.month() ? classes.cellActive : classes.cellActiveGrey

        if (date.valueOf() === info.selected.valueOf()) {
            cellClass = classes.cellSelected
        }

        if (moment().isSame(date, 'days')) {
            cellClass = classes.cellSelectedCurrentDay
        }

        let existingDate = false

        if (props.existingDates) {
            const dateFormatted = moment(date).format('L')

            if (props.existingDates.includes(dateFormatted)) {
                existingDate = true
            }
        }

        return (
            <div className={classes.cellSize} key={date.format('YYYY-MM-DD')}
                 onClick={handlerCellClick.bind(this, date)}
            >
                <div key={date.format('YYYY-MM-DD')}
                     className={cellClass}
                >
                    {date.date()}
                    {existingDate ? <div className={classes.existingDate}/> : null}
                </div>
            </div>
        )
    }

    // Обработка выбора ячейки дня
    const handlerCellClick = (date: Moment, e: React.MouseEvent) => {
        setInfo({
            ...info,
            month: date.month(),
            year: date.year(),
            selected: date
        })

        props.onSelect(moment(date).format('L'), e)
    }

    // Отрисовка 12 месяцев
    const renderMonths = () => {
        return (
            <div>
                <div className={classes.weekLine}>
                    {renderWeekCell(0)}
                    {renderWeekCell(1)}
                    {renderWeekCell(2)}
                    {renderWeekCell(3)}
                </div>
                <div className={classes.weekLine}>
                    {renderWeekCell(4)}
                    {renderWeekCell(5)}
                    {renderWeekCell(6)}
                    {renderWeekCell(7)}
                </div>
                <div className={classes.weekLine}>
                    {renderWeekCell(8)}
                    {renderWeekCell(9)}
                    {renderWeekCell(10)}
                    {renderWeekCell(11)}
                </div>
            </div>
        )
    }

    // Отрисовка ячейки месяца
    const renderWeekCell = (month: number) => {
        let cellClass = (month === info.month && info.year === info.selected.year()) ? classes.weekCellSelected : classes.weekCell

        return (
            <div className={classes.weekCellWrap}>
                <div className={cellClass}
                     onClick={handlerWeekCellClick.bind(this, month)}
                >
                    {moment.monthsShort(month)}
                </div>
            </div>
        )
    }

    // Обработка выбора ячейки месяца
    const handlerWeekCellClick = (month: number, e: React.MouseEvent) => {
        setInfo({
            ...info,
            type: props.selectType,
            month
        })

        if (props.selectType === 'month') {
            let value = moment({year: info.year, month, day: 1})
            props.onSelect(value.format('L'), e)
        }
    }

    // Отрисовка десятилетия
    const renderYears = () => {
        let year10 = info.year - (info.year % 10)

        return (
            <div>
                <div className={classes.weekLine}>
                    {renderYearCell(year10 - 1)}
                    {renderYearCell(year10)}
                    {renderYearCell(year10 + 1)}
                    {renderYearCell(year10 + 2)}
                </div>
                <div className={classes.weekLine}>
                    {renderYearCell(year10 + 3)}
                    {renderYearCell(year10 + 4)}
                    {renderYearCell(year10 + 5)}
                    {renderYearCell(year10 + 6)}
                </div>
                <div className={classes.weekLine}>
                    {renderYearCell(year10 + 7)}
                    {renderYearCell(year10 + 8)}
                    {renderYearCell(year10 + 9)}
                    {renderYearCell(year10 + 10)}
                </div>
            </div>
        )
    }

    // Отрисовка ячейки года
    const renderYearCell = (year: number) => {
        let cellClass = (year === info.selected.year()) ? classes.weekCellSelected : classes.weekCell

        return (
            <div className={classes.weekCellWrap}>
                <div className={cellClass}
                     onClick={handlerYearCellClick.bind(this, year)}
                >
                    {year}
                </div>
            </div>
        )
    }

    return (
        <div className={classes.normal}>
            <div className={classes.header}>
                <div className={classes.headerWrap}>{renderLeft()}</div>
                <div className={classes.headerWrapFlex}/>
                <div className={classes.headerWrapFlex}>
                    <div className={classes.selectorMonth} onClick={handlerHeaderClick.bind(this)}>
                        {getSelectorText()}
                    </div>
                </div>

                <div className={classes.headerWrapFlex}/>
                <div className={classes.headerWrap}>{renderRight()}</div>
            </div>

            {renderContent()}
        </div>
    )
}

DatePicker.defaultProps = defaultProps

interface DatePickerBoxProps extends PopupProps {
    date?: string | moment.MomentInput
    hideIcon?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    fontSize?: string
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    errorText?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    width?: string | number
    margin?: string | number
    selectType?: 'month' | 'day' | 'year'

    onSelect(date: string, e?: React.MouseEvent): void
}

const defaultDatePickerBoxProps: DatePickerBoxProps = {
    placeHolder: 'Выберите дату',
    hideIcon: false,
    selectType: 'day',
    onSelect: (date: string, e?: React.MouseEvent) => {
        console.info('DatePickerBox onSelect', date, e)
    }
}

const DatePickerBox: React.FC<DatePickerBoxProps> = (props) => {
    const handlerClick = (e: React.MouseEvent) => {
        openPopupDatePicker(e.currentTarget, {
            onSelect: handlerOnChange.bind(this),
            date: props.date
        })
    }

    const onClearHandler = (e: React.MouseEvent) => {
        props.onSelect('', e)
    }

    const handlerOnChange = (date: string, e: React.MouseEvent) => {
        props.onSelect(date, e)
    }

    return (
        <Box {...props}
             value={props.date ? moment(props.date).format('L') : null}
             styleType={props.styleType}
             showArrow={props.styleType === 'minimal'}
             fontSize={props.fontSize}
             type='picker'
             onChange={handlerClick.bind(this)}
             onClear={onClearHandler.bind(this)}
             showDate={!props.hideIcon}
        />
    )
}

DatePickerBox.defaultProps = defaultDatePickerBoxProps
DatePickerBox.displayName = 'DatePickerBox'

const PopupDatePicker: React.FC<DatePickerBoxProps> = (props) => {
    const close = () => {
        removePopup(props.id || '')
    }

    const handlerOnSelect = (date: string, e: React.MouseEvent) => {
        props.onSelect(date, e)
        close()
    }

    return (
        <div className={classes.popup}>
            <DatePicker onSelect={handlerOnSelect.bind(this)}
                        date={props.date}
                        selectType={props.selectType}
            />
        </div>
    )
}

function openPopupDatePicker(target: any, popupProps: DatePickerBoxProps = {} as DatePickerBoxProps, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(PopupDatePicker, popupProps, undefined, target, displayOptions)
}

export {
    DatePickerBox,
    openPopupDatePicker
}