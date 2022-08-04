import React from 'react'
import classNames from 'classnames/bind'
import classes from './Indicator.module.scss'

interface Props {
    color: 'green' | 'red' | 'blue'
    text: string
}

const defaultProps: Props = {
    color: 'blue',
    text: '',
}

const cx = classNames.bind(classes)

const Indicator: React.FC<Props> = (props) => {
    return (
        <div className={cx({'Indicator': true, [props.color]: true})}
             title={props.text}
        />
    )
}

Indicator.defaultProps = defaultProps
Indicator.displayName = 'Indicator'

export default Indicator