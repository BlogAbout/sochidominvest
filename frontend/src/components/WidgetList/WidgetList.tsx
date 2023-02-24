import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import WidgetService from '../../api/WidgetService'
import Empty from '../ui/Empty/Empty'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import openContextMenu from '../ContextMenu/ContextMenu'
import openPopupArticleSelector from '../popup/PopupArticleSelector/PopupArticleSelector'
import openPopupBuildingSelector from '../popup/PopupBuildingSelector/PopupBuildingSelector'
import openPopupPartnerSelector from '../popup/PopupPartnerSelector/PopupPartnerSelector'
import openPopupAlert from '../PopupAlert/PopupAlert'
import Button from '../form/Button/Button'
import {getWidgetPageText, getWidgetStyleText, getWidgetTypeText} from '../../helpers/widgetHelper'
import {IWidget, IWidgetData} from '../../@types/IWidget'
import {IBuilding} from '../../@types/IBuilding'
import {IArticle} from '../../@types/IArticle'
import {IPartner} from '../../@types/IPartner'
import classes from './WidgetList.module.scss'

interface Props {
    widgets: IWidget[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    widgets: [],
    fetching: false,
    onSave: () => {
        console.info('WidgetList onSave')
    }
}

const cx = classNames.bind(classes)

const WidgetList: React.FC<Props> = (props) => {
    const [widgets, setWidgets] = useState<IWidget[]>([])
    const [fetching, setFetching] = useState(false)

    const {buildings, fetching: fetchingBuildings} = useTypedSelector(state => state.buildingReducer)
    const {articles, fetching: fetchingArticles} = useTypedSelector(state => state.articleReducer)
    const {partners, fetching: fetchingPartners} = useTypedSelector(state => state.partnerReducer)

    useEffect(() => {
        if (props.widgets) {
            setWidgets(JSON.parse(JSON.stringify(props.widgets)))
        } else {
            setWidgets([])
        }
    }, [props.widgets])

    // Вызов селектора элементов для добавления в виджет
    const addElementHandler = (widget: IWidget) => {
        switch (widget.type) {
            case 'building':
                openPopupBuildingSelector(document.body, {
                    selected: [],
                    buttonAdd: true,
                    multi: false,
                    onSelect: (selected: number[]) => addElementToWidget(widget, selected[0])
                })
                break
            case 'article':
                openPopupArticleSelector(document.body, {
                    selected: [],
                    buttonAdd: true,
                    multi: false,
                    onSelect: (selected: number[]) => addElementToWidget(widget, selected[0])
                })
                break
            case 'partner':
                openPopupPartnerSelector(document.body, {
                    selected: [],
                    buttonAdd: true,
                    multi: false,
                    onSelect: (selected: number[]) => addElementToWidget(widget, selected[0])
                })
                break
        }
    }

    // Удаление элемента из виджета
    const removeElementHandler = (widget: IWidget, index: number) => {
        const widgetData: IWidget = JSON.parse(JSON.stringify(widget))
        const findIndex = widgets.findIndex((item: IWidget) => item.id === widgetData.id)

        widgetData.data = [
            ...widgetData.data.slice(0, index),
            ...widgetData.data.slice(index + 1)
        ]

        setWidgets([
            ...widgets.slice(0, findIndex),
            widgetData,
            ...widgets.slice(findIndex + 1)
        ])
    }

    // Добавление элемента в виджет
    const addElementToWidget = (widget: IWidget, selectedItem: number) => {
        const widgetData: IWidget = JSON.parse(JSON.stringify(widget))

        if (widgetData.data.length) {
            const findElement = widgetData.data.find((item: IWidgetData) => item.objectId === selectedItem && item.objectType)

            if (findElement) {
                openPopupAlert(document.body, {
                    text: 'Данный элемент уже присутствует в списке. Одинаковые элементы нельзя добавлять в один виджет.'
                })

                return
            }
        }

        const item: IWidgetData = {
            widgetId: widgetData.id,
            objectId: selectedItem,
            objectType: widgetData.type,
            ordering: widgetData.data.length + 1
        }

        const findIndex = widgets.findIndex((item: IWidget) => item.id === widgetData.id)

        widgetData.data.push(item)

        setWidgets([
            ...widgets.slice(0, findIndex),
            widgetData,
            ...widgets.slice(findIndex + 1)
        ])
    }

    // Контекстное меню по клику на элемент внутри виджета
    const onContextMenu = (e: React.MouseEvent, widget: IWidget, index: number) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить из списка', onClick: () => removeElementHandler(widget, index)}
        ]

        openContextMenu(e, menuItems)
    }

    // Сохранение данных виджета
    const onSaveWidgetHandler = (widget: IWidget) => {
        setFetching(true)

        WidgetService.saveWidget(widget)
            .then(() => {
                props.onSave()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => {
                setFetching(false)
            })
    }

    const renderList = (widget: IWidget) => {
        switch (widget.type) {
            case 'building':
                return renderBuildingList(widget)
            case 'article':
                return renderArticleList(widget)
            case 'partner':
                return renderPartnerList(widget)
            default:
                return null
        }
    }

    const renderBuildingList = (widget: IWidget) => {
        if (!widget.data.length) {
            return <Empty message='Нет элементов'/>
        }

        return (
            <BlockingElement fetching={props.fetching} className={classes.items}>
                {widget.data.map((item: IWidgetData, index: number) => {
                    const itemInfo = buildings.find((building: IBuilding) => building.id === item.objectId)

                    if (!itemInfo) {
                        return null
                    }

                    return (
                        <div key={index} className={classes.element}
                             onContextMenu={(e: React.MouseEvent) => onContextMenu(e, widget, index)}
                        >
                            <div className={classes.id}>{index + 1}</div>
                            <div className={classes.name}>{itemInfo.name}</div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    const renderArticleList = (widget: IWidget) => {
        if (!widget.data.length) {
            return <Empty message='Нет элементов'/>
        }

        return (
            <BlockingElement fetching={props.fetching} className={classes.items}>
                {widget.data.map((item: IWidgetData, index: number) => {
                    const itemInfo = articles.find((article: IArticle) => article.id === item.objectId)

                    if (!itemInfo) {
                        return null
                    }

                    return (
                        <div key={index} className={classes.element}
                             onContextMenu={(e: React.MouseEvent) => onContextMenu(e, widget, index)}
                        >
                            <div className={classes.id}>{index + 1}</div>
                            <div className={classes.name}>{itemInfo.name}</div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    const renderPartnerList = (widget: IWidget) => {
        if (!widget.data.length) {
            return <Empty message='Нет элементов'/>
        }

        return (
            <BlockingElement fetching={props.fetching} className={classes.items}>
                {widget.data.map((item: IWidgetData, index: number) => {
                    const itemInfo = partners.find((partner: IPartner) => partner.id === item.objectId)

                    if (!itemInfo) {
                        return null
                    }

                    return (
                        <div key={index} className={classes.element}
                             onContextMenu={(e: React.MouseEvent) => onContextMenu(e, widget, index)}
                        >
                            <div className={classes.id}>{index + 1}</div>
                            <div className={classes.name}>{itemInfo.name}</div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    return (
        <div className={classes.WidgetList}>
            {widgets.length ?
                (<BlockingElement fetching={props.fetching} className={classes.list}>
                    {widgets.map((widget: IWidget) => {
                        return (
                            <div key={widget.id} className={cx({'item': true, 'disabled': widget.active === 0})}>
                                <div className={classes.head}>
                                    <h4>{widget.name}</h4>
                                    <span className={classes.page}>{getWidgetPageText(widget.page)}</span>
                                </div>

                                <div className={classes.content}>
                                    {renderList(widget)}
                                </div>

                                <div className={classes.footer}>
                                    <span className={classes.info}>Стиль: {getWidgetStyleText(widget.style)}</span>
                                    <span className={classes.info}>Тип: {getWidgetTypeText(widget.type)}</span>
                                </div>

                                <div className={classes.buttons}>
                                    <Button type='save'
                                            icon='check'
                                            onClick={() => onSaveWidgetHandler(widget)}
                                            disabled={props.fetching || fetching || fetchingBuildings || fetchingArticles || fetchingPartners}
                                    >Сохранить</Button>

                                    <Button type='save'
                                            icon='plus'
                                            onClick={() => addElementHandler(widget)}
                                            disabled={props.fetching || fetching || fetchingBuildings || fetchingArticles || fetchingPartners}
                                            className='marginLeft'
                                    >Добавить</Button>
                                </div>
                            </div>
                        )
                    })}
                </BlockingElement>)
                : <Empty message='Нет виджетов'/>
            }
        </div>
    )
}

WidgetList.defaultProps = defaultProps
WidgetList.displayName = 'WidgetList'

export default WidgetList