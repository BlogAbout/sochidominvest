import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {compareText} from '../../../helpers/filterHelper'
import {allowForRole} from '../../helpers/accessHelper'
import {RouteNames} from '../../helpers/routerHelper'
import {ICategory} from '../../../@types/IStore'
import PanelView from '../../views/PanelView/PanelView'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import Title from '../../components/ui/Title/Title'
import StoreService from '../../../api/StoreService'
import CategoryList from './components/CategoryList/CategoryList'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import classes from './StoreCategoriesPage.module.scss'

const StoreCategoriesPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [filterCategories, setFilterCategories] = useState<ICategory[]>([])
    const [searchText, setSearchText] = useState('')

    const {categories, fetching: fetchingCategories} = useTypedSelector(state => state.storeReducer)

    const {fetchCategoryList} = useActions()

    useEffect(() => {
        fetchCategoriesHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [categories])

    const fetchCategoriesHandler = () => {
        fetchCategoryList({active: [0, 1]})
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchCategoriesHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!categories || !categories.length) {
            setFilterCategories([])
        }

        if (value !== '') {
            setFilterCategories(categories.filter((category: ICategory) => {
                return compareText(category.name, value)
            }))
        } else {
            setFilterCategories(categories)
        }
    }

    const onClickHandler = (category: ICategory) => {
        navigate(`${RouteNames.P_STORE_CATEGORIES}/${category.id}`)
    }

    const onAddHandler = () => {
        // TOdo
        // openPopupArticleCreate(document.body, {
        //     onSave: () => onSaveHandler()
        // })
    }

    // Редактирование
    const onEditHandler = (category: ICategory) => {
        // TOdo
        // openPopupArticleCreate(document.body, {
        //     article: article,
        //     onSave: () => onSaveHandler()
        // })
    }

    // Удаление
    const onRemoveHandler = (category: ICategory) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${category.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (category.id) {
                            setFetching(true)

                            StoreService.removeCategory(category.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenuHandler = (category: ICategory, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(category)}]

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(category)})
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <PanelView pageTitle='Категории товаров'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Категории товаров</Title>

                <CategoryList list={filterCategories}
                              fetching={fetching || fetchingCategories}
                              onClick={(category: ICategory) => onClickHandler(category)}
                              onContextMenu={(category: ICategory, e: React.MouseEvent) => onContextMenuHandler(category, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

StoreCategoriesPage.displayName = 'StoreCategoriesPage'

export default React.memo(StoreCategoriesPage)