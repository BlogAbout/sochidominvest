import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import * as Showdown from 'showdown'
import {useNavigate, useParams} from 'react-router-dom'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import UtilService from '../../../api/UtilService'
import AttachmentService from '../../../api/AttachmentService'
import {IArticle} from '../../../@types/IArticle'
import {IBuilding} from '../../../@types/IBuilding'
import {IFilter} from '../../../@types/IFilter'
import {IAttachment} from '../../../@types/IAttachment'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Gallery from '../../../components/Gallery/Gallery'
import {sortAttachments} from '../../../helpers/attachmentHelper'
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
    const [images, setImages] = useState<IAttachment[]>([])
    const [fetchingImages, setFetchingImages] = useState(false)

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
            const filter: IFilter = {} as IFilter
            filter.active = [0, 1]

            if (props.public) {
                filter.publish = 1
            }

            fetchBuildingList(filter)

            UtilService.updateViews('article', article.id)
                .then()
                .catch((error: any) => {
                    console.error('Ошибка регистрации количества просмотров', error)
                })

            if (article.images) {
                setFetchingImages(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: article.images, type: 'image'})
                    .then((response: any) => {
                        setImages(sortAttachments(response.data, article.images))
                    })
                    .finally(() => setFetchingImages(false))
            }
        }
    }, [article])

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    })

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
                                {building.avatar ?
                                    (
                                        <img src={'https://api.sochidominvest.ru/uploads/image/thumb/' + building.avatar}
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
                <meta charSet='utf-8'/>
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
                        <Gallery alt={article.name}
                                 images={images}
                                 type='carousel'
                                 fetching={fetchingImages}
                                 avatar={article.avatarId}
                        />

                        <h1><span>{article.name}</span></h1>

                        <div className={classes.description}
                             dangerouslySetInnerHTML={{__html: converter.makeHtml(article.description)}}
                        />

                        <div className={classes.information}>
                            <div className={classes.icon} title={`Просмотры: ${article.views}`}>
                                <FontAwesomeIcon icon='eye'/>
                                <span>{article.views}</span>
                            </div>

                            <div className={classes.icon} title={`Дата публикации: ${article.dateCreated}`}>
                                <FontAwesomeIcon icon='calendar'/>
                                <span>{article.dateCreated}</span>
                            </div>

                            {article.authorName ?
                                <div className={classes.icon} title={`Автор: ${article.authorName}`}>
                                    <FontAwesomeIcon icon='user'/>
                                    <span>{article.authorName}</span>
                                </div>
                            : null}
                        </div>

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