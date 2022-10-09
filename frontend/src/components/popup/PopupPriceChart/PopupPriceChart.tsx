import React, {useEffect, useState} from 'react'
import BuildingService from '../../../api/BuildingService'
import {PopupProps} from '../../../@types/IPopup'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import {getFormatDate} from '../../../helpers/dateHelper'
import classes from './PopupPriceChart.module.scss'

interface Props extends PopupProps {
    buildingId: number
}

const defaultProps: Props = {
    buildingId: 0
}

const PopupPriceChart: React.FC<Props> = (props) => {
    const [prices, setPrices] = useState<{[key: string]: number}>({})
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        setFetching(true)

        BuildingService.fetchBuildingPrices(props.buildingId)
            .then((response: any) => {
                setPrices(response.data)
            })
            .catch((error: any) => {
                console.error('error', error)
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetching(false))

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const renderPriceChart = () => {
        if (!prices && !Object.keys(prices).length) {
            return null
        }

        const values: number[] = Object.values(prices).map(Number)
        const maxValue = Math.max(...values)

        const getHeightPercent = (value: number): string => {
            const result = (value * 100) / maxValue

            return Math.round(result * 100) / 100 + '%'
        }

        return (
            <div className={classes.chart}>
                {Object.keys(prices).map((date: string) => {
                    return (
                        <div className={classes.barContainer}
                             title={getFormatDate(date, 'date')}
                             style={{height: getHeightPercent(prices[date])}}
                        >
                            <div className={classes.bar}>
                                <span>{numberWithSpaces(round(prices[date] || 0, 0))}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <Popup className={classes.PopupPriceChart}>
            <Header title='График цен' popupId={props.id || ''}/>

            <Content className={classes.popup}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <div className={classes.info}>
                        {renderPriceChart()}
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={close.bind(this)}
                        title='Закрыть'
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupPriceChart.defaultProps = defaultProps
PopupPriceChart.displayName = 'PopupPriceChart'

export default function openPopupPriceChart(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupPriceChart, popupProps, undefined, block, displayOptions)
}