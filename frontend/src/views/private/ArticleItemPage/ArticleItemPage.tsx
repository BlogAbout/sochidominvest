import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import classNames from 'classnames/bind'
import {IArticle} from '../../../@types/IArticle'
import {IBuilding} from '../../../@types/IBuilding'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Gallery from '../../../components/Gallery/Gallery'
import classes from './ArticleItemPage.module.scss'

type ArticleItemPageParams = {
    id: string
}

const cx = classNames.bind(classes)

const ArticleItemPage: React.FC = () => {
    const params = useParams<ArticleItemPageParams>()

    const navigate = useNavigate()

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

    const renderBuildingsInfo = () => {
        if (!article.buildings || !article.buildings.length || !buildings || !buildings.length) {
            return null
        }

        const relationList = buildings.filter((building: IBuilding) => building.id && article.buildings.includes(building.id))

        if (!relationList || !relationList.length) {
            return null
        }
        return (
            <BlockingElement fetching={fetchingArticleList || fetchingBuildingList} className={classes.relations}>
                <h2>Связанные объекты</h2>

                {relationList.map((building: IBuilding) => {
                    return (
                        <div key={building.id}
                             className={classes.item}
                             onClick={() => navigate('/panel/building/' + building.id)}
                        >
                            <div className={
                                cx({'itemImage': true, 'noImage': !building.images || !building.images.length})
                            }>
                                {building.images && building.images.length ?
                                    (
                                        <img src={'https://api.sochidominvest.ru' + building.images[0].value}
                                             alt={building.name}
                                        />
                                    )
                                    : null
                                }
                            </div>

                            <div className={classes.title}>
                                <h3>{building.name}</h3>
                                <span>{building.address}</span>
                            </div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    return (
        <main className={classes.ArticleItemPage}>
            <div className={classes.Content}>
                <div className={classes.container}>
                    <BlockingElement fetching={fetchingArticleList || fetchingBuildingList} className={classes.block}>
                        <Gallery alt={article.name} images={article.images} type='carousel' fetching={false}/>

                        <h1>
                            <span>{article.name}</span>
                        </h1>

                        <div className={classes.description}>{article.description}</div>

                        {renderBuildingsInfo()}
                    </BlockingElement>
                </div>
            </div>
        </main>
    )
}

ArticleItemPage.displayName = 'ArticleItemPage'

export default ArticleItemPage