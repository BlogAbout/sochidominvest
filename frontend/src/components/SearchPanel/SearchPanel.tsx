import React, {useEffect, useRef, useState} from 'react'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import UtilService from '../../api/UtilService'
import {IUser} from '../../@types/IUser'
import {IBuilding} from '../../@types/IBuilding'
import {IArticle} from '../../@types/IArticle'
import {IDocument} from '../../@types/IDocument'
import {IDeveloper} from '../../@types/IDeveloper'
import {IAttachment} from '../../@types/IAttachment'
import {Content, Header} from '../Popup/Popup'
import Button from '../Button/Button'
import SearchBox from '../SearchBox/SearchBox'
import SearchList from './components/SearchList/SearchList'
import openPopupAlert from '../PopupAlert/PopupAlert'
import classes from './SearchPanel.module.scss'

interface Props {
    isShow: boolean

    onShow(): void
}

const defaultProps: Props = {
    isShow: false,
    onShow: () => {
        console.info('SearchPanel onShow')
    }
}

const SearchPanel: React.FC<Props> = (props) => {
    const refDepartmentItem = useRef<HTMLDivElement>(null)

    const [resultCount, setResultCount] = useState(0)
    const [users, setUsers] = useState<IUser[]>([])
    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [articles, setArticles] = useState<IArticle[]>([])
    const [documents, setDocuments] = useState<IDocument[]>([])
    const [developers, setDevelopers] = useState<IDeveloper[]>([])
    const [attachments, setAttachments] = useState<IAttachment[]>([])
    const [searchText, setSearchText] = useState('')
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)

        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [])

    // Обработка клика вне блока
    const handleClickOutside = (event: Event): void => {
        if (refDepartmentItem.current && event.target && !refDepartmentItem.current.contains(event.target as Node)) {
            props.onShow()
        }
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
        setResultCount(buildings.length + articles.length + documents.length + developers.length + attachments.length)
    }

    const onClickHandler = () => {
        props.onShow()
    }

    return (
        <div className={classes.SearchPanel} ref={refDepartmentItem}>
            <Header title={'Глобальный поиск' + (resultCount > 0 ? `. Найдено результатов: ${resultCount}` : '')}
                    popupId=''
                    onClose={() => props.onShow()}
            />

            <Content className={classes.popupContent}>
                <div className={classes.search}>
                    <SearchBox onChange={(value: string) => setSearchText(value)}
                               className={classes.searchField}
                               value={searchText}
                    />

                    <Button type='apply'
                            onClick={search.bind(this)}
                            disabled={searchText.trim() === '' || searchText.trim().length < 3}
                            icon='magnifying-glass'
                    />
                </div>

                {['director', 'administrator', 'manager'].includes(role) && users.length ?
                    <div className={classes.block}>
                        <h2>Пользователи</h2>
                        <SearchList items={users}
                                    fetching={fetching}
                                    type='user'
                                    onClick={onClickHandler.bind(this)}
                        />
                    </div>
                    : null}

                {buildings.length ?
                    <div className={classes.block}>
                        <h2>Объекты недвижимости</h2>
                        <SearchList items={buildings}
                                    fetching={fetching}
                                    type='building'
                                    onClick={onClickHandler.bind(this)}
                        />
                    </div>
                    : null}

                {articles.length ?
                    <div className={classes.block}>
                        <h2>Статьи</h2>
                        <SearchList
                            items={articles}
                            fetching={fetching}
                            type='article'
                            onClick={onClickHandler.bind(this)}
                        />
                    </div>
                    : null}

                {documents.length ?
                    <div className={classes.block}>
                        <h2>Документы</h2>
                        <SearchList items={documents}
                                    fetching={fetching}
                                    type='document'
                                    onClick={onClickHandler.bind(this)}
                        />
                    </div>
                    : null}

                {developers.length ?
                    <div className={classes.block}>
                        <h2>Застройщики</h2>
                        <SearchList items={developers}
                                    fetching={fetching}
                                    type='developer'
                                    onClick={onClickHandler.bind(this)}
                        />
                    </div>
                    : null}

                {attachments.length ?
                    <div className={classes.block}>
                        <h2>Вложения</h2>
                        <SearchList items={attachments}
                                    fetching={fetching}
                                    type='attachment'
                                    onClick={onClickHandler.bind(this)}
                        />
                    </div>
                    : null}
            </Content>
        </div>
    )
}

SearchPanel.defaultProps = defaultProps
SearchPanel.displayName = 'SearchPanel'

export default SearchPanel