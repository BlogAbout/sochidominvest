import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {useNavigate, useParams} from 'react-router-dom'
import classNames from 'classnames/bind'
import {IArticle} from '../../../@types/IArticle'
import {IBuilding} from '../../../@types/IBuilding'
import {IFilter} from '../../../@types/IFilter'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Gallery from '../../../components/Gallery/Gallery'
import classes from './ArticleItemPagePanel.module.scss'

type ArticleItemPageParams = {
    id: string
}

interface Props {
    public?: boolean
}

const defaultProps: Props = {
    public: false
}

const cx = classNames.bind(classes)

const ArticleItemPagePanel: React.FC<Props> = (props) => {
    const params = useParams<ArticleItemPageParams>()

    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [article, setArticle] = useState<IArticle>({} as IArticle)

    const {articles, fetching: fetchingArticleList} = useTypedSelector(state => state.articleReducer)
    const {buildings, fetching: fetchingBuildingList} = useTypedSelector(state => state.buildingReducer)
    const {fetchArticleList, fetchBuildingList} = useActions()

    useEffect(() => {
        document.title = 'Статьи'

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
            document.title = article.metaTitle || 'Статьи'
            document.title = article.metaDescription || ''

            const filter: IFilter = {} as IFilter
            filter.active = [0, 1]

            if (props.public) {
                filter.publish = 1
            }

            fetchBuildingList(filter)
        }
    }, [article])

    const renderBuildingsInfo = () => {
        if (!article.buildings || !article.buildings.length || !buildings || !buildings.length) {
            return null
        }

        const relationList = buildings.filter((building: IBuilding) => {
            return (!props.public || (props.public && building.active === 1)) && building.id && article.buildings.includes(building.id)
        })

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
                             onClick={() => {
                                 navigate(props.public ? `/building/${building.id}` : `/panel/building/${building.id}`)
                             }}
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
        <main className={classes.ArticleItemPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>
                    {!article ? 'Статьи - СочиДомИнвест' : !article.metaTitle ? `${article.name} - СочиДомИнвест` : `${article.metaTitle} - СочиДомИнвест`}
                </title>
                <meta name='description'
                      content={!article || !article.metaDescription ? '' : article.metaDescription}
                />
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.container}>
                    <BlockingElement fetching={fetchingArticleList || fetchingBuildingList} className={classes.block}>
                        <Gallery alt={article.name} images={article.images} type='carousel' fetching={false}/>

                        <h1><span>{article.name}</span></h1>

                        <div className={classes.description}>{article.description}</div>

                        {renderBuildingsInfo()}
                    </BlockingElement>
                </div>
            </div>
        </main>
    )
}

ArticleItemPagePanel.defaultProps = defaultProps
ArticleItemPagePanel.displayName = 'ArticleItemPagePanel'

export default ArticleItemPagePanel