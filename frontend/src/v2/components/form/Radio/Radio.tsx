import React from 'react'
import classNames from 'classnames/bind'
import {IRadio} from '../../../@types/IRadio'
import classes from './Radio.module.scss'

interface Props {
    items: IRadio[]
    current: string | number | null
    type?: 'horizontal' | 'vertical'
    style?: 'light' | 'dark'

    onChange(value: string | number): void
}

const defaultProps: Props = {
    items: [],
    current: null,
    style: 'light',
    onChange: (value: string | number) => {
        console.info('Radio onChange', value)
    }
}

const cx = classNames.bind(classes)

const Radio: React.FC<Props> = (props) => {
    const renderItem = (item: IRadio) => {
        return (
            <div className={cx({'item': true, 'active': item.key === props.current, [props.style || 'light']: true})}
                 title={item.title}
                 onClick={() => props.onChange(item.key)}
                 key={item.key}
            >
                {item.text}
            </div>
        )
    }

    return (
        <div className={cx({'Radio': true, [props.type || 'horizontal']: true})}>
            {props.items.map((item: IRadio) => renderItem(item))}
        </div>
    )
}

Radio.defaultProps = defaultProps
Radio.displayName = 'Radio'

export default Radio