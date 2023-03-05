import React, {useEffect, useMemo, useState} from 'react'
import {useParams} from 'react-router-dom'
import {converter} from '../../helpers/utilHelper'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import {IFilter} from '../../../@types/IFilter'
import {IAttachment} from '../../../@types/IAttachment'
import {IProduct} from '../../../@types/IStore'
import StoreService from '../../../api/StoreService'
import AttachmentService from '../../../api/AttachmentService'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import DefaultView from '../../views/DefaultView/DefaultView'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Gallery from '../../../components/ui/Gallery/Gallery'
import Empty from '../../components/ui/Empty/Empty'
import ProductInfoBlock from './components/ProductInfoBlock/ProductInfoBlock'
import ProductAdvancedBlock from './components/ProductAdvancedBlock/ProductAdvancedBlock'
import Grid from '../../components/ui/Grid/Grid'
import GridColumn from '../../components/ui/Grid/components/GridColumn/GridColumn'
import Title from '../../components/ui/Title/Title'
import classes from './StoreProductPage.module.scss'

type StoreProductPageProps = {
    id: string
}

const ProductPage: React.FC = (): React.ReactElement => {
    const params = useParams<StoreProductPageProps>()

    const [fetchingProduct, setFetchingProduct] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [fetchingVideos, setFetchingVideos] = useState(false)
    const [product, setProduct] = useState<IProduct>({} as IProduct)
    const [images, setImages] = useState<IAttachment[]>([])
    const [videos, setVideos] = useState<IAttachment[]>([])

    useEffect(() => {
        onFetchProduct()
    }, [params.id])

    useEffect(() => {
        onFetchImages()

        onFetchVideos()
    }, [product])

    // Загрузка данных объекта недвижимости
    const onFetchProduct = (): void => {
        if (params.id) {
            const productId = parseInt(params.id)

            setFetchingProduct(true)

            StoreService.fetchProductById(productId)
                .then((response: any) => setProduct(response.data))
                .catch((error: any) => {
                    console.error('Ошибка загрузки товара', error)
                })
                .finally(() => setFetchingProduct(false))
        }
    }

    // Загрузка фотогалереи
    const onFetchImages = (): void => {
        if (product.images && product.images.length) {
            setFetchingImages(true)

            const filter: IFilter = {
                active: [0, 1],
                id: product.images,
                type: 'image'
            }

            AttachmentService.fetchAttachments(filter)
                .then((response: any) => setImages(sortAttachments(response.data, product.images)))
                .catch((error: any) => {
                    console.error('Ошибка загрузки фотогалереи товара', error)
                })
                .finally(() => setFetchingImages(false))
        }
    }

    // Загрузка фотогалереи
    const onFetchVideos = (): void => {
        if (product.videos && product.videos.length) {
            setFetchingVideos(true)

            const filter: IFilter = {
                active: [0, 1],
                id: product.videos,
                type: 'video'
            }

            AttachmentService.fetchAttachments(filter)
                .then((response: any) => setVideos(sortAttachments(response.data, product.videos)))
                .catch((error: any) => {
                    console.error('Ошибка загрузки видео товара', error)
                })
                .finally(() => setFetchingVideos(false))
        }
    }

    const pageTitle = useMemo(() => {
        return !product ? 'Товар' : !product.metaTitle ? product.name : product.metaTitle
    }, [product])

    // Вывод содержимого объекта недвижимости
    const renderProductContent = (): React.ReactElement => {
        return (
            <BlockingElement fetching={fetchingProduct}
                             className={classes.block}
            >
                <Grid className={classes.headInfo}>
                    <GridColumn width='60%'>
                        <Gallery alt={product.name}
                                 images={images}
                                 videos={videos}
                                 type='carousel'
                                 fetching={fetchingImages || fetchingVideos}
                                 avatar={product.avatarId}
                                 className={classes.gallery}
                        />
                    </GridColumn>

                    <GridColumn width='40%'>
                        <ProductInfoBlock product={product}
                                          onSave={() => onFetchProduct()}
                        />
                    </GridColumn>
                </Grid>

                <Grid className={classes.info}>
                    <GridColumn>
                        {product.description && product.description.trim() !== '' ?
                            <div className={classes.BuildingDescriptionBlock}>
                                <Title type='h2'>Описание</Title>

                                <div className={classes.text}
                                     dangerouslySetInnerHTML={{__html: converter.makeHtml(product.description)}}
                                />
                            </div>
                            : null
                        }

                        <ProductAdvancedBlock product={product}/>
                    </GridColumn>
                </Grid>
            </BlockingElement>
        )
    }

    return (
        <DefaultView pageTitle={pageTitle}>
            <Wrapper>
                <div className={classes.inner}>
                    <div className={classes.content}>
                        {product && product.id
                            ? renderProductContent()
                            : <Empty message='Товар не найден'/>
                        }
                    </div>
                </div>
            </Wrapper>
        </DefaultView>
    )
}

ProductPage.displayName = 'ProductPage'

export default React.memo(ProductPage)