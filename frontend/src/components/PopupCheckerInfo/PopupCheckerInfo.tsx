import React, {useEffect} from 'react'
import {IBuildingChecker} from '../../@types/IBuilding'
import {ISelector} from '../../@types/ISelector'
import {PopupProps} from '../../@types/IPopup'
import {checkerFurnish, checkerStatuses} from '../../helpers/buildingHelper'
import {numberWithSpaces, round} from '../../helpers/numberHelper'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Header, Popup} from '../Popup/Popup'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import BlockingElement from '../BlockingElement/BlockingElement'
import Empty from '../Empty/Empty'
import classes from './PopupCheckerInfo.module.scss'

interface Props extends PopupProps {
    buildingName: string
    list: IBuildingChecker[]
    housing: number
    fetching: boolean
}

const defaultProps: Props = {
    buildingName: '',
    list: [],
    housing: 0,
    fetching: false
}

const PopupCheckerInfo: React.FC<Props> = (props) => {
    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Todo: Реализовать фильтры

    return (
        <Popup className={classes.PopupCheckerInfo}>
            <Header title={`${props.buildingName}. Корпус №${props.housing}`}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <div className={classes.content}>
                    <div className={classes.filter}>
                        Фильтры в разработке
                    </div>

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
                        {props.list && props.list.length ?
                            props.list.map((checker: IBuildingChecker) => {
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
                            : <Empty message='Корпус не имеет шахматок'/>
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