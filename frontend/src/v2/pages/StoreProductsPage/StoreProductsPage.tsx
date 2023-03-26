import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {compareText} from '../../../helpers/filterHelper'
import {IProduct} from '../../../@types/IStore'
import {RouteNames} from '../../helpers/routerHelper'
import DefaultView from '../../views/DefaultView/DefaultView'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import Title from '../../components/ui/Title/Title'
import ProductTill from '../StoreProductsPanelPage/components/ProductTill/ProductTill'
import classes from './StoreProductsPage.module.scss'

const StoreProductsPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [searchText, setSearchText] = useState('')
    const [filterProducts, setFilterProducts] = useState<IProduct[]>([])

    const {products, categories, fetching} = useTypedSelector(state => state.storeReducer)

    const {fetchProductList, fetchCategoryList} = useActions()

    useEffect(() => {
        fetchProductsHandler()
        fetchCategoryList({active: [0, 1]})
    }, [])

    useEffect(() => {
        search(searchText)
    }, [products])

    const fetchProductsHandler = () => {
        fetchProductList({active: [0, 1]})
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!products || !products.length) {
            setFilterProducts([])
        }

        if (value !== '') {
            setFilterProducts(products.filter((product: IProduct) => {
                return compareText(product.name, value)
            }))
        } else {
            setFilterProducts(products)
        }
    }

    const onClickHandler = (product: IProduct) => {
        navigate(`${RouteNames.STORE_PRODUCTS}/${product.id}`)
    }

    return (
        <DefaultView pageTitle='Товары и оборудование'>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h1' style='center'>Товары и оборудование</Title>

                    <ProductTill list={filterProducts}
                                 categories={categories}
                                 fetching={fetching}
                                 onClick={(product: IProduct) => onClickHandler(product)}
                                 onContextMenu={() => {
                                 }}
                    />
                </div>
            </Wrapper>
        </DefaultView>
    )
}

StoreProductsPage.displayName = 'StoreProductsPanelPage'

export default React.memo(StoreProductsPage)