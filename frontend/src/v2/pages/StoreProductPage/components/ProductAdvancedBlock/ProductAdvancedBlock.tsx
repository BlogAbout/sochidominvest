import React from 'react'
import {getFieldTypeText} from '../../../../helpers/storeHelper'
import {ICategory, IProduct} from '../../../../../@types/IStore'
import Title from '../../../../components/ui/Title/Title'
import classes from './ProductAdvancedBlock.module.scss'

interface Props {
    product: IProduct
    categories: ICategory[]
}

const defaultProps: Props = {
    product: {} as IProduct,
    categories: []
}

const ProductAdvancedBlock: React.FC<Props> = (props): React.ReactElement | null => {
    if (!props.product.fields || !Object.keys(props.product.fields).length || !props.categories.length) {
        return null
    }

    const category = props.categories.find((category: ICategory) => category.id === props.product.categoryId)
    if (!category || !category.fields.length) {
        return null
    }

    return (
        <div className={classes.ProductAdvancedBlock}>
            <div className={classes.info}>
                <div className={classes.col}>
                    <Title type='h2'>Общие характеристики</Title>

                    {Object.keys(props.product.fields).map((key: string) => {
                        if (!category.fields.includes(key) || !props.product.fields[key]) {
                            return null
                        }

                        return (
                            <div className={classes.row}>
                                <div className={classes.label}>{getFieldTypeText(key)}:</div>
                                <div className={classes.param}>{props.product.fields[key]}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

ProductAdvancedBlock.defaultProps = defaultProps
ProductAdvancedBlock.displayName = 'ProductAdvancedBlock'

export default ProductAdvancedBlock