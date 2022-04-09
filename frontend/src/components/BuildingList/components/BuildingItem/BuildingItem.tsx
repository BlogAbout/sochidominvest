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

    onSave(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
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

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => updateHandler(props.building)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(props.building)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const buildingType = buildingTypes.find((item: ISelector) => item.key === props.building.type)
    const passedInfo = getPassedText(props.building.passed)
    const districtText = getDistrictText(props.building.district, props.building.districtZone)

    return (
        <div className={classes.BuildingItem}
             onClick={() => navigate('/panel/building/' + props.building.id)}
             onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
        >
            {fetching && <Preloader/>}

            <div className={cx({
                'itemImage': true,
                'noImage': !props.building.images || !props.building.images.length
            })
            }>
                {props.building.images && props.building.images.length ?
                    <img src={'https://api.sochidominvest.ru' + props.building.images[0].value}
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
                <h2>
                    {props.building.name}
                    <span className={classes.views} title={`Просмотров: ${props.building.views}`}>
                        <FontAwesomeIcon icon='eye'/> {props.building.views}
                    </span>
                </h2>

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