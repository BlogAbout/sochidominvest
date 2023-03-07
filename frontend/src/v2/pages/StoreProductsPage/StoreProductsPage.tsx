import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {compareText} from '../../../helpers/filterHelper'
import {allowForRole} from '../../helpers/accessHelper'
import {IProduct} from '../../../@types/IStore'
import {IFilterContent} from '../../../@types/IFilter'
import {RouteNames} from '../../helpers/routerHelper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import Title from '../../components/ui/Title/Title'
import StoreService from '../../../api/StoreService'
import ProductList from './components/ProductList/ProductList'
import ProductTill from './components/ProductTill/ProductTill'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import openPopupProductCreate from '../../../components/popup/PopupProductCreate/PopupProductCreate'
import classes from './StoreProductsPage.module.scss'

const StoreProductsPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterProducts, setFilterProducts] = useState<IProduct[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({})
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('products'))

    const {products, categories, fetching: fetchingProducts} = useTypedSelector(state => state.storeReducer)

    const {fetchProductList, fetchCategoryList} = useActions()

    useEffect(() => {
        fetchProductsHandler()
        fetchCategoryList({active: [0, 1]})
    }, [])

    useEffect(() => {
        search(searchText)
    }, [products, filters])

    const fetchProductsHandler = () => {
        fetchProductList({active: [0, 1]})
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchProductsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!products || !products.length) {
            setFilterProducts([])
        }

        if (value !== '') {
            setFilterProducts(filterItemsHandler(products.filter((product: IProduct) => {
                return compareText(product.name, value)
            })))
        } else {
            setFilterProducts(filterItemsHandler(products))
        }
    }

    const onClickHandler = (product: IProduct) => {
        navigate(`${RouteNames.P_STORE_PRODUCTS}/${product.id}`)
    }

    const onAddHandler = () => {
        openPopupProductCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование
    const onEditHandler = (product: IProduct) => {
        openPopupProductCreate(document.body, {
            product: product,
            onSave: () => onSaveHandler()
        })
    }

    // Удаление
    const onRemoveHandler = (product: IProduct) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${product.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (product.id) {
                            setFetching(true)

                            StoreService.removeProduct(product.id)
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
    const onContextMenuHandler = (product: IProduct, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(product)}]

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(product)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('products', value)
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IProduct[]) => {
        if (!list || !list.length) {
            return []
        }

        return list
        // Todo
        // return list.filter((item: IProduct) => {
        //     return filters.types.includes(item.type)
        // })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            // {
            //     title: 'Тип',
            //     type: 'checker',
            //     multi: true,
            //     items: articleTypes,
            //     selected: filters.types,
            //     onSelect: (values: string[]) => {
            //         setFilters({...filters, types: values})
            //     }
            // }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Товары'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Товары</Title>

                {layout === 'till'
                    ? <ProductTill list={filterProducts}
                                   categories={categories}
                                   fetching={fetching || fetchingProducts}
                                   onClick={(product: IProduct) => onClickHandler(product)}
                                   onContextMenu={(product: IProduct, e: React.MouseEvent) => onContextMenuHandler(product, e)}
                    />
                    : <ProductList list={filterProducts}
                                   categories={categories}
                                   fetching={fetching || fetchingProducts}
                                   onClick={(product: IProduct) => onClickHandler(product)}
                                   onContextMenu={(product: IProduct, e: React.MouseEvent) => onContextMenuHandler(product, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

StoreProductsPage.displayName = 'StoreProductsPage'

export default React.memo(StoreProductsPage)