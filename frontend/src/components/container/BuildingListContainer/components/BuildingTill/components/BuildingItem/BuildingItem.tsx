import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {declension} from '../../../../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../../../../helpers/numberHelper'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import {
    formalizationList,
    getBuildingTypesText,
    getDistrictText,
    getPassedText,
    paymentsList
} from '../../../../../../../helpers/buildingHelper'
import {IBuilding} from '../../../../../../../@types/IBuilding'
import {ISelector} from '../../../../../../../@types/ISelector'
import {ITag} from '../../../../../../../@types/ITag'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import Avatar from '../../../../../../ui/Avatar/Avatar'
import classes from './BuildingItem.module.scss'

interface Props {
    building: IBuilding
    isFavorite?: boolean
    compilationId?: number | null

    onClick(building: IBuilding): void

    onEdit(building: IBuilding): void

    onRemove(building: IBuilding): void

    onContextMenu(e: React.MouseEvent, building: IBuilding): void

    onRemoveFromFavorite(building: IBuilding): void

    onRemoveFromCompilation(building: IBuilding): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    isFavorite: false,
    compilationId: null,
    onClick: (building: IBuilding) => {
        console.info('BuildingItem onClick', building)
    },
    onEdit: (building: IBuilding) => {
        console.info('BuildingItem onEdit', building)
    },
    onRemove: (building: IBuilding) => {
        console.info('BuildingItem onRemove', building)
    },
    onContextMenu: (e: React.MouseEvent, building: IBuilding) => {
        console.info('BuildingItem onContextMenu', e, building)
    },
    onRemoveFromFavorite: (building: IBuilding) => {
        console.info('BuildingItem onRemoveFromFavorite', building)
    },
    onRemoveFromCompilation: (building: IBuilding, compilationId?: number) => {
        console.info('BuildingItem onRemoveFromCompilation', building, compilationId)
    }
}

const cx = classNames.bind(classes)

const BuildingItem: React.FC<Props> = (props) => {
    const {tags} = useTypedSelector(state => state.tagReducer)

    const buildingType = getBuildingTypesText(props.building.type)
    const passedInfo = getPassedText(props.building.passed)
    const districtText = getDistrictText(props.building.district, props.building.districtZone)

    const renderOldPrice = () => {
        if (!props.building.costOld || !props.building.cost) {
            return null
        }

        if (props.building.costOld === props.building.cost) {
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

    return (
        <div className={cx({'BuildingItem': true, 'disabled': props.building.active === 0})}
             onClick={() => props.onClick(props.building)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.building)}
        >
            <Avatar href={props.building.avatar} alt={props.building.name} width='100%'/>

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

            <div className={classes.itemContent}>
                <div className={classes.information}>
                    <div className={classes.icon} title={`Просмотры: ${props.building.views}`}>
                        <FontAwesomeIcon icon='eye'/>
                        <span>{props.building.views}</span>
                    </div>

                    <div className={classes.icon} title={`Дата публикации: ${getFormatDate(props.building.dateCreated)}`}>
                        <FontAwesomeIcon icon='calendar'/>
                        <span>{getFormatDate(props.building.dateCreated)}</span>
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
                {buildingType && <div className={classes.type}>{buildingType}</div>}

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

                    {renderOldPrice()}
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