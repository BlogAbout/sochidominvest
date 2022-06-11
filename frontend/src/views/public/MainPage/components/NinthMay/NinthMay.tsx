import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import {getArticleTypeText} from '../../../../../helpers/articleHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import WidgetService from '../../../../../api/WidgetService'
import {IWidget} from '../../../../../@types/IWidget'
import {IArticle} from '../../../../../@types/IArticle'
import {IPartner} from '../../../../../@types/IPartner'
import classes from './NinthMay.module.scss'

const cx = classNames.bind(classes)

const NinthMay: React.FC = () => {
    const navigate = useNavigate()

    const [widgets, setWidgets] = useState<IWidget[]>([])
    const [items, setItems] = useState<{ [key: number]: IArticle[] | IPartner[] }>({} as { [key: number]: IArticle[] | IPartner[] })

    useEffect(() => {
        WidgetService.fetchWidgets({active: [1], page: 'main'})
            .then((response: any) => {
                setWidgets(response.data)
            })
            .catch((error: any) => {
                console.error(error)
            })
    }, [])

    useEffect(() => {
        if (widgets.length) {
            WidgetService.fetchWidgetsContent({active: [1], page: 'main'})
                .then((response: any) => {
                    setItems(response.data)
                })
                .catch((error: any) => {
                    console.log('error', error)
                })
        }
    }, [widgets])

    if (!widgets || !widgets.length) {
        return null
    }

    const renderArticleItem = (article: IArticle) => {
        return (
            <div key={article.id} className={classes.item} onClick={() => navigate('/article/' + article.id)}>
                <div className={cx({'itemImage': true, 'noImage': !article.images || !article.images.length})}>
                    {article.avatar ?
                        <img src={'https://api.sochidominvest.ru/uploads/image/thumb/' + article.avatar}
                             alt={article.name}
                        />
                        : null
                    }
                </div>

                <div className={classes.itemContent}>
                    <div className={classes.types}>
                        <div className={cx({'type': true, [`${article.type}`]: true})}>
                            {getArticleTypeText(article.type)}
                        </div>
                    </div>

                    <div className={classes.information}>
                        <div className={classes.icon} title={`Просмотры: ${article.views}`}>
                            <FontAwesomeIcon icon='eye'/>
                            <span>{article.views}</span>
                        </div>

                        <div className={classes.icon} title={`Дата публикации: ${getFormatDate(article.dateCreated)}`}>
                            <FontAwesomeIcon icon='calendar'/>
                            <span>{getFormatDate(article.dateCreated)}</span>
                        </div>
                    </div>

                    <h3>{article.name}</h3>
                </div>
            </div>
        )
    }

    const renderPartnerItem = (partner: IPartner) => {
        return (
            <div key={partner.id} className={classes.item} onClick={() => navigate('/partner/' + partner.id)}>
                <div className={cx({'itemImage': true, 'noImage': !partner.avatar})}>
                    {partner.avatar ?
                        <img src={'https://api.sochidominvest.ru/uploads/image/thumb/' + partner.avatar}
                             alt={partner.name}
                        />
                        : null
                    }
                </div>

                <div className={classes.itemContent}>
                    <div className={classes.information}>
                        <div className={classes.icon} title={`Дата публикации: ${getFormatDate(partner.dateCreated)}`}>
                            <FontAwesomeIcon icon='calendar'/>
                            <span>{getFormatDate(partner.dateCreated)}</span>
                        </div>
                    </div>

                    <h3>{partner.name}</h3>
                </div>
            </div>
        )
    }

    const renderWidgetContent = (widget: IWidget) => {
        if (!widget.id || !widget.data || !widget.data.length || !items[widget.id] || !items[widget.id].length) {
            return null
        }

        switch (widget.type) {
            case 'article':
                return (
                    <div className={classes.listArticles}>
                        {items[widget.id].map((article: any) => renderArticleItem(article))}
                    </div>
                )
            case 'partner':
                return (
                    <div className={classes.listArticles}>
                        {items[widget.id].map((partner: any) => renderPartnerItem(partner))}
                    </div>
                )
            default:
                return null
        }
    }

    const renderWidgetContainer = (widget: IWidget) => {
        if (!widget.id || !widget.data || !widget.data.length || !items[widget.id] || !items[widget.id].length) {
            return null
        }

        return (
            <div key={widget.id} className={classes.widget}>
                <div className={classes.widgetName}>{widget.name}</div>

                {renderWidgetContent(widget)}
            </div>
        )
    }

    let showBlock = false
    widgets.forEach((widget: IWidget) => {
        if (widget.id && widget.data && widget.data.length && items[widget.id] && items[widget.id].length) {
            showBlock = true
        }
    })

    if (!showBlock) {
        return null
    }

    return (
        <div className={classes.NinthMay}>
            <div className={classes.container}>
                {widgets.map((widget: IWidget) => renderWidgetContainer(widget))}
            </div>
        </div>
    )
}

export default NinthMay