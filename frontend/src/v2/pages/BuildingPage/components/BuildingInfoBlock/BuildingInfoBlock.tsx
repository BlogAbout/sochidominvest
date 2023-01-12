import React, {useEffect, useMemo, useState} from 'react'
import {PDFDownloadLink} from '@react-pdf/renderer'
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {RouteNames} from '../../../../helpers/routerHelper'
import {IBuilding} from '../../../../../@types/IBuilding'
import {ITag} from '../../../../../@types/ITag'
import {configuration} from '../../../../../helpers/utilHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {declension} from '../../../../../helpers/stringHelper'
import {getDistrictText, getPassedText} from '../../../../../helpers/buildingHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import FavoriteService from '../../../../../api/FavoriteService'
import Title from '../../../../components/ui/Title/Title'
import Button from '../../../../../components/form/Button/Button'
import PdfDocumentGenerator from '../../../../../components/PdfDocumentGenerator/PdfDocumentGenerator'
import openPopupPriceChart from '../../../../../components/popup/PopupPriceChart/PopupPriceChart'
import openPopupFeedCreate from '../../../../../components/PopupFeedCreate/PopupFeedCreate'
import openPopupBookingCreate from '../../../../../components/popup/PopupBookingCreate/PopupBookingCreate'
import openPopupBuildingCreate from '../../../../../components/popup/PopupBuildingCreate/PopupBuildingCreate'
import openPopupSupportCreate from '../../../../../components/popup/PopupSupportCreate/PopupSupportCreate'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openPopupCompilationSelector from '../../../../../components/PopupCompilationSelector/PopupCompilationSelector'
import classes from './BuildingInfoBlock.module.scss'

interface Props {
    building: IBuilding
    views: number
    isRent?: boolean

    onSave?(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    views: 0,
    isRent: false
}

const cx = classNames.bind(classes)

const BuildingInfoBlock: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const [favorites, setFavorites] = useState<number[]>([])
    const [showCopyText, setShowCopyText] = useState(false)

    const {user} = useTypedSelector(state => state.userReducer)
    const {tags} = useTypedSelector(state => state.tagReducer)

    const {fetchTagList} = useActions()

    useEffect(() => {
        fetchTagList()
    }, [props.building])

    useEffect(() => {
        if (props.building && user) {
            onFetchFavorites()
        } else {
            setFavorites([])
        }
    }, [props.building, user])

    const onFetchFavorites = (): void => {
        if (!props.building || !props.building.id) {
            return
        }

        FavoriteService.fetchFavorites()
            .then((response: any) => setFavorites(response.data))
            .catch((error: any) => {
                console.error('Ошибка загрузки избранного', error)
            })
    }

    // Вызов окна обратной связи
    const onFeedButtonHandler = (type: 'callback' | 'get-document' | 'get-presentation' | 'get-view'): void => {
        openPopupFeedCreate(document.body, {
            building: props.building,
            type: type
        })
    }

    // Редактирование объекта
    const onClickEditHandler = (): void => {
        openPopupBuildingCreate(document.body, {
            building: props.building,
            onSave: () => props.onSave ? props.onSave() : undefined
        })
    }

    // Добавление объекта в избранное
    const addBuildingToFavorite = () => {
        if (props.building.id) {
            FavoriteService.addFavorite(props.building.id)
                .then((response: any) => setFavorites(response.data))
                .catch((error: any) => {
                    console.error('Ошибка добавления в избранное', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }

    // Удаление объекта из избранного
    const removeBuildingFromFavorite = () => {
        if (props.building.id) {
            FavoriteService.removeFavorite(props.building.id)
                .then((response: any) => setFavorites(response.data))
                .catch((error: any) => {
                    console.error('Ошибка удаления из избранного', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }

    const passedInfo = useMemo(() => {
        return getPassedText(props.building.passed)
    }, [props.building])

    const districtText = useMemo(() => {
        return getDistrictText(props.building.district, props.building.districtZone)
    }, [props.building])

    // Вывод графика цен
    const renderDynamicChangePrices = (): React.ReactElement | null => {
        if (props.isRent) {
            return null
        }

        if (!props.building.id || !props.building.costOld || !props.building.cost) {
            return null
        }

        return (
            <div className={cx({'icon': true, 'link': true})}
                 title='График цен'
                 onClick={() => openPopupPriceChart(document.body, {buildingId: props.building.id || 0})}
            >
                <FontAwesomeIcon icon='chart-line'/>
            </div>
        )
    }

    // Вывод старой цены
    const renderOldPrice = (): React.ReactElement | null => {
        if (!props.isRent || !props.building.costOld || !props.building.cost || props.building.costOld === props.building.cost) {
            return null
        }

        if (props.building.costOld > props.building.cost) {
            return (
                <span className={classes.costDown}
                      title={`Старая цена: ${numberWithSpaces(round(props.building.costOld || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-down'/>
                </span>
            )
        } else {
            return (
                <span className={classes.costUp}
                      title={`Старая цена: ${numberWithSpaces(round(props.building.costOld || 0, 0))} руб.`}
                >
                    <FontAwesomeIcon icon='arrow-up'/>
                </span>
            )
        }
    }

    const renderMetaInformation = (): React.ReactElement => {
        return (
            <div className={classes.information}>
                <div className={classes.icon} title={`Просмотры: ${props.views}`}>
                    <FontAwesomeIcon icon='eye'/>
                    <span>{props.views}</span>
                </div>

                <div className={classes.icon} title={`Дата публикации: ${props.building.dateCreated}`}>
                    <FontAwesomeIcon icon='calendar'/>
                    <span>{getFormatDate(props.building.dateCreated)}</span>
                </div>

                {props.building.authorName ?
                    <div className={classes.icon} title={`Автор: ${props.building.authorName}`}>
                        <FontAwesomeIcon icon='user'/>
                        <span>{props.building.authorName}</span>
                    </div>
                    : null}

                {renderDynamicChangePrices()}
            </div>
        )
    }

    const renderBuildingInfo = (): React.ReactElement => {
        return (
            <div className={classes.info}>
                {!props.isRent && props.building.type === 'building' ?
                    <div className={classes.row}>
                        <span>{props.building.countCheckers || 0}</span>
                        <span>{declension(props.building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], true)}</span>
                    </div>
                    : null
                }

                {!props.isRent ?
                    <div className={classes.row}>
                        {props.building.type === 'building' ?
                            <>
                                <span>{numberWithSpaces(round(props.building.costMinUnit || 0, 0))} руб.</span>
                                <span>Мин. цена за м<sup>2</sup></span>
                            </>
                            :
                            <>
                                <span>
                                    {numberWithSpaces(round(props.building.area && props.building.cost ? props.building.cost / props.building.area : 0, 0))} руб.
                                    {renderOldPrice()}
                                </span>
                                <span>Цена за м<sup>2</sup></span>
                            </>
                        }
                    </div>
                    : null
                }

                {!props.isRent ?
                    <div className={classes.row}>
                        {props.building.type === 'building' ?
                            <>
                                <span>{numberWithSpaces(round(props.building.costMin || 0, 0))} руб.</span>
                                <span>Мин. цена</span>
                            </>
                            :
                            <>
                                <span>{numberWithSpaces(round(props.building.cost || 0, 0))} руб.</span>
                                <span>Цена</span>
                            </>
                        }
                    </div>
                    : null
                }

                {props.isRent && props.building.rentData ?
                    <div className={classes.row}>
                        <span>{numberWithSpaces(round(props.building.rentData.cost || 0, 0))} руб.{props.building.rentData.type === 'short' ? '/в сутки' : '/в месяц'}</span>
                        <span>Цена</span>
                    </div>
                    : null
                }

                <div className={classes.row}>
                    {props.building.type === 'building' ?
                        <>
                            <span>{props.building.areaMin || 0} - {props.building.areaMax || 0}</span>
                            <span>Площади, м<sup>2</sup></span>
                        </>
                        :
                        <>
                            <span>{props.building.area || 0}</span>
                            <span>Площадь, м<sup>2</sup></span>
                        </>
                    }
                </div>
            </div>
        )
    }

    const renderButtons = (): React.ReactElement => {
        return (
            <div className={classes.buttons}>
                {props.building.rent ?
                    <div className={classes.buttonRent}>
                        <Button type='apply'
                                icon='house-laptop'
                                onClick={() => {
                                    if (props.building.id) {
                                        openPopupBookingCreate(document.body, {
                                            buildingId: props.building.id,
                                            onSave: () => {
                                            }
                                        })
                                    }
                                }}
                                title='Арендовать'
                        >Арендовать</Button>
                    </div>
                    : null
                }

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
        )
    }

    const renderButtonsAdmin = (): React.ReactElement | null => {
        if (!user) {
            return null
        }

        return (
            <div className={classes.buttonsAdmin}>
                {allowForRole(['director', 'administrator', 'manager'], user.role) || (props.building.author === user.id) ?
                    <Button type='apply'
                            icon='pen-to-square'
                            onClick={onClickEditHandler.bind(this)}
                            className='marginRight'
                            title='Редактировать'
                    />
                    : null
                }

                <Button type='regular'
                        icon='question'
                        onClick={() => {
                            openPopupSupportCreate(document.body, {
                                objectId: props.building.id,
                                objectType: 'building',
                                onSave: () => {
                                    openPopupAlert(document.body, {
                                        title: 'Сообщение отправлено',
                                        text: 'Ваша заявка успешно принята, мы ответим Вам в ближайшее время.',
                                        buttons: [
                                            {
                                                text: 'Перейти к заявкам',
                                                onClick: () => navigate(RouteNames.P_SUPPORT)
                                            },
                                            {text: 'Закрыть'}
                                        ]
                                    })
                                }
                            })
                        }}
                        className='marginRight'
                        title='Задать вопрос'
                />

                {props.building.id && allowForRole(['director', 'administrator', 'manager'], user.role) ?
                    <Button type='regular'
                            icon='plus'
                            onClick={() => {
                                if (props.building.id) {
                                    openPopupCompilationSelector(document.body, {
                                        buildingId: props.building.id,
                                        onSave: () => {
                                        }
                                    })
                                }
                            }}
                            className='marginRight'
                            title='Добавить в подборку'
                    />
                    : null
                }

                {props.building.id && favorites.length && favorites.includes(props.building.id) ?
                    <Button type='apply'
                            icon='heart'
                            onClick={removeBuildingFromFavorite.bind(this)}
                            className='marginRight'
                            title='Удалить из избранного'
                    />
                    :
                    <Button type='regular'
                            icon='heart'
                            onClick={addBuildingToFavorite.bind(this)}
                            className='marginRight'
                            title='Добавить в избранное'
                    />
                }

                <div className={classes.btn}>
                    <Button type='regular'
                            icon='arrow-up-from-bracket'
                            onClick={() => {
                                navigator.clipboard.writeText(configuration.siteUrl + props.building.id)
                                    .then(() => {
                                        setShowCopyText(true)
                                        setTimeout(() => {
                                            setShowCopyText(false)
                                        }, 2000)
                                    })
                            }}
                            title='Поделиться ссылкой'
                    />

                    <div className={cx({'copyText': true, 'show': showCopyText})}>Ссылка скопирована</div>
                </div>

                <PDFDownloadLink document={<PdfDocumentGenerator type='building' building={props.building}/>}>
                    {({loading}) => {
                        return (
                            <Button type='regular'
                                    icon='print'
                                    onClick={() => {
                                    }}
                                    title='Печать информации'
                                    disabled={loading}
                            />
                        )
                    }}
                </PDFDownloadLink>
            </div>
        )
    }

    return (
        <div className={classes.BuildingInfoBlock}>
            {renderMetaInformation()}

            {passedInfo !== '' &&
            <div className={cx({'passed': true, 'is': props.building.passed && props.building.passed.is})}>
                <span>{passedInfo}</span>
            </div>}

            {tags && tags.length && props.building.tags && props.building.tags.length ?
                <div className={classes.tags}>
                    {props.building.tags.map((id: number) => {
                        const findTag = tags.find((tag: ITag) => tag.id === id)

                        return findTag ? <div key={findTag.id}>{findTag.name}</div> : null
                    })}
                </div>
                : null
            }

            <Title type='h1'
                   className={classes.title}
            >{props.building.name}</Title>

            <div className={classes.address}>
                {districtText !== '' && <span>{districtText}</span>}
                <span>{props.building.address}</span>
            </div>

            {renderBuildingInfo()}

            {renderButtons()}

            {renderButtonsAdmin()}
        </div>
    )
}

BuildingInfoBlock.defaultProps = defaultProps
BuildingInfoBlock.displayName = 'BuildingInfoBlock'

export default BuildingInfoBlock