import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IBuilding} from '../../../../../@types/IBuilding'
import {declension} from '../../../../../helpers/stringHelper'
import {numberWithSpaces, round} from '../../../../../helpers/numberHelper'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {getBuildingTypesText, getDistrictText, getPassedText} from '../../../../../helpers/buildingHelper'
import Avatar from '../../../../components/ui/Avatar/Avatar'
import Title from '../../../../components/ui/Title/Title'
import classes from './BuildingItem.module.scss'

interface Props {
    building: IBuilding
    isRent?: boolean

    onClick(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    isRent: false,
    onClick: () => {
        console.info('BuildingItem onClick')
    }
}

const cx = classNames.bind(classes)

const BuildingItem: React.FC<Props> = (props): React.ReactElement => {
    const buildingType = getBuildingTypesText(props.building.type)
    const passedInfo = getPassedText(props.building.passed)
    const districtText = getDistrictText(props.building.district, props.building.districtZone)

    return (
        <div key={props.building.id} className={classes.BuildingItem} onClick={() => props.onClick()}>
            <Avatar href={props.building.avatar}
                    alt={props.building.name}
                    width='100%'
                    height='100%'
                    withWrap
            />

            <div className={classes.itemContainer}>
                <div className={classes.itemContent}>
                    <Title type='h3'
                           className={classes.head}
                    >{props.building.name}</Title>

                    <div className={classes.address}>
                        {districtText !== '' && <span>{districtText}</span>}
                        <span>{props.building.address}</span>
                    </div>
                </div>

                <div className={classes.itemInfo}>
                    {buildingType !== '' && <div className={classes.type}>{buildingType}</div>}

                    {passedInfo !== '' &&
                    <div className={cx({
                        'passed': true,
                        'is': props.building.passed && props.building.passed.is
                    })}>
                        <span>{passedInfo}</span>
                    </div>}

                    {props.isRent && props.building.rentData ?
                        <div className={classes.counter}>
                            {numberWithSpaces(round(props.building.rentData.cost || 0, 0))} руб.
                            {props.building.rentData.type === 'short' ? '/в сутки' : '/в месяц'}
                        </div>
                        : null
                    }

                    {!props.isRent ?
                        props.building.type === 'building' ?
                        <div className={classes.counter}>
                            {declension(props.building.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], false)} от {numberWithSpaces(round(props.building.costMin || 0, 0))} руб.
                        </div>
                        :
                        <div className={classes.counter}>
                            {numberWithSpaces(round(props.building.cost || 0, 0))} руб.
                        </div>
                    : null
                    }

                    {props.building.type === 'building' ?
                        <div className={classes.area}>
                            <h3>Площади</h3>
                            <div>{props.building.areaMin || 0} м<sup>2</sup> - {props.building.areaMax || 0} м<sup>2</sup>
                            </div>
                        </div>
                        :
                        <div className={classes.area}>
                            <h3>Площадь</h3>
                            <div>{props.building.area || 0} м<sup>2</sup></div>
                        </div>
                    }
                </div>

                <div className={classes.information}>
                    <div className={classes.icon}
                         title={`Просмотры: ${props.building.views}`}
                    >
                        <FontAwesomeIcon icon='eye'/>
                        <span>{props.building.views}</span>
                    </div>

                    <div className={classes.icon}
                         title={`Дата публикации: ${getFormatDate(props.building.dateCreated)}`}
                    >
                        <FontAwesomeIcon icon='calendar'/>
                        <span>{getFormatDate(props.building.dateCreated)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

BuildingItem.defaultProps = defaultProps
BuildingItem.displayName = 'BuildingItem'

export default React.memo(BuildingItem)