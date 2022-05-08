import React from 'react'
import {IFilterBase} from '../../../@types/IFilter'
import Button from '../../form/Button/Button'
import SearchBox from '../../SearchBox/SearchBox'
import classes from './FilterBase.module.scss'

interface Props {
    buttons: IFilterBase[]
    showSearch: boolean
    valueSearch?: string

    onSearch?(value: string): void
}

const defaultProps: Props = {
    buttons: [],
    showSearch: false,
    valueSearch: ''
}

const FilterBase: React.FC<Props> = (props) => {
    if (!props.buttons || !props.buttons.length) {
        return null
    }

    return (
        <div className={classes.FilterBase}>
            {props.buttons.map((button: IFilterBase) => {
                return (
                    <Button type={button.active ? 'regular' : 'save'}
                            icon={button.icon}
                            onClick={() => button.onClick(button.key)}
                    >{button.title}</Button>
                )
            })}

            {props.showSearch ?
                <div className={classes.search}>
                    <SearchBox value={props.valueSearch}
                               onChange={(value: string) => props.onSearch ? props.onSearch(value) : undefined}
                    />
                </div>
                : null
            }
        </div>
    )
}

FilterBase.defaultProps = defaultProps
FilterBase.displayName = 'FilterBase'

export default FilterBase