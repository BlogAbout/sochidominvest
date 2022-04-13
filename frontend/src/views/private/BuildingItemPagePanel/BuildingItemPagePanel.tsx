import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Link, useParams} from 'react-router-dom'
import {developerTypes} from '../../../helpers/developerHelper'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {declension} from '../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../helpers/numberHelper'
import CheckerService from '../../../api/CheckerService'
import DocumentService from '../../../api/DocumentService'
import UtilService from '../../../api/UtilService'
import AttachmentService from '../../../api/AttachmentService'
import {IBuilding, IBuildingChecker, IBuildingHousing} from '../../../@types/IBuilding'
import {IDocument} from '../../../@types/IDocument'
import {ISelector} from '../../../@types/ISelector'
import {ITag} from '../../../@types/ITag'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IUser} from '../../../@types/IUser'
import {IArticle} from '../../../@types/IArticle'
import {IAttachment} from '../../../@types/IAttachment'
import Button from '../../../components/Button/Button'
import Empty from '../../../components/Empty/Empty'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Gallery from '../../../components/Gallery/Gallery'
import openPopupBuildingCreate from '../../../components/PopupBuildingCreate/PopupBuildingCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openPopupCheckerInfo from '../../../components/PopupCheckerInfo/PopupCheckerInfo'
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
    formalizationList, getAboutBlockTitle,
    getDistrictText, getPassedText,
    paymentsList
} from '../../../helpers/buildingHelper'
import classes from './BuildingItemPagePanel.module.scss'

type BuildingItemPageParams = {
    id: string
}

const cx = classNames.bind(classes)

const BuildingItemPagePanel: React.FC = (props) => {
    const params = useParams<BuildingItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [building, setBuilding] = useState<IBuilding>({} as IBuilding)
    const [checkers, setCheckers] = useState<IBuildingChecker[]>([])
    const [documents, setDocuments] = useState<IDocument[]>([])
    const [images, setImages] = useState<IAttachment[]>([])
    const [videos, setVideos] = useState<IAttachment[]>([])
    const [fetchingCheckers, setFetchingCheckers] = useState(false)
    const [fetchingDocuments, setFetchingDocuments] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [fetchingVideos, setFetchingVideos] = useState(false)

    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {developers, fetching: fetchingDeveloperList} = useTypedSelector(state => state.developerReducer)
    const {users, fetching: fetchingUserList, role} = useTypedSelector(state => state.userReducer)
    const {tags} = useTypedSelector(state => state.tagReducer)
    const {articles} = useTypedSelector(state => state.articleReducer)
    const {fetchBuildingList, fetchTagList, fetchDeveloperList, fetchUserList, fetchArticleList} = useActions()

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

            DocumentService.fetchDocuments({active: [0, 1], objectId: [building.id], objectType: 'building'})
                .then((response: any) => {
                    setFetchingDocuments(false)
                    setDocuments(response.data)
                })
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })

                    setFetchingDocuments(false)
                })

            UtilService.updateViews('building', building.id)
                .then()
                .catch((error: any) => {
                    console.error('Ошибка регистрации количества просмотров', error)
                })

            if (building.images) {
                setFetchingImages(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: building.images, type: 'image'})
                    .then((response: any) => {
                        setImages(response.data)
                    })
                    .finally(() => setFetchingImages(false))
            }

            if (building.videos) {
                setFetchingVideos(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: building.videos, type: 'video'})
                    .then((response: any) => {
                        setVideos(response.data)
                    })
                    .finally(() => setFetchingVideos(false))
            }
        }

        if ((!developers || !developers.length) && (building.developers && building.developers.length)) {
            fetchDeveloperList({active: [0, 1]})
        }

        if ((!users || !users.length) && (building.contacts && building.contacts.length)) {
            fetchUserList({active: [0, 1]})
        }

        if ((!articles || !articles.length) && (building.articles && building.articles.length)) {
            fetchArticleList({active: [0, 1]})
        }
    }, [building])

    // Редактирование объекта
    const onClickEditHandler = () => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Вывод базовой информации
    const renderInfo = () => {
        const passedInfo = getPassedText(building.passed)
        const districtText = getDistrictText(building.district, building.districtZone)

        return (
            <BlockingElement fetching={fetching} className={classes.block}>
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
                    <span className={classes.views} title={`Просмотров: ${building.views}`}>
                        <FontAwesomeIcon icon='eye'/> {building.views}
                    </span>
                </h1>

                <div className={classes.address}>
                    {districtText !== '' && <span>{districtText}</span>}
                    <span>{building.address}</span>
                </div>

                <div className={classes.container}>
                    {building.type === 'building' ?
                        <div className={classes.row}>
                            <span>{building.countCheckers || 0}</span>
                            <span>{declension(building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], true)}</span>
                        </div>
                        : null
                    }

                    <div className={classes.row}>
                        {building.type === 'building' ?
                            <>
                                <span>{numberWithSpaces(round(building.costMinUnit || 0, 0))} руб.</span>
                                <span>Мин. цена за м<sup>2</sup></span>
                            </>
                            :
                            <>
                                <span>{numberWithSpaces(round(building.area && building.cost ? building.cost / building.area : 0, 0))} руб.</span>
                                <span>Цена за м<sup>2</sup></span>
                            </>
                        }
                    </div>

                    <div className={classes.row}>
                        {building.type === 'building' ?
                            <>
                                <span>{numberWithSpaces(round(building.costMin || 0, 0))} руб.</span>
                                <span>Мин. цена</span>
                            </>
                            :
                            <>
                                <span>{numberWithSpaces(round(building.cost || 0, 0))} руб.</span>
                                <span>Цена</span>
                            </>
                        }
                    </div>

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

                <div className={classes.container}>
                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply'
                                icon='pen-to-square'
                                onClick={onClickEditHandler.bind(this)}
                                className='marginRight'
                                title='Редактировать'
                        />
                        : null
                    }

                    <Button type='regular'
                            icon='plus'
                            onClick={() => {
                            }}
                            className='marginRight'
                            title='Добавить в подборку'
                    />
                    <Button type='regular'
                            icon='heart'
                            onClick={() => {
                            }}
                            className='marginRight'
                            title='Добавить в избранное'
                    />
                    <Button type='regular'
                            icon='arrow-up-from-bracket'
                            onClick={() => {
                            }}
                            className='marginRight'
                            title='Поделиться ссылкой'
                    />
                    <Button type='regular'
                            icon='print'
                            onClick={() => {
                            }}
                            title='Печать информации'
                    />
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
                <div className={classes.container}>
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
            <div className={classes.block}>
                <h2>{getAboutBlockTitle(building.type)}</h2>

                <div className={classes.text}>
                    {building.description}
                </div>
            </div>
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

                <div className={classes.container}>
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

    // Вывод корпусов
    const renderHousing = () => {
        if (!checkers || !checkers.length) {
            return null
        }

        const housingIds: number[] = Array.from(new Set(checkers.map((checker: IBuildingChecker) => checker.housing)))
        const housingList: IBuildingHousing = {} as IBuildingHousing

        housingIds.forEach((housingId: number) => {
            housingList[housingId] = checkers.filter((checker: IBuildingChecker) => checker.housing === housingId)
        })

        return (
            <BlockingElement fetching={fetchingCheckers} className={classes.block}>
                <h2>Корпуса ({housingIds.length})</h2>

                {Object.keys(housingList).map((key: string) => {
                    const housingId: number =  parseInt(key)
                    let minCost = 0
                    let minCostUnit = 0

                    housingList[housingId].forEach((checker: IBuildingChecker) => {
                        const cost = checker.cost && checker.cost ? checker.cost : 0
                        const costUnit = checker.cost && checker.area ? checker.cost / checker.area : 0

                        if (minCost === 0 || (checker.cost && cost < minCost)) {
                            minCost = cost
                        }

                        if (minCostUnit === 0 || costUnit < minCostUnit) {
                            minCostUnit = costUnit
                        }
                    })

                    return (
                        <div key={key}
                             className={classes.housing}
                             onClick={() => openPopupCheckerInfo(document.body, {
                                 buildingName: building.name,
                                 list: housingList[housingId],
                                 housing: housingId,
                                 fetching: fetchingCheckers
                             })}
                        >
                            <div className={classes.title}>Корпус #{key}</div>
                            <div className={classes.counter}>
                                {declension(housingList[housingId].length, ['квартира', 'квартиры', 'квартир'], false)},
                                от {numberWithSpaces(round(minCost, 0))} рублей,
                                от {numberWithSpaces(round(minCostUnit, 0))} рублей за м<sup>2</sup>
                            </div>
                        </div>
                    )
                })}
            </BlockingElement>
        )
    }

    // Вывод информации о застройщике
    const renderDevelopersInfo = () => {
        return (
            <BlockingElement fetching={fetchingDeveloperList} className={classes.block}>
                <h2>Застройщик</h2>

                {building.developers && building.developers.length && developers && developers.length ?
                    <div className={classes.list}>
                        {building.developers.map((id: number) => {
                            let developerType = null
                            const developerInfo = developers.find((developer: IDeveloper) => developer.id === id)

                            if (developerInfo) {
                                developerType = developerTypes.find((item: ISelector) => item.key === developerInfo.type)
                            }

                            return developerInfo ? (
                                <div key={id}>
                                    <span>{developerInfo.name}</span>
                                    {developerType && <span>{developerType.text}</span>}
                                </div>
                            ) : null
                        })}
                    </div>
                    : <Empty message='Отсутствует информация о застройщике'/>
                }
            </BlockingElement>
        )
    }

    // Вывод информации о контактах
    const renderContactsInfo = () => {
        return (
            <BlockingElement fetching={fetchingUserList} className={classes.block}>
                <h2>Контакты</h2>

                {building.contacts && building.contacts.length && users && users.length ?
                    <div className={classes.list}>
                        {building.contacts.map((id: number) => {
                            const userInfo = users.find((user: IUser) => user.id === id)

                            return userInfo ? (
                                <div key={id}>
                                    <span>{userInfo.firstName}</span>
                                    <span>{userInfo.phone}</span>
                                </div>
                            ) : null
                        })}
                    </div>
                    : <Empty message='Отсутствует информация о контактах'/>
                }
            </BlockingElement>
        )
    }

    // Вывод информации о документах
    const renderDocumentsInfo = () => {
        return (
            <BlockingElement fetching={fetching || fetchingDocuments} className={classes.block}>
                <h2>Документы</h2>

                {documents && documents.length ?
                    documents.map((document: IDocument) => {
                        if (document.type === 'file') {
                            return (
                                <p key={document.id}>
                                    <a href={`https://api.sochidominvest.ru/uploads/${document.url}`}
                                       target='_blank'
                                    >{document.name}</a>
                                </p>
                            )
                        } else {
                            return (
                                <p key={document.id}>
                                    <a href={document.content}
                                       target='_blank'
                                    >{document.name}</a>
                                </p>
                            )
                        }
                    })
                    : <Empty message='Отсутствует информация о документах'/>
                }
            </BlockingElement>
        )
    }

    // Вывод списка статей
    const renderArticlesInfo = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.block}>
                <h2>Статьи</h2>

                {building.articles && building.articles.length && articles && articles.length ?
                    articles.map((article: IArticle) => {
                        if (article.id && [0, 1].includes(article.active) && building.articles && building.articles.includes(article.id)) {
                            return (
                                <p key={article.id}>
                                    <Link to={`/panel/article/${article.id}`}>{article.name}</Link>
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
        <div className={classes.BuildingItemPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>{!building ? 'Недвижимость - СочиДомИнвест' : `${building.name} - СочиДомИнвест`}</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.information}>
                    {!building || !building.id ?
                        <Empty message='Объект недвижимости не найден'/>
                        :
                        <div className={classes.container}>
                            <div className={classes.leftColumn}>
                                <Gallery alt={building.name}
                                         images={images}
                                         videos={videos}
                                         type='carousel'
                                         fetching={fetching || fetchingImages || fetchingVideos}
                                />

                                {renderDescription()}
                                {renderAdvantages()}
                                {renderAdvanced()}

                                {building.type === 'building' ? renderHousing() : null}
                            </div>

                            <div className={classes.rightColumn}>
                                {renderInfo()}
                                {renderDevelopersInfo()}
                                {renderContactsInfo()}
                                {renderDocumentsInfo()}
                                {renderArticlesInfo()}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

BuildingItemPagePanel.displayName = 'BuildingItemPagePanel'

export default BuildingItemPagePanel