import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {converter} from '../../../helpers/utilHelper'
import {getFormatDate} from '../../../../helpers/dateHelper'
import {numberWithSpaces, round} from '../../../../helpers/numberHelper'
import {declension} from '../../../../helpers/stringHelper'
import Avatar from '../../../../components/ui/Avatar/Avatar'
import Title from '../../../components/ui/Title/Title'
import classes from './BlockItem.module.scss'

interface Props {
    title: string
    avatar: string
    description?: string
    address?: string
    districtText?: string
    views?: number
    date?: string
    author?: string
    type?: string
    passed?: string
    isPassed?: boolean
    rentType?: string
    rentCost?: number
    countCheckers?: number
    buildingType?: string
    cost?: number
    areaMin?: number
    areaMax?: number
    isDisabled?: boolean
    className?: string

    onClick?(): void

    onContextMenu?(e: React.MouseEvent): void
}

const defaultProps: Props = {
    title: '',
    avatar: '',
    isDisabled: false
}

const cx = classNames.bind(classes)

const BlockItem: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'BlockItem': true, 'disabled': props.isDisabled}, props.className)}
             onClick={() => {
                 if (props.onClick) {
                     props.onClick()
                 }
             }}
             onContextMenu={(e: React.MouseEvent) => {
                 if (props.onContextMenu) {
                     props.onContextMenu(e)
                 }
             }}
        >
            <Avatar href={props.avatar}
                    alt={props.title}
                    width='100%'
                    height='100%'
                    withWrap
            />

            <div className={classes.itemContent}>
                <Title type='h3'
                       style='right'
                       className={classes.head}
                >{props.title}</Title>

                {props.address ?
                    <div className={classes.address}>
                        {props.districtText !== '' && <span>{props.districtText}</span>}
                        <span>{props.address}</span>
                    </div>
                    : null
                }

                {props.description ?
                    <div className={classes.description}
                         dangerouslySetInnerHTML={{__html: converter.makeHtml(props.description.substring(0, 150))}}
                    />
                    : null
                }

                {props.passed || props.rentType || props.rentCost || props.countCheckers || props.buildingType ?
                    <div className={classes.itemInfo}>
                        {props.passed !== '' ?
                            <div className={cx({
                                'passed': true,
                                'is': props.isPassed
                            })}>
                                <span>{props.passed}</span>
                            </div>
                            : null
                        }

                        {props.rentType && props.rentCost ?
                            <div className={classes.counter}>
                                {numberWithSpaces(round(props.rentCost || 0, 0))} руб.
                                {props.rentType}
                            </div>
                            : null
                        }

                        {props.countCheckers !== undefined ?
                            props.buildingType && props.buildingType === 'building' ?
                                <div className={classes.counter}>
                                    {declension(props.countCheckers || 0, ['квартира', 'квартиры', 'квартир'], false)} от {numberWithSpaces(round(props.cost || 0, 0))} руб.
                                </div>
                                :
                                <div className={classes.counter}>
                                    {numberWithSpaces(round(props.cost || 0, 0))} руб.
                                </div>
                            : null
                        }

                        {props.buildingType && props.buildingType === 'building' ?
                            <div className={classes.area}>
                                <h3>Площади</h3>
                                <div>{props.areaMin || 0} м<sup>2</sup> - {props.areaMax || 0} м<sup>2</sup>
                                </div>
                            </div>
                            :
                            <div className={classes.area}>
                                <h3>Площадь</h3>
                                <div>{props.areaMin || 0} м<sup>2</sup></div>
                            </div>
                        }
                    </div>
                    : null
                }
            </div>

            {props.type !== '' && <div className={classes.type}>{props.type}</div>}

            {props.views || props.date ?
                <div className={classes.information}>
                    {props.views ?
                        <div className={classes.icon} title={`Просмотры: ${props.views}`}>
                            <FontAwesomeIcon icon='eye'/>
                            <span>{props.views}</span>
                        </div>
                        : null
                    }

                    {props.date ?
                        <div className={classes.icon} title={`Дата публикации: ${getFormatDate(props.date)}`}>
                            <FontAwesomeIcon icon='calendar'/>
                            <span>{getFormatDate(props.date)}</span>
                        </div>
                        : null
                    }
                </div>
                : null
            }
        </div>
    )
}

BlockItem.defaultProps = defaultProps
BlockItem.displayName = 'BlockItem'

export default React.memo(BlockItem)