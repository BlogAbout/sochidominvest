import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {RouteNames} from '../../helpers/routerHelper'
import {ICategory, IProduct} from '../../../@types/IStore'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import StoreService from '../../../api/StoreService'
import ProductTill from '../StoreProductsPanelPage/components/ProductTill/ProductTill'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import openPopupProductCreate from '../../../components/popup/PopupProductCreate/PopupProductCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import classes from './StoreCategoryPage.module.scss'

type StoreCategoryPageProps = {
    id: string
}

const CategoryPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const params = useParams<StoreCategoryPageProps>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [category, setCategory] = useState<ICategory>({} as ICategory)
    const [filterProduct, setFilterProduct] = useState<IProduct[]>([])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {products, categories, fetching: fetchingStore} = useTypedSelector(state => state.storeReducer)
    const {fetchProductList, fetchCategoryList} = useActions()

    useEffect(() => {
        if (isUpdate || !categories.length) {
            fetchCategoryList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (categories && categories.length && params.id) {
            const categoryId = parseInt(params.id)
            const categoryInfo = categories.find((category: ICategory) => category.id === categoryId)

            if (categoryInfo) {
                setCategory(categoryInfo)
            }
        }
    }, [categories])

    useEffect(() => {
        fetchProductList({active: [0, 1]})
    }, [category])

    useEffect(() => {
        if (products && products.length) {
            setFilterProduct(products.filter((product: IProduct) => product.categoryId === category.id))
        } else {
            setFilterProduct([])
        }
    }, [products])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    const onClickHandler = (product: IProduct) => {
        navigate(`${RouteNames.STORE_PRODUCTS}/${product.id}`)
    }

    const onAddHandler = () => {
        if (category.id) {
            openPopupProductCreate(document.body, {
                product: {
                    id: null,
                    categoryId: category.id,
                    name: '',
                    cost: 0,
                    active: 1,
                    author: 0,
                    images: [],
                    videos: [],
                    fields: {}
                },
                onSave: () => {
                    onSaveHandler()
                }
            })
        }
    }

    // Редактирование
    const onEditHandler = (product: IProduct) => {
        openPopupProductCreate(document.body, {
            product: product,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (product: IProduct) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${product.name}?`,
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
    const onContextMenuItem = (product: IProduct, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = []

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => onEditHandler(product)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(product)})
            }
        }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    return (
        <PanelView pageTitle={category.name}>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       addText='Создать товар'
                       className={classes.title}
                >{category.name}</Title>

                <ProductTill list={filterProduct}
                             categories={categories}
                             fetching={fetching || fetchingStore}
                             onClick={(product: IProduct) => onClickHandler(product)}
                             onContextMenu={(product: IProduct, e: React.MouseEvent) => onContextMenuItem(product, e)}
                />
            </Wrapper>
        </PanelView>
    )
}

CategoryPage.displayName = 'CategoryPage'

export default React.memo(CategoryPage)