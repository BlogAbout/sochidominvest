import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import openPopupDeveloperCreate from '../../../components/PopupDeveloperCreate/PopupDeveloperCreate'
import Button from '../../../components/Button/Button'
import DeveloperList from '../../../components/DeveloperList/DeveloperList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import {IDeveloper} from '../../../@types/IDeveloper'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './DeveloperPagePanel.module.scss'

const DeveloperPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDeveloper, setFilterDeveloper] = useState<IDeveloper[]>([])

    const {role} = useTypedSelector(state => state.userReducer)
    const {developers, fetching} = useTypedSelector(state => state.developerReducer)
    const {fetchDeveloperList} = useActions()

    useEffect(() => {
        if (isUpdate || !developers.length) {
            fetchDeveloperList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [developers])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!developers || !developers.length) {
            setFilterDeveloper([])
        }

        if (value !== '') {
            setFilterDeveloper(developers.filter((developer: IDeveloper) => {
                return developer.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    developer.address.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    developer.phone.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterDeveloper(developers)
        }
    }

    // Добавление нового застройщика
    const onClickAddHandler = () => {
        openPopupDeveloperCreate(document.body, {
            onSave: () => {
                onSave()
            }
        })
    }

    return (
        <main className={classes.DeveloperPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Застройщики - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type='save'
                        icon='building-columns'
                        onClick={() => console.log('add')
                        }
                >Строительные компании</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Застройщики</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
                        : null
                    }
                </h1>

                <DeveloperList developers={filterDeveloper} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

DeveloperPagePanel.displayName = 'DeveloperPagePanel'

export default DeveloperPagePanel