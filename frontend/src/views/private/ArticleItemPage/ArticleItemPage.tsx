import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {IArticle} from '../../../@types/IArticle'
import {IImageCarousel} from '../../../@types/IImageCarousel'
import {IImageDb} from '../../../@types/IImage'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel'
import classes from './ArticleItemPage.module.scss'

type ArticleItemPageParams = {
    id: string
}

const ArticleItemPage: React.FC = () => {
    const params = useParams<ArticleItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [article, setArticle] = useState<IArticle>({} as IArticle)

    const {articles, fetching: fetchingArticleList} = useTypedSelector(state => state.articleReducer)
    const {buildings, fetching: fetchingBuildingList} = useTypedSelector(state => state.buildingReducer)
    const {fetchArticleList, fetchBuildingList} = useActions()

    useEffect(() => {
        if (isUpdate || !articles.length) {
            fetchArticleList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const articleId = parseInt(params.id)
            const articleInfo = articles.find((article: IArticle) => article.id === articleId)

            if (articleInfo) {
                setArticle(articleInfo)
            }
        }
    }, [articles, params.id])

    useEffect(() => {
        if (article.id && (!buildings || !buildings.length)) {
            fetchBuildingList({active: [0, 1]})
        }
    }, [article])

    // Вывод галереи
    const renderGallery = () => {
        // let listImages: IImageCarousel[] = []
        // if (building.images && building.images.length) {
        //     listImages = building.images.filter((image: IImageDb) => image.active).map((image: IImageDb) => {
        //         return {
        //             image: 'https://api.sochidominvest.ru' + image.value,
        //             alt: building.name
        //         }
        //     })
        // }
        //
        // return (
        //     <BlockingElement fetching={fetchingArticleList || fetchingBuildingList} className={classes.gallery}>
        //         <div className={classes.carousel}>
        //             {listImages.length ?
        //                 <ImageCarousel images={listImages} alt={building.name} fancy/>
        //                 : <img src='https://api.sochidominvest.ru/uploads/no-image.jpg' alt={building.name}/>
        //             }
        //         </div>
        //     </BlockingElement>
        // )
        return null
    }

    const renderBuildingsInfo = () => {
        if (article.buildings && article.buildings.length) {
            return (
                <div className={classes.relations}>

                </div>
            )
        }

        return null
    }

    return (
        <main className={classes.ArticleItemPage}>
            <div className={classes.Content}>
                <div className={classes.container}>
                    <BlockingElement fetching={fetchingArticleList || fetchingBuildingList} className={classes.block}>
                        {renderGallery()}

                        <h1>
                            <span>Политика конфиденциальности</span>
                        </h1>

                        {article.description}

                        {renderBuildingsInfo()}
                    </BlockingElement>
                </div>
            </div>
        </main>
    )
}

ArticleItemPage.displayName = 'ArticleItemPage'

export default ArticleItemPage