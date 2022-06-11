import React, {useEffect, useState} from 'react'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import SearchBox from '../../SearchBox/SearchBox'
import SearchList from './components/SearchList/SearchList'
import Tabs from '../../Tabs/Tabs'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IUser} from '../../../@types/IUser'
import {IBuilding} from '../../../@types/IBuilding'
import {IArticle} from '../../../@types/IArticle'
import {IDocument} from '../../../@types/IDocument'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IAttachment} from '../../../@types/IAttachment'
import {IPartner} from '../../../@types/IPartner'
import {ITab} from '../../../@types/ITab'
import UtilService from '../../../api/UtilService'
import classes from './PopupSearchPanel.module.scss'

interface Props extends PopupProps {
    role: string
    navigate: any
}

const defaultProps: Props = {
    role: 'subscriber',
    navigate: null
}

const PopupSearchPanel: React.FC<Props> = (props) => {
    const [resultCount, setResultCount] = useState(0)
    const [users, setUsers] = useState<IUser[]>([])
    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [articles, setArticles] = useState<IArticle[]>([])
    const [documents, setDocuments] = useState<IDocument[]>([])
    const [developers, setDevelopers] = useState<IDeveloper[]>([])
    const [attachments, setAttachments] = useState<IAttachment[]>([])
    const [partners, setPartners] = useState<IPartner[]>([])
    const [searchText, setSearchText] = useState('')
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    const search = () => {
        if (searchText.trim() === '' || searchText.trim().length < 3) {
            return
        }

        setFetching(true)

        UtilService.fetchSearchGlobal({active: [0, 1], text: searchText})
            .then((result: any) => {
                setUsers(result.data.users)
                setBuildings(result.data.buildings)
                setArticles(result.data.articles)
                setDocuments(result.data.documents)
                setDevelopers(result.data.developers)
                setAttachments(result.data.attachments)
                setPartners(result.data.partners)

                updateCountResults()
            })
            .catch((error: any) => {
                console.error('Ошибка загрузки данных!', error)

                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data,
                })
            })
            .finally(() => {
                setFetching(false)
            })
    }

    const updateCountResults = () => {
        setResultCount(users.length + buildings.length + articles.length + documents.length + developers.length + attachments.length)
    }

    const renderUsersTab = () => {
        return (
            <div key='users' className={classes.tabContent}>
                <Title type={2}>Пользователи ({users.length})</Title>

                <SearchList items={users}
                            fetching={fetching}
                            type='user'
                            onClick={close.bind(this)}
                            navigate={props.navigate}
                />
            </div>
        )
    }

    const renderBuildingsTab = () => {
        return (
            <div key='buildings' className={classes.tabContent}>
                <Title type={2}>Объекты недвижимости ({buildings.length})</Title>

                <SearchList items={buildings}
                            fetching={fetching}
                            type='building'
                            onClick={close.bind(this)}
                            navigate={props.navigate}
                />
            </div>
        )
    }

    const renderArticlesTab = () => {
        return (
            <div key='articles' className={classes.tabContent}>
                <Title type={2}>Статьи ({articles.length})</Title>

                <SearchList
                    items={articles}
                    fetching={fetching}
                    type='article'
                    onClick={close.bind(this)}
                    navigate={props.navigate}
                />
            </div>
        )
    }

    const renderDocumentsTab = () => {
        return (
            <div key='documents' className={classes.tabContent}>
                <Title type={2}>Документы ({documents.length})</Title>

                <SearchList items={documents}
                            fetching={fetching}
                            type='document'
                            onClick={close.bind(this)}
                            navigate={props.navigate}
                />
            </div>
        )
    }

    const renderDevelopersTab = () => {
        return (
            <div key='developers' className={classes.tabContent}>
                <Title type={2}>Застройщики ({developers.length})</Title>

                <SearchList items={developers}
                            fetching={fetching}
                            type='developer'
                            onClick={close.bind(this)}
                            navigate={props.navigate}
                />
            </div>
        )
    }

    const renderAttachmentsTab = () => {
        return (
            <div key='attachments' className={classes.tabContent}>
                <Title type={2}>Вложения ({attachments.length})</Title>

                <SearchList items={attachments}
                            fetching={fetching}
                            type='attachment'
                            onClick={close.bind(this)}
                            navigate={props.navigate}
                />
            </div>
        )
    }

    const renderPartnersTab = () => {
        return (
            <div key='partners' className={classes.tabContent}>
                <Title type={2}>Партнеры ({partners.length})</Title>

                <SearchList items={partners}
                            fetching={fetching}
                            type='partner'
                            onClick={close.bind(this)}
                            navigate={props.navigate}
                />
            </div>
        )
    }

    const tabs: ITab = {} as ITab

    if (['director', 'administrator', 'manager'].includes(props.role) && users.length) {
        tabs['users'] = {title: 'Пользователи', render: renderUsersTab()}
    }

    if (buildings.length) {
        tabs['buildings'] = {title: 'Объекты недвижимости', render: renderBuildingsTab()}
    }

    if (articles.length) {
        tabs['articles'] = {title: 'Статьи', render: renderArticlesTab()}
    }

    if (documents.length) {
        tabs['documents'] = {title: 'Документы', render: renderDocumentsTab()}
    }

    if (developers.length) {
        tabs['developers'] = {title: 'Застройщики', render: renderDevelopersTab()}
    }

    if (attachments.length) {
        tabs['attachments'] = {title: 'Вложения', render: renderAttachmentsTab()}
    }

    if (partners.length) {
        tabs['partners'] = {title: 'Партнеры', render: renderPartnersTab()}
    }

    return (
        <Popup className={classes.PopupSearchPanel}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Глобальный поиск</Title>

                    <div className={classes.search}>
                        <SearchBox onChange={(value: string) => setSearchText(value)}
                                   className={classes.searchField}
                                   value={searchText}
                                   countFind={resultCount}
                        />

                        <Button type='apply'
                                onClick={search.bind(this)}
                                disabled={searchText.trim() === '' || searchText.trim().length < 3}
                                icon='magnifying-glass'
                        />
                    </div>

                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>
            </BlockingElement>

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

PopupSearchPanel.defaultProps = defaultProps
PopupSearchPanel.displayName = 'PopupSearchPanel'

export default function openPopupSearchPanel(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupSearchPanel, popupProps, undefined, block, displayOptions)
}