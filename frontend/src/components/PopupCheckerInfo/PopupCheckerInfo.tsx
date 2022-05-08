import React, {useEffect, useState} from 'react'
import {IBuildingChecker, IBuildingHousing} from '../../@types/IBuilding'
import {ISelector} from '../../@types/ISelector'
import {PopupProps} from '../../@types/IPopup'
import {checkerFurnish, checkerStatuses} from '../../helpers/buildingHelper'
import {numberWithSpaces, round} from '../../helpers/numberHelper'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Header, Popup} from '../popup/Popup/Popup'
import showBackgroundBlock from '../ui/BackgroundBlock/BackgroundBlock'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import Empty from '../Empty/Empty'
import ComboBox from '../ComboBox/ComboBox'
import classes from './PopupCheckerInfo.module.scss'

interface Props extends PopupProps {
    buildingName: string
    list: IBuildingHousing
    housing: number
    fetching: boolean
    housingList: number[]
}

const defaultProps: Props = {
    buildingName: '',
    list: {} as IBuildingHousing,
    housing: 0,
    fetching: false,
    housingList: []
}

const PopupCheckerInfo: React.FC<Props> = (props) => {
    const [housing, setHousing] = useState(props.housing)
    const [filters, setFilters] = useState({
        furnish: 'all',
        status: 'all'
    })
    const [filteredCheckers, setFilteredCheckers] = useState<IBuildingChecker[]>(props.list[housing] || [])
    const [housingList, setHousingList] = useState<ISelector[]>(props.housingList.map((item: number) => {
        return {key: item.toString(), text: ''}
    }))

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.list[housing].length) {
            setFilteredCheckers(props.list[housing].filter((checker: IBuildingChecker) => {
                return (filters.furnish === 'all' || checker.furnish === filters.furnish) &&
                    (filters.status === 'all' || checker.status === filters.status)
            }))
        } else {
            setFilteredCheckers([])
        }
    }, [housing, filters])

    const changeHousingHandler = (value: string) => {
        setHousing(parseInt(value))
    }

    const renderFilters = () => {
        return (
            <div className={classes.filter}>
                <div className={classes.field}>
                    <div className={classes.field_label}>Корпус</div>

                    <ComboBox selected={housing.toString()}
                              items={Object.values(props.housingList.map((item: number) => {
                                  return {key: item.toString(), text: item.toString()}
                              }))}
                              onSelect={(value: string) => changeHousingHandler(value)}
                              placeHolder='Выберите вид отделки'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Отделка</div>

                    <ComboBox selected={filters.furnish}
                              items={Object.values([{key: 'all', text: 'все виды отделки'}, ...checkerFurnish])}
                              onSelect={(value: string) => setFilters({...filters, furnish: value})}
                              placeHolder='Выберите вид отделки'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Статус</div>

                    <ComboBox selected={filters.status || 'free'}
                              items={Object.values([{key: 'all', text: 'все статусы'}, ...checkerStatuses])}
                              onSelect={(value: string) => setFilters({...filters, status: value})}
                              placeHolder='Выберите статус'
                              styleType='standard'
                    />
                </div>
            </div>
        )
    }

    return (
        <Popup className={classes.PopupCheckerInfo}>
            <Header title={`${props.buildingName}. Корпус №${housing}`}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <div className={classes.content}>
                    {renderFilters()}

                    <div className={classes.header}>
                        <div className={classes.id}>#</div>
                        <div className={classes.name}>Название</div>
                        <div className={classes.column}>Площадь, м<sup>2</sup></div>
                        <div className={classes.column}>Цена, руб.</div>
                        <div className={classes.column}>Цена за м<sup>2</sup></div>
                        <div className={classes.column}>Отделка</div>
                        <div className={classes.columnSmall}>Комнат</div>
                        <div className={classes.columnSmall}>Этаж</div>
                        <div className={classes.status}>Статус</div>
                    </div>

                    <BlockingElement fetching={props.fetching} className={classes.list}>
                        {props.list && props.list[housing] && props.list[housing].length && filteredCheckers.length ?
                            filteredCheckers.map((checker: IBuildingChecker) => {
                                const status = checkerStatuses.find((item: ISelector) => item.key === checker.status)
                                const furnish = checkerFurnish.find((item: ISelector) => item.key === checker.furnish)
                                const costPerUnit = checker.cost && checker.area ? numberWithSpaces(round(checker.cost / checker.area, 0)) : 0

                                return (
                                    <div key={checker.id}
                                         className={classes.row}
                                    >
                                        <div className={classes.id}>#{checker.id}</div>
                                        <div className={classes.name}>{checker.name}</div>
                                        <div className={classes.column}>{checker.area || ''}</div>
                                        <div className={classes.column}>
                                            {checker.cost ? numberWithSpaces(checker.cost) : 0}
                                        </div>
                                        <div className={classes.column}>{costPerUnit}</div>
                                        <div className={classes.column}>{furnish ? furnish.text : ''}</div>
                                        <div className={classes.columnSmall}>{checker.rooms}</div>
                                        <div className={classes.columnSmall}>{checker.stage}</div>
                                        <div className={classes.status}>{status ? status.text : ''}</div>
                                    </div>
                                )
                            })
                            :
                            <Empty message={props.list && props.list[housing] && props.list[housing].length
                                ? 'Нет шахматок по заданному фильтру' : 'Корпус не имеет шахматок'}/>
                        }
                    </BlockingElement>
                </div>
            </Content>
        </Popup>
    )
}

PopupCheckerInfo.defaultProps = defaultProps
PopupCheckerInfo.displayName = 'PopupCheckerInfo'

export default function openPopupCheckerInfo(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupCheckerInfo, popupProps, undefined, block, displayOptions)
}