import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IFilterContent} from '../../../@types/IFilter'
import Empty from '../../Empty/Empty'
import ComboBox from '../../ComboBox/ComboBox'
import SelectorBox from '../../SelectorBox/SelectorBox'
import {ISelector} from '../../../@types/ISelector'
import CheckBox from '../../form/CheckBox/CheckBox'
import BlockingElement from '../BlockingElement/BlockingElement'
import Label from '../../form/Label/Label'
import NumberBox from '../../NumberBox/NumberBox'
import DistrictBox from '../../form/DistrictBox/DistrictBox'
import classes from './SidebarLeft.module.scss'

const cx = classNames.bind(classes)

interface Props {
    filters: IFilterContent[]
    isShow?: boolean

    onChangeShow?(isShow: boolean): void
}

const defaultProps: Props = {
    filters: [],
    isShow: false,
    onChangeShow: (isShow) => {
        console.info('SidebarLeft onChangeShow', isShow)
    }
}

const SidebarLeft: React.FC<Props> = (props) => {
    const [isShow, setIsShow] = useState(props.isShow)

    useEffect(() => {
        setIsShow(props.isShow)
    }, [props.isShow])

    const renderSelectorItem = (filter: IFilterContent) => {
        if (filter.multi) {
            return (
                <ComboBox selected={filter.selected.length ? filter.selected[0] : null}
                          items={filter.items ? Object.values(filter.items) : []}
                          onSelect={(value: string) => filter.onSelect([value])}
                          placeHolder='Выберите'
                          styleType='standard'
                />
            )
        } else {
            return (
                <SelectorBox selected={filter.selected}
                             items={filter.items ? Object.values(filter.items) : []}
                             onSelect={(value: string[]) => filter.onSelect(value)}
                             placeHolder='Выберите'
                             multi
                             styleType='standard'
                />
            )
        }
    }

    const renderCheckerItem = (filter: IFilterContent) => {
        const selectItemHandler = (value: string) => {
            if (filter.selected.includes(value)) {
                return filter.selected.filter((item: string) => item !== value)
            } else {
                return [...filter.selected, value]
            }
        }

        return (
            <div className={classes.checkItems}>
                {filter.items ?
                    filter.items.map((item: ISelector, index: number) => {
                        return (
                            <CheckBox key={index}
                                      label={item.text}
                                      type='classic'
                                      checked={filter.selected.includes(item.key)}
                                      onChange={() => filter.onSelect(selectItemHandler(item.key))}
                            />
                        )
                    })
                    : null
                }
            </div>
        )
    }

    const renderRangerItem = (filter: IFilterContent) => {
        return (
            <div className={classes.rangeItem}>
                <div className={classes.col}>
                    <Label
                        text={filter.rangerParams && filter.rangerParams.suffix ? `От, ${filter.rangerParams.suffix}` : 'От'}
                    />
                    <NumberBox value={filter.selected && filter.selected.min ? filter.selected.min : ''}
                               min={0}
                               step={filter.rangerParams ? filter.rangerParams.step : undefined}
                               max={filter.rangerParams ? filter.rangerParams.max : undefined}
                               countAfterComma={filter.rangerParams ? filter.rangerParams.afterComma : undefined}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => {
                                   filter.onSelect({...filter.selected, min: value})
                               }}
                               placeHolder={filter.rangerParams && filter.rangerParams.suffix ? `От, ${filter.rangerParams.suffix}` : 'От'}
                    />
                </div>

                <div className={classes.col}>
                    <Label
                        text={filter.rangerParams && filter.rangerParams.suffix ? `До, ${filter.rangerParams.suffix}` : 'До'}
                    />
                    <NumberBox value={filter.selected && filter.selected.max ? filter.selected.max : ''}
                               min={0}
                               step={filter.rangerParams ? filter.rangerParams.step : undefined}
                               max={filter.rangerParams ? filter.rangerParams.max : undefined}
                               countAfterComma={filter.rangerParams ? filter.rangerParams.afterComma : undefined}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => {
                                   filter.onSelect({...filter.selected, max: value})
                               }}
                               placeHolder={filter.rangerParams && filter.rangerParams.suffix ? `До, ${filter.rangerParams.suffix}` : 'До'}
                    />
                </div>
            </div>
        )
    }

    const renderDistrictItem = (filter: IFilterContent) => {
        return (
            <div className={classes.fieldItem}>
                <DistrictBox selected={filter.selected}
                             onSelect={(selected: string[]) => {
                                 filter.onSelect(selected)
                             }}
                             placeHolder={filter.title}
                             showClear
                />
            </div>
        )
    }

    const renderFilterItemByType = (filter: IFilterContent) => {
        switch (filter.type) {
            case 'selector':
                return renderSelectorItem(filter)
            case 'checker':
                return renderCheckerItem(filter)
            case 'ranger':
                return renderRangerItem(filter)
            case 'district':
                return renderDistrictItem(filter)
        }
    }

    const renderFilterItem = (filter: IFilterContent, index: number) => {
        return (
            <div key={index} className={classes.item}>
                <h3>{filter.title}</h3>

                {renderFilterItemByType(filter)}
            </div>
        )
    }

    return (
        <aside className={cx({'SidebarLeft': true, 'show': isShow || props.isShow})}>
            <div className={classes.content}>
                <h2>Фильтры</h2>

                {props.filters && props.filters.length ?
                    <BlockingElement fetching={false} className={classes.list}>
                        {props.filters.map((filter: IFilterContent, index: number) => renderFilterItem(filter, index))}
                    </BlockingElement>
                    :
                    <Empty message='Нет доступных фильтров'/>
                }
            </div>

            <div className={cx({'toggle': true, 'show': isShow || props.isShow})}
                 onClick={() => {
                     setIsShow(!isShow)
                     if (props.onChangeShow) {
                         props.onChangeShow(!isShow)
                     }
                 }}
            >
                <FontAwesomeIcon icon='angle-left'/>
            </div>
        </aside>
    )
}

SidebarLeft.defaultProps = defaultProps
SidebarLeft.displayName = 'SidebarLeft'

export default SidebarLeft