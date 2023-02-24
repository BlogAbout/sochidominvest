import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {converter} from '../../helpers/utilHelper'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import {getFormatDate} from '../../../helpers/dateHelper'
import {IFilter} from '../../../@types/IFilter'
import {IArticle} from '../../../@types/IArticle'
import {IAttachment} from '../../../@types/IAttachment'
import {IBuilding} from '../../../@types/IBuilding'
import ArticleService from '../../../api/ArticleService'
import UtilService from '../../../api/UtilService'
import BuildingService from '../../../api/BuildingService'
import AttachmentService from '../../../api/AttachmentService'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import Title from '../../components/ui/Title/Title'
import DefaultView from '../../views/DefaultView/DefaultView'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Gallery from '../../../components/ui/Gallery/Gallery'
import BuildingItem from '../BuildingsPage/components/BuildingItem/BuildingItem'
import Empty from '../../components/ui/Empty/Empty'
import classes from './ArticlePage.module.scss'

type ArticlePageProps = {
    id: string
}

interface Props {
    isPublic?: boolean
}

const defaultProps: Props = {
    isPublic: false
}

const ArticlePage: React.FC<Props> = (props): React.ReactElement => {
    const params = useParams<ArticlePageProps>()

    const navigate = useNavigate()

    const [fetchingArticle, setFetchingArticle] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [fetchingBuildings, setFetchingBuildings] = useState(false)
    const [article, setArticle] = useState<IArticle>({} as IArticle)
    const [images, setImages] = useState<IAttachment[]>([])
    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [views, setViews] = useState<number>(0)

    useEffect(() => {
        onFetchArticle()
    }, [params.id])

    useEffect(() => {
        onUpdateViews()

        onFetchBuildings()

        onFetchImages()
    }, [article])

    // Загрузка данных статьи
    const onFetchArticle = (): void => {
        if (params.id) {
            const articleId = parseInt(params.id)

            setFetchingArticle(true)

            ArticleService.fetchArticleById(articleId)
                .then((response: any) => {
                    setArticle(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки статьи', error)
                })
                .finally(() => {
                    setFetchingArticle(false)
                })
        }
    }

    // Загрузка связанных объектов недвижимости
    const onFetchBuildings = (): void => {
        if (article.buildings && article.buildings.length) {
            const filter: IFilter = {
                active: [0, 1],
                id: article.buildings
            }

            if (props.isPublic) {
                filter.publish = 1
            }

            setFetchingBuildings(true)

            BuildingService.fetchBuildings(filter)
                .then((response: any) => {
                    setBuildings(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки связанных объектов недвижимости', error)
                })
                .finally(() => {
                    setFetchingBuildings(false)
                })
        }
    }

    // Загрузка фотогалереи статьи
    const onFetchImages = (): void => {
        if (article.images && article.images.length) {
            setFetchingImages(true)

            const filter: IFilter = {
                active: [0, 1],
                id: article.images,
                type: 'image'
            }

            AttachmentService.fetchAttachments(filter)
                .then((response: any) => {
                    setImages(sortAttachments(response.data, article.images))
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки фотогалереи статьи', error)
                })
                .finally(() => {
                    setFetchingImages(false)
                })
        }
    }

    // Обновление счетчика просмотров
    const onUpdateViews = (): void => {
        if (article.id) {
            UtilService.updateViews('article', article.id)
                .then(() => {
                    setViews(article.views ? article.views + 1 : 1)
                })
                .catch((error: any) => {
                    console.error('Ошибка регистрации количества просмотров', error)
                })
        }
    }

    const pageTitle = useMemo(() => {
        return !article ? 'Статьи' : !article.metaTitle ? article.name : article.metaTitle
    }, [article])

    // Отображение списка связанных объектов недвижимости
    const renderBuildingsList = (): React.ReactElement | null => {
        if (!article.buildings || !article.buildings.length || !buildings || !buildings.length) {
            return null
        }

        return (
            <div className={classes.relations}>
                <Title type='h2'>Связанные объекты</Title>

                <BlockingElement fetching={fetchingArticle || fetchingBuildings} className={classes.list}>
                    {buildings.map((building: IBuilding) => {
                        return (
                            <BuildingItem key={building.id}
                                          building={building}
                                          onClick={() => navigate(`/building/${building.id}`)}
                            />
                        )
                    })}
                </BlockingElement>
            </div>
        )
    }

    // Вывод содержимого статьи
    const renderArticleContent = (): React.ReactElement => {
        return (
            <BlockingElement fetching={fetchingArticle || fetchingBuildings} className={classes.block}>
                <Gallery alt={article.name}
                         images={images}
                         type='carousel'
                         fetching={fetchingImages}
                         avatar={article.avatarId}
                         className={classes.gallery}
                />

                <Title type='h1'
                       style='center'
                >{article.name}</Title>

                <div className={classes.description}
                     dangerouslySetInnerHTML={{__html: converter.makeHtml(article.description)}}
                />

                <div className={classes.information}>
                    <div className={classes.icon}
                         title={`Просмотры: ${views}`}
                    >
                        <FontAwesomeIcon icon='eye'/>
                        <span>{views}</span>
                    </div>

                    <div className={classes.icon}
                         title={`Дата публикации: ${getFormatDate(article.dateCreated)}`}
                    >
                        <FontAwesomeIcon icon='calendar'/>
                        <span>{getFormatDate(article.dateCreated)}</span>
                    </div>

                    {article.authorName ?
                        <div className={classes.icon}
                             title={`Автор: ${article.authorName}`}
                        >
                            <FontAwesomeIcon icon='user'/>
                            <span>{article.authorName}</span>
                        </div>
                        : null}
                </div>
            </BlockingElement>
        )
    }

    return (
        <DefaultView pageTitle={pageTitle}>
            <Wrapper>
                <div className={classes.inner}>
                    <div className={classes.content}>
                        {article && article.id
                            ? renderArticleContent()
                            : <Empty message='Объект недвижимости не найден'/>
                        }
                    </div>

                    {renderBuildingsList()}
                </div>
            </Wrapper>
        </DefaultView>
    )
}

ArticlePage.defaultProps = defaultProps
ArticlePage.displayName = 'ArticlePage'

export default React.memo(ArticlePage)