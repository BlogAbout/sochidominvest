import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useNavigate} from 'react-router-dom'
import {declension} from '../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../helpers/numberHelper'
import {
    buildingTypes,
    formalizationList,
    getDistrictText,
    getPassedText,
    paymentsList
} from '../../../../helpers/buildingHelper'
import BuildingService from '../../../../api/BuildingService'
import FavoriteService from '../../../../api/FavoriteService'
import {IBuilding} from '../../../../@types/IBuilding'
import {ISelector} from '../../../../@types/ISelector'
import {ITag} from '../../../../@types/ITag'
import openPopupBuildingCreate from '../../../PopupBuildingCreate/PopupBuildingCreate'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import Preloader from '../../../Preloader/Preloader'
import {useTypedSelector} from '../../../../hooks/useTypedSelector'
import classes from './BuildingItem.module.scss'

interface Props {
    building: IBuilding
    isFavorite?: boolean

    onSave(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    isFavorite: false,
    onSave: () => {
        console.info('BuildingItem onSave')
    }
}

const cx = classNames.bind(classes)

const BuildingItem: React.FC<Props> = (props) => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {tags} = useTypedSelector(state => state.tagReducer)

    // Редактирование объекта
    const updateHandler = (building: IBuilding) => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление объекта
    const removeHandler = (building: IBuilding) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${building.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (building.id) {
                            setFetching(true)

                            BuildingService.removeBuilding(building.id)
                                .then(() => {
                                    setFetching(false)
                                    props.onSave()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })

                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Удаление объекта из избранного
    const removeBuildingFromFavorite = () => {
        if (props.building.id) {
            FavoriteService.removeFavorite(props.building.id)
                .then(() => {
                    props.onSave()
                })
                .catch((error: any) => {
                    console.error('Ошибка удаления из избранного', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
        }
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = []

        if (props.isFavorite) {
            menuItems.push({text: 'Удалить из избранного', onClick: () => removeBuildingFromFavorite()})
        }

        if (['director', 'administrator', 'manager'].includes(role)) {
            menuItems.push({text: 'Редактировать', onClick: () => updateHandler(props.building)})

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(props.building)})
            }
        }

        if (menuItems.length) {
            openContextMenu(e, menuItems)
        }
    }

    const buildingType = buildingTypes.find((item: ISelector) => item.key === props.building.type)
    const passedInfo = getPassedText(props.building.passed)
    const districtText = getDistrictText(props.building.district, props.building.districtZone)

    return (
        <div className={cx({'BuildingItem': true, 'disabled': props.building.active === 0})}
             onClick={() => navigate('/panel/building/' + props.building.id)}
             onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
        >
            {fetching && <Preloader/>}

            <div className={cx({
                'itemImage': true,
                'noImage': !props.building.images || !props.building.images.length
            })
            }>
                {props.building.avatar ?
                    <img src={'https://api.sochidominvest.ru/uploads/thumbs/400/' + props.building.avatar}
                         alt={props.building.name}
                    />
                    : null
                }

                {tags && tags.length && props.building.tags && props.building.tags.length ?
                    <div className={classes.tags}>
                        {props.building.tags.map((id: number) => {
                            const findTag = tags.find((tag: ITag) => tag.id === id)

                            return findTag ? <div key={findTag.id}>{findTag.name}</div> : null
                        })}
                    </div>
                    : null
                }

                {passedInfo !== '' &&
                <div className={cx({
                    'passed': true,
                    'is': props.building.passed && props.building.passed.is
                })}>
                    {passedInfo}
                </div>}
            </div>

            <div className={classes.itemContent}>
                <div className={classes.information}>
                    <div className={classes.icon} title={`Просмотры: ${props.building.views}`}>
                        <FontAwesomeIcon icon='eye'/>
                        <span>{props.building.views}</span>
                    </div>

                    <div className={classes.icon} title={`Дата публикации: ${props.building.dateCreated}`}>
                        <FontAwesomeIcon icon='calendar'/>
                        <span>{props.building.dateCreated}</span>
                    </div>

                    {props.building.authorName ?
                        <div className={classes.icon} title={`Автор: ${props.building.authorName}`}>
                            <FontAwesomeIcon icon='user'/>
                            <span>{props.building.authorName}</span>
                        </div>
                        : null}
                </div>

                <h2>{props.building.name}</h2>

                <div className={classes.address}>
                    {districtText !== '' && <span>{districtText}</span>}
                    <span>{props.building.address}</span>
                </div>

                {props.building.payments && props.building.payments.length ?
                    <div className={classes.payments}>
                        {props.building.payments.map((payment: string, index: number) => {
                            const paymentInfo = paymentsList.find((item: ISelector) => item.key === payment)
                            if (paymentInfo) {
                                return (
                                    <div key={'payment-' + index}>{paymentInfo.text}</div>
                                )
                            }
                        })}
                    </div>
                    : null
                }

                {props.building.formalization && props.building.formalization.length ?
                    <div className={classes.payments}>
                        {props.building.formalization.map((formalization: string, index: number) => {
                            const formalizationInfo = formalizationList.find((item: ISelector) => item.key === formalization)
                            if (formalizationInfo) {
                                return (
                                    <div key={'formalization-' + index}>{formalizationInfo.text}</div>
                                )
                            }
                        })}
                    </div>
                    : null
                }
            </div>

            <div className={classes.itemInfo}>
                {buildingType && <div className={classes.type}>{buildingType.text}</div>}

                {props.building.type === 'building' ?
                    <div className={classes.counter}>
                        {declension(props.building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], false)}
                    </div>
                    : null
                }

                <div className={classes.cost}>
                    {props.building.type === 'building'
                        ? `От ${numberWithSpaces(round(props.building.costMin || 0, 0))} руб.`
                        : `${numberWithSpaces(round(props.building.cost || 0, 0))} руб.`
                    }
                </div>

                <div className={classes.costPer}>
                    {props.building.type === 'building'
                        ? numberWithSpaces(round(props.building.costMinUnit || 0, 0))
                        : numberWithSpaces(round(props.building.cost && props.building.area ? props.building.cost / props.building.area : 0, 0))
                    } руб. за м<sup>2</sup>
                </div>

                <div className={classes.area}>
                    {props.building.type === 'building'
                        ? (props.building.areaMin || 0) + ' - ' + (props.building.areaMax || 0)
                        : props.building.area || 0
                    } м<sup>2</sup>
                </div>
            </div>
        </div>
    )
}

BuildingItem.defaultProps = defaultProps
BuildingItem.displayName = 'BuildingItem'

export default BuildingItem