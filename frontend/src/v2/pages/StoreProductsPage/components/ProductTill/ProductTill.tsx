import React from 'react'
import {ICategory, IProduct} from '../../../../../@types/IStore'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import BlockItem from '../../../../components/ui/BlockItem/BlockItem'
import classes from './ProductTill.module.scss'

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
        console.info('BuildingList onClick', product)
    },
    onContextMenu: (product: IProduct, e: React.MouseEvent) => {
        console.info('ProductTill onClick', product, e)
    }
}

const ProductTill: React.FC<Props> = (props): React.ReactElement => {
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
        <div className={classes.ProductTill}>
            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.list && props.list.length ?
                    props.list.map((product: IProduct) => {
                        return (
                            <BlockItem key={product.id}
                                       title={product.name}
                                       avatar={product.avatar || ''}
                                       description={product.description}
                                       cost={product.cost}
                                       date={product.dateCreated || undefined}
                                       type={getCategoryName(product.categoryId)}
                                       isDisabled={!product.active}
                                       onContextMenu={(e: React.MouseEvent) => props.onContextMenu(product, e)}
                                       onClick={() => props.onClick(product)}
                            />
                        )
                    })
                    : <Empty message='Нет товаров'/>
                }
            </BlockingElement>
        </div>
    )
}

ProductTill.defaultProps = defaultProps
ProductTill.displayName = 'ProductTill'

export default React.memo(ProductTill)