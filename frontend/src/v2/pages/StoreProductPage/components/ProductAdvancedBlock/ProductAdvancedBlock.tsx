import React from 'react'
import {IProduct} from '../../../../../@types/IStore'
import Title from '../../../../components/ui/Title/Title'
import classes from './ProductAdvancedBlock.module.scss'

interface Props {
    product: IProduct
}

const defaultProps: Props = {
    product: {} as IProduct
}

const ProductAdvancedBlock: React.FC<Props> = (props): React.ReactElement | null => {
    return null

    // Todo
    return (
        <div className={classes.ProductAdvancedBlock}>
            <div className={classes.info}>
                <div className={classes.col}>
                    <Title type='h2'>Общие характеристики</Title>

                    <div className={classes.row}>
                        <div className={classes.label}>:</div>
                        <div className={classes.param}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

ProductAdvancedBlock.defaultProps = defaultProps
ProductAdvancedBlock.displayName = 'ProductAdvancedBlock'

export default ProductAdvancedBlock