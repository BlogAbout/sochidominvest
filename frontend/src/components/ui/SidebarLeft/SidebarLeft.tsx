import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IFilterContent} from '../../../@types/IFilter'
import Empty from '../../Empty/Empty'
import ComboBox from '../../ComboBox/ComboBox'
import SelectorBox from '../../SelectorBox/SelectorBox'
import {ISelector} from '../../../@types/ISelector'
import CheckBox from '../../form/CheckBox/CheckBox'
import BlockingElement from '../BlockingElement/BlockingElement'
import classes from './SidebarLeft.module.scss'

const cx = classNames.bind(classes)

interface Props {
    filters: IFilterContent[]
}

const defaultProps: Props = {
    filters: []
}

const SidebarLeft: React.FC<Props> = (props) => {
    const [isShow, setIsShow] = useState(false)

    const renderSelectorItem = (filter: IFilterContent) => {
        if (filter.multi) {
            return (
                <ComboBox selected={filter.selected.length ? filter.selected[0] : null}
                          items={Object.values(filter.items)}
                          onSelect={(value: string) => filter.onSelect([value])}
                          placeHolder='Выберите'
                          styleType='standard'
                />
            )
        } else {
            return (
                <SelectorBox selected={filter.selected}
                             items={Object.values(filter.items)}
                             onSelect={(value: string[]) => filter.onSelect(value)}
                             placeHolder='Выберите'
                             multi
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
                {filter.items.map((item: ISelector, index: number) => {
                    return (
                        <CheckBox key={index}
                                  label={item.text}
                                  type='classic'
                                  checked={filter.selected.includes(item.key)}
                                  onChange={() => filter.onSelect(selectItemHandler(item.key))}
                        />
                    )
                })}
            </div>
        )
    }

    const renderFilterItem = (filter: IFilterContent, index: number) => {
        return (
            <div key={index} className={classes.item}>
                <h3>{filter.title}</h3>

                {filter.type === 'selector' ? renderSelectorItem(filter) : renderCheckerItem(filter)}
            </div>
        )
    }

    return (
        <aside className={cx({'SidebarLeft': true, 'show': isShow})}>
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

            <div className={cx({'toggle': true, 'show': isShow})} onClick={() => setIsShow(!isShow)}>
                <FontAwesomeIcon icon='angle-left'/>
            </div>
        </aside>
    )
}

SidebarLeft.defaultProps = defaultProps
SidebarLeft.displayName = 'SidebarLeft'

export default SidebarLeft