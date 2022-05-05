import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import Empty from '../Empty/Empty'
import BlockingElement from '../BlockingElement/BlockingElement'
import openContextMenu from '../ContextMenu/ContextMenu'
import openPopupArticleSelector from '../PopupArticleSelector/PopupArticleSelector'
import openPopupBuildingSelector from '../PopupBuildingSelector/PopupBuildingSelector'
import openPopupPartnerSelector from '../PopupPartnerSelector/PopupPartnerSelector'
import Button from '../Button/Button'
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
    const {buildings, fetching: fetchingBuildings} = useTypedSelector(state => state.buildingReducer)
    const {articles, fetching: fetchingArticles} = useTypedSelector(state => state.articleReducer)
    const {partners, fetching: fetchingPartners} = useTypedSelector(state => state.partnerReducer)

    const addElementHandler = (widget: IWidget) => {
        switch (widget.type) {
            case 'building':
                openPopupBuildingSelector(document.body, {
                    selected: [],
                    buttonAdd: true,
                    multi: false,
                    onSelect: (selected: []) => {
                        console.log('selected', selected)
                    }
                }, {
                    center: true
                })
                break
            case 'article':
                openPopupArticleSelector(document.body, {
                    selected: [],
                    buttonAdd: true,
                    multi: false,
                    onSelect: (selected: []) => {
                        console.log('selected', selected)
                    }
                }, {
                    center: true
                })
                break
            case 'partner':
                openPopupPartnerSelector(document.body, {
                    selected: [],
                    buttonAdd: true,
                    multi: false,
                    onSelect: (selected: []) => {
                        console.log('selected', selected)
                    }
                }, {
                    center: true
                })
                break
        }
    }

    const removeElementHandler = (data: IWidgetData[], index: number) => {
        // Todo
    }

    const onContextMenu = (e: React.MouseEvent, data: IWidgetData[], index: number) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить из списка', onClick: () => removeElementHandler(data, index)}
        ]

        openContextMenu(e, menuItems)
    }

    const renderList = (widget: IWidget) => {
        switch (widget.type) {
            case 'building':
                return renderBuildingList(widget.data)
            case 'article':
                return renderArticleList(widget.data)
            case 'partner':
                return renderPartnerList(widget.data)
            default:
                return null
        }
    }

    const renderBuildingList = (data: IWidgetData[]) => {
        if (!data.length) {
            return <Empty message='Нет элементов'/>
        }

        return (
            <BlockingElement fetching={props.fetching} className={classes.items}>
                {data.map((item: IWidgetData, index: number) => {
                    const itemInfo = buildings.find((building: IBuilding) => building.id === item.objectId)

                    if (!itemInfo) {
                        return null
                    }

                    return (
                        <div className={classes.element}
                             onContextMenu={(e: React.MouseEvent) => onContextMenu(e, data, index)}
                        >
                            <div className={classes.name}>{itemInfo.name}</div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    const renderArticleList = (data: IWidgetData[]) => {
        if (!data.length) {
            return <Empty message='Нет элементов'/>
        }

        return (
            <BlockingElement fetching={props.fetching} className={classes.items}>
                {data.map((item: IWidgetData, index: number) => {
                    const itemInfo = articles.find((article: IArticle) => article.id === item.objectId)

                    if (!itemInfo) {
                        return null
                    }

                    return (
                        <div className={classes.element}
                             onContextMenu={(e: React.MouseEvent) => onContextMenu(e, data, index)}
                        >
                            <div className={classes.name}>{itemInfo.name}</div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    const renderPartnerList = (data: IWidgetData[]) => {
        if (!data.length) {
            return <Empty message='Нет элементов'/>
        }

        return (
            <BlockingElement fetching={props.fetching} className={classes.items}>
                {data.map((item: IWidgetData, index: number) => {
                    const itemInfo = partners.find((partner: IPartner) => partner.id === item.objectId)

                    if (!itemInfo) {
                        return null
                    }

                    return (
                        <div className={classes.element}
                             onContextMenu={(e: React.MouseEvent) => onContextMenu(e, data, index)}
                        >
                            <div className={classes.name}>{itemInfo.name}</div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    return (
        <div className={classes.WidgetList}>
            {props.widgets.length ?
                (<BlockingElement fetching={props.fetching} className={classes.list}>
                    {props.widgets.map((widget: IWidget) => {
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
                                            onClick={() => {
                                                // todo
                                            }}
                                            disabled={props.fetching || fetchingBuildings || fetchingArticles || fetchingPartners}
                                    >Сохранить</Button>

                                    <Button type='save'
                                            icon='plus'
                                            onClick={() => addElementHandler(widget)}
                                            disabled={props.fetching || fetchingBuildings || fetchingArticles || fetchingPartners}
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