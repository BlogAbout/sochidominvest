import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {compareText} from '../../../helpers/filterHelper'
import openPopupDeveloperCreate from '../../../components/PopupDeveloperCreate/PopupDeveloperCreate'
import Button from '../../../components/Button/Button'
import DeveloperList from '../../../components/DeveloperList/DeveloperList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IFilterContent} from '../../../@types/IFilter'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './DeveloperPagePanel.module.scss'
import {IUser} from "../../../@types/IUser";

const DeveloperPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDeveloper, setFilterDeveloper] = useState<IDeveloper[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({

    })

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
    }, [developers, selectedType])

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
            setFilterDeveloper(filterItemsHandler(developers.filter((developer: IDeveloper) => {
                return (!selectedType.length || selectedType.includes(developer.type)) &&
                    (compareText(developer.name, value) || compareText(developer.address, value) || compareText(developer.phone, value.toLocaleLowerCase()))
            })))
        } else {
            setFilterDeveloper(filterItemsHandler(!selectedType.length ? developers : developers.filter((developer: IDeveloper) => selectedType.includes(developer.type))))
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

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IDeveloper[]) => {
        if (!list || !list.length) {
            return []
        }

        return list
        // Todo: Придумать фильтры
        // return list.filter((item: IDeveloper) => {
        //     return filters.block.includes(String(item.block))
        // })
    }

    const filtersContent: IFilterContent[] = [

    ]

    return (
        <main className={classes.DeveloperPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Застройщики - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <SidebarLeft filters={filtersContent}/>

            <div className={classes.filter}>
                <Button type={selectedType.includes('constructionCompany') ? 'regular' : 'save'}
                        icon='building-columns'
                        onClick={() => onClickFilterButtonHandler('constructionCompany')}
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