import React, {useMemo} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {ICategory, IProduct} from '../../../../../@types/IStore'
import {IFeed} from '../../../../../@types/IFeed'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import Title from '../../../../components/ui/Title/Title'
import Button from '../../../../../components/form/Button/Button'
import openPopupFeedCreate from '../../../../../components/popup/PopupFeedCreate/PopupFeedCreate'
import classes from './ProductInfoBlock.module.scss'

interface Props {
    product: IProduct
    categories: ICategory[]

    onSave?(): void
}

const defaultProps: Props = {
    product: {} as IProduct,
    categories: []
}

const ProductInfoBlock: React.FC<Props> = (props): React.ReactElement => {
    const category = useMemo(() => {
        if (props.categories && props.categories.length) {
            const findCategory = props.categories.find((item: ICategory) => item.id === props.product.categoryId)

            if (findCategory) {
                return findCategory
            }
        }

        return null
    }, [props.categories, props.product.categoryId])

    // Вызов окна обратной связи
    const onFeedButtonHandler = (): void => {
        const feed: IFeed = {
            id: null,
            author: null,
            phone: '',
            name: '',
            title: `Заявка на покупку ${props.product.name}`,
            type: 'callback',
            objectId: props.product.id,
            objectType: 'store',
            active: 1,
            status: 'new'
        }
        openPopupFeedCreate(document.body, {
            feed: feed,
            type: 'callback'
        })
    }

    // Вывод графика цен
    const renderDynamicChangePrices = (): React.ReactElement | null => {
        // Todo
        return null
        // if (!props.product.id || !props.product.costOld || !props.product.cost) {
        //     return null
        // }
        //
        // return (
        //     <div className={cx({'icon': true, 'link': true})}
        //          title='График цен'
        //          onClick={() => openPopupPriceChart(document.body, {productId: props.product.id || 0})}
        //     >
        //         <FontAwesomeIcon icon='chart-line'/>
        //     </div>
        // )
    }

    // Вывод старой цены
    const renderOldPrice = (): React.ReactElement | null => {
        if (!props.product.costOld) {
            return null
        }

        if (props.product.costOld > props.product.cost) {
            return (
                <span className={classes.costDown}
                      title={`Старая цена: ${numberWithSpaces(round(props.product.costOld || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-down'/>
                </span>
            )
        } else {
            return (
                <span className={classes.costUp}
                      title={`Старая цена: ${numberWithSpaces(round(props.product.costOld || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-up'/>
                </span>
            )
        }
    }

    const renderMetaInformation = (): React.ReactElement => {
        return (
            <div className={classes.information}>
                <div className={classes.icon} title={`Дата публикации: ${props.product.dateCreated}`}>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{getFormatDate(props.product.dateCreated)}</span>
                </div>

                {renderDynamicChangePrices()}
            </div>
        )
    }

    const renderProductInfo = (): React.ReactElement => {
        return (
            <div className={classes.info}>
                <div className={classes.row}>

                    <>
                        <span>{numberWithSpaces(round(props.product.cost || 0, 0))} руб.</span>
                        <span>Цена</span>
                    </>
                </div>

                {props.product.costOld ?
                    <div className={classes.row}>

                        <>
                            <span>{numberWithSpaces(round(props.product.costOld || 0, 0))} руб.</span>
                            <span>Старая цена</span>
                        </>
                    </div>
                    : null
                }
            </div>
        )
    }

    const renderButtons = (): React.ReactElement => {
        return (
            <div className={classes.buttons}>
                <Button type='save'
                        onClick={() => onFeedButtonHandler()}
                >Заказать</Button>
            </div>
        )
    }

    return (
        <div className={classes.ProductInfoBlock}>
            {renderMetaInformation()}

            {category ?
                <div className={classes.category}>
                    <div>{category.name}</div>
                </div>
                : null
            }

            <Title type='h1'
                   className={classes.title}
            >{props.product.name}</Title>

            {renderProductInfo()}

            {renderButtons()}
        </div>
    )
}

ProductInfoBlock.defaultProps = defaultProps
ProductInfoBlock.displayName = 'ProductInfoBlock'

export default ProductInfoBlock