import React from 'react'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import {ICategory, IProduct} from '../../../../../@types/IStore'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import classes from './ProductList.module.scss'

interface Props {
    list: IProduct[]
    categories: ICategory[]
    fetching: boolean

    onClick(product: IProduct): void

    onContextMenu(product: IProduct, e: React.MouseEvent): void
}

const defaultProps: Props = {
    list: [],
    categories: [],
    fetching: false,
    onClick: (product: IProduct) => {
        console.info('ProductList onClick', product)
    },
    onContextMenu: (product: IProduct, e: React.MouseEvent) => {
        console.info('ProductList onContextMenu', product, e)
    }
}

const ProductList: React.FC<Props> = (props): React.ReactElement => {
    const getCategoryName = (categoryId: number): string => {
        if (!props.categories.length) {
            return ''
        }

        const findCategory = props.categories.find((category: ICategory) => category.id === categoryId)

        if (!findCategory) {
            return ''
        }

        return findCategory.name
    }

    return (
        <List className={classes.ProductList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.cost}>Цена, руб.</ListCell>
                <ListCell className={classes.category}>Категория</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching}>
                {props.list && props.list.length ?
                    props.list.map((product: IProduct) => {
                        return (
                            <ListRow key={product.id}
                                     onContextMenu={(e: React.MouseEvent) => props.onContextMenu(product, e)}
                                     onClick={() => props.onClick(product)}
                                     isDisabled={!product.active}
                            >
                                <ListCell className={classes.name}>{product.name}</ListCell>
                                <ListCell className={classes.cost}>
                                    {product.cost && product.costOld ?
                                        <span className={classes.old}>
                                            {numberWithSpaces(round(product.costOld || 0, 2))}
                                        </span>
                                        : null
                                    }

                                    {numberWithSpaces(round(product.cost || 0, 0))}
                                </ListCell>
                                <ListCell className={classes.category}>{getCategoryName(product.categoryId)}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет товаров'/>
                }
            </ListBody>
        </List>
    )
}

ProductList.defaultProps = defaultProps
ProductList.displayName = 'ProductList'

export default React.memo(ProductList)