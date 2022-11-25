import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import * as Showdown from 'showdown'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Link, useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import {getFormatDate} from '../../../helpers/dateHelper'
import CheckerService from '../../../api/CheckerService'
import ArticleService from '../../../api/ArticleService'
import UtilService from '../../../api/UtilService'
import AttachmentService from '../../../api/AttachmentService'
import {IBuilding, IBuildingChecker} from '../../../@types/IBuilding'
import {ISelector} from '../../../@types/ISelector'
import {IAttachment} from '../../../@types/IAttachment'
import {ITag} from '../../../@types/ITag'
import {IArticle} from '../../../@types/IArticle'
import Empty from '../../../components/Empty/Empty'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Gallery from '../../../components/Gallery/Gallery'
import Button from '../../../components/form/Button/Button'
import openPopupFeedCreate from '../../../components/PopupFeedCreate/PopupFeedCreate'
import openPopupPriceChart from '../../../components/popup/PopupPriceChart/PopupPriceChart'
import {
    amountContract,
    buildingAdvantages,
    buildingClasses,
    buildingElectricity,
    buildingEntrance,
    buildingFormat,
    buildingGas,
    buildingHeating,
    buildingMaterials,
    buildingParking,
    buildingSewerage,
    buildingTerritory,
    buildingTypes,
    buildingWaterSupply,
    formalizationList,
    getAboutBlockTitle,
    getDistrictText,
    getPassedText,
    paymentsList
} from '../../../helpers/buildingHelper'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import classes from './RentItemPage.module.scss'

type RentItemPageParams = {
    id: string
}

const cx = classNames.bind(classes)

const RentItemPage: React.FC = () => {
    const params = useParams<RentItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [building, setBuilding] = useState<IBuilding>({} as IBuilding)
    const [checkers, setCheckers] = useState<IBuildingChecker[]>([])
    const [articles, setArticles] = useState<IArticle[]>([])
    const [images, setImages] = useState<IAttachment[]>([])
    const [videos, setVideos] = useState<IAttachment[]>([])
    const [fetchingCheckers, setFetchingCheckers] = useState(false)
    const [fetchingArticles, setFetchingArticles] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [fetchingVideos, setFetchingVideos] = useState(false)

    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {tags} = useTypedSelector(state => state.tagReducer)
    const {fetchBuildingList, fetchTagList} = useActions()

    useEffect(() => {
        if (isUpdate || !buildings.length) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const buildingId = parseInt(params.id)
            const buildingInfo = buildings.find((building: IBuilding) => building.id === buildingId)

            if (buildingInfo) {
                setBuilding(buildingInfo)
            }
        }
    }, [buildings, params.id])

    useEffect(() => {
        if (building.id) {
            setFetchingCheckers(true)
            setFetchingArticles(true)

            CheckerService.fetchCheckers(building.id)
                .then((response) => {
                    setCheckers(response.data)

                    fetchTagList()
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки шахматки', error)
                })
                .finally(() => {
                    setFetchingCheckers(false)
                })

            ArticleService.fetchArticles({active: [0, 1], publish: 1})
                .then((response) => {
                    setArticles(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки статей', error)
                })
                .finally(() => {
                    setFetchingArticles(false)
                })

            UtilService.updateViews('building', building.id)
                .then()
                .catch((error: any) => {
                    console.error('Ошибка регистрации количества просмотров', error)
                })

            if (building.images && building.images.length) {
                setFetchingImages(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: building.images, type: 'image'})
                    .then((response: any) => {
                        setImages(sortAttachments(response.data, building.images))
                    })
                    .finally(() => setFetchingImages(false))
            }

            if (building.videos && building.videos.length) {
                setFetchingVideos(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: building.videos, type: 'video'})
                    .then((response: any) => {
                        setVideos(response.data)
                    })
                    .finally(() => setFetchingVideos(false))
            }
        }
    }, [building])

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    })

    const onFeedButtonHandler = (type: 'callback' | 'get-document' | 'get-presentation' | 'get-view') => {
        openPopupFeedCreate(document.body, {
            building: building,
            type: type
        })
    }

    // Вывод графика цен
    const renderDynamicChangePrices = () => {
        if (!building.id || !building.costOld || !building.cost) {
            return null
        }

        return (
            <div className={cx({'icon': true, 'link': true})}
                 title='График цен'
                 onClick={() => openPopupPriceChart(document.body, {buildingId: building.id || 0})}
            >
                <FontAwesomeIcon icon='chart-line'/>
            </div>
        )
    }

    const renderOldPrice = () => {
        if (!building.costOld || !building.cost) {
            return null
        }

        if (building.costOld === building.cost) {
            return null
        }

        if (building.costOld > building.cost) {
            return (
                <span className={classes.costDown}
                      title={`Старая цена: ${numberWithSpaces(round(building.costOld || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-down'/>
                </span>
            )
        } else {
            return (
                <span className={classes.costUp}
                      title={`Старая цена: ${numberWithSpaces(round(building.costOld || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-up'/>
                </span>
            )
        }
    }

    // Вывод базовой информации
    const renderInfo = () => {
        const passedInfo = getPassedText(building.passed)
        const districtText = getDistrictText(building.district, building.districtZone)

        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <div className={classes.mainInfo}>
                    {passedInfo !== '' &&
                    <div className={cx({'passed': true, 'is': building.passed && building.passed.is})}>
                        <span>{passedInfo}</span>
                    </div>}

                    {tags && tags.length && building.tags && building.tags.length ?
                        <div className={classes.tags}>
                            {building.tags.map((id: number) => {
                                const findTag = tags.find((tag: ITag) => tag.id === id)

                                return findTag ? <div key={findTag.id}>{findTag.name}</div> : null
                            })}
                        </div>
                        : null
                    }

                    <h1>
                        {building.name}

                        <div className={classes.information}>
                            <div className={classes.icon} title={`Просмотры: ${building.views}`}>
                                <FontAwesomeIcon icon='eye'/>
                                <span>{building.views}</span>
                            </div>

                            <div className={classes.icon} title={`Дата публикации: ${building.dateCreated}`}>
                                <FontAwesomeIcon icon='calendar'/>
                                <span>{getFormatDate(building.dateCreated)}</span>
                            </div>

                            {building.authorName ?
                                <div className={classes.icon} title={`Автор: ${building.authorName}`}>
                                    <FontAwesomeIcon icon='user'/>
                                    <span>{building.authorName}</span>
                                </div>
                                : null}

                            {renderDynamicChangePrices()}
                        </div>
                    </h1>

                    <div className={classes.address}>
                        {districtText !== '' && <span>{districtText}</span>}
                        <span>{building.address}</span>
                    </div>

                    <div className={classes.info}>
                        {building.rentData ?
                            <div className={classes.row}>
                                <span>{numberWithSpaces(round(building.rentData.cost || 0, 0))} руб.{building.rentData.type === 'short' ? '/в сутки' : '/в месяц'}</span>
                                <span>Цена</span>
                            </div>
                            : null
                        }

                        <div className={classes.row}>
                            {building.type === 'building' ?
                                <>
                                    <span>{building.areaMin || 0} - {building.areaMax || 0}</span>
                                    <span>Площади, м<sup>2</sup></span>
                                </>
                                :
                                <>
                                    <span>{building.area || 0}</span>
                                    <span>Площадь, м<sup>2</sup></span>
                                </>
                            }
                        </div>
                    </div>

                    <div className={classes.buttons}>
                        <Button type='save'
                                onClick={() => onFeedButtonHandler('callback')}
                        >Заказать обратный звонок</Button>
                        <Button type='save'
                                onClick={() => onFeedButtonHandler('get-document')}
                        >Запросить документы</Button>
                        <Button type='save'
                                onClick={() => onFeedButtonHandler('get-presentation')}
                        >Скачать презентацию</Button>
                        <Button type='save'
                                onClick={() => onFeedButtonHandler('get-view')}
                        >Записаться на просмотр</Button>
                    </div>
                </div>
            </BlockingElement>
        )
    }

    // Вывод подробной информации
    const renderAdvanced = () => {
        const houseClass = buildingClasses.find(item => item.key === building.houseClass)
        const material = buildingMaterials.find(item => item.key === building.material)
        const houseType = buildingFormat.find(item => item.key === building.houseType)
        const entranceHouse = buildingEntrance.find(item => item.key === building.entranceHouse)
        const parking = buildingParking.find(item => item.key === building.parking)
        const territory = buildingTerritory.find(item => item.key === building.territory)
        const gas = buildingGas.find(item => item.key === building.gas)
        const heating = buildingHeating.find(item => item.key === building.heating)
        const electricity = buildingElectricity.find(item => item.key === building.electricity)
        const sewerage = buildingSewerage.find(item => item.key === building.sewerage)
        const waterSupply = buildingWaterSupply.find(item => item.key === building.waterSupply)
        const contract = amountContract.find(item => item.key === building.amountContract)
        const type = buildingTypes.find(item => item.key === building.type)

        let payments: string[] = paymentsList.filter((item: ISelector) => building.payments?.includes(item.key)).map((item: ISelector) => item.text)
        let formalizations: string[] = formalizationList.filter((item: ISelector) => building.formalization?.includes(item.key)).map((item: ISelector) => item.text)

        return (
            <div className={classes.block}>
                <div className={classes.info}>
                    <div className={classes.col}>
                        <h2>Общие характеристики</h2>

                        {houseClass && <div className={classes.row}>
                            <div className={classes.label}>Класс дома:</div>
                            <div className={classes.param}>{houseClass.text}</div>
                        </div>}

                        {material && <div className={classes.row}>
                            <div className={classes.label}>Материал здания:</div>
                            <div className={classes.param}>{material.text}</div>
                        </div>}

                        {houseType && <div className={classes.row}>
                            <div className={classes.label}>Тип дома:</div>
                            <div className={classes.param}>{houseType.text}</div>
                        </div>}

                        {parking && <div className={classes.row}>
                            <div className={classes.label}>Паркинг:</div>
                            <div className={classes.param}>{parking.text}</div>
                        </div>}

                        {territory && <div className={classes.row}>
                            <div className={classes.label}>Территория:</div>
                            <div className={classes.param}>{territory.text}</div>
                        </div>}

                        {entranceHouse && <div className={classes.row}>
                            <div className={classes.label}>Подъезд к дому:</div>
                            <div className={classes.param}>{entranceHouse.text}</div>
                        </div>}

                        {building.ceilingHeight && building.ceilingHeight > 0 ?
                            <div className={classes.row}>
                                <div className={classes.label}>Высота потолков:</div>
                                <div className={classes.param}>{building.ceilingHeight} м.</div>
                            </div>
                            : null}

                        {building.maintenanceCost && building.maintenanceCost > 0 ?
                            <div className={classes.row}>
                                <div className={classes.label}>Стоимость обслуживания:</div>
                                <div className={classes.param}>{building.maintenanceCost} руб./м<sup>2</sup></div>
                            </div>
                            : null}

                        {building.distanceSea && building.distanceSea > 0 ?
                            <div className={classes.row}>
                                <div className={classes.label}>Расстояние до моря:</div>
                                <div className={classes.param}>{building.distanceSea} м.</div>
                            </div>
                            : null}
                    </div>

                    <div className={classes.col}>
                        <h2>Коммуникации</h2>

                        {gas ?
                            <div className={classes.row}>
                                <div className={classes.label}>Газ:</div>
                                <div className={classes.param}>{gas.text}</div>
                            </div>
                            : null
                        }

                        {heating ?
                            <div className={classes.row}>
                                <div className={classes.label}>Отопление:</div>
                                <div className={classes.param}>{heating.text}</div>
                            </div>
                            : null
                        }

                        {electricity ?
                            <div className={classes.row}>
                                <div className={classes.label}>Электричество:</div>
                                <div className={classes.param}>{electricity.text}</div>
                            </div>
                            : null
                        }

                        {sewerage ?
                            <div className={classes.row}>
                                <div className={classes.label}>Канализация:</div>
                                <div className={classes.param}>{sewerage.text}</div>
                            </div>
                            : null
                        }

                        {waterSupply ?
                            <div className={classes.row}>
                                <div className={classes.label}>Водоснабжение:</div>
                                <div className={classes.param}>{waterSupply.text}</div>
                            </div>
                            : null
                        }
                    </div>

                    <div className={classes.col}>
                        <h2>Оформление</h2>

                        {formalizations.length ?
                            <div className={classes.row}>
                                <div className={classes.label}>Варианты оформления:</div>
                                <div className={classes.param}>{formalizations.join(', ')}</div>
                            </div>
                            : null
                        }

                        {type ?
                            <div className={classes.row}>
                                <div className={classes.label}>Тип недвижимости:</div>
                                <div className={classes.param}>{type.text}</div>
                            </div>
                            : null
                        }

                        {contract ?
                            <div className={classes.row}>
                                <div className={classes.label}>Сумма в договоре:</div>
                                <div className={classes.param}>{contract.text}</div>
                            </div>
                            : null
                        }

                        <div className={classes.row}>
                            <div className={classes.label}>Продажа для нерезидентов России:</div>
                            <div className={classes.param}>
                                {!!building.saleNoResident ? 'Доступно' : 'Не доступно'}
                            </div>
                        </div>
                    </div>

                    <div className={classes.col}>
                        <h2>Оплата</h2>

                        {payments.length ?
                            <div className={classes.row}>
                                <div className={classes.label}>Варианты оплаты:</div>
                                <div className={classes.param}>{payments.join(', ')}</div>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        )
    }

    // Вывод описания
    const renderDescription = () => {
        if (!building.description || building.description.trim() === '') {
            return null
        }

        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <h2>{getAboutBlockTitle(building.type)}</h2>

                <div className={classes.text}
                     dangerouslySetInnerHTML={{__html: converter.makeHtml(building.description)}}
                />
            </BlockingElement>
        )
    }

    // Вывод особенностей
    const renderAdvantages = () => {
        if (!building.advantages || !building.advantages.length) {
            return null
        }

        return (
            <div className={classes.block}>
                <h2>Преимущества</h2>

                <div className={classes.info}>
                    {building.advantages.map((item: string, index: number) => {
                        const advantage = buildingAdvantages.find(element => element.key === item)

                        if (!advantage) {
                            return null
                        }

                        return (
                            <div key={index} className={classes.advantage}>
                                <span>{advantage.text}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    // Вывод списка статей
    const renderArticlesInfo = () => {
        return (
            <BlockingElement fetching={fetchingArticles} className={classes.block}>
                <h2>Статьи</h2>

                {building.articles && building.articles.length && articles && articles.length ?
                    articles.map((article: IArticle) => {
                        if (article.id && [0, 1].includes(article.active) && building.articles && building.articles.includes(article.id)) {
                            return (
                                <p key={article.id}>
                                    <Link to={`/article/${article.id}`}>{article.name}</Link>
                                </p>
                            )
                        } else {
                            return null
                        }
                    })
                    : <Empty message='Отсутствует информация о статьях'/>
                }
            </BlockingElement>
        )
    }

    return (
        <div className={classes.RentItemPage}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>
                    {!building
                        ? 'Аренда - СочиДомИнвест'
                        : !building.metaTitle
                            ? `${building.name} - СочиДомИнвест`
                            : `${building.metaTitle} - СочиДомИнвест`
                    }
                </title>
                <meta name='description'
                      content={!building || !building.metaDescription ? '' : building.metaDescription}
                />
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.container}>
                    {!building || !building.id ?
                        <Empty message='Объект недвижимости не найден'/>
                        :
                        <div className={classes.information}>
                            <Gallery alt={building.name}
                                     images={images}
                                     videos={videos}
                                     type='carousel'
                                     fetching={fetching || fetchingImages || fetchingVideos}
                                     avatar={building.avatarId}
                            />

                            {renderInfo()}
                            {renderDescription()}
                            {renderAdvantages()}
                            {renderAdvanced()}
                            {renderArticlesInfo()}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

RentItemPage.displayName = 'RentItemPage'

export default RentItemPage