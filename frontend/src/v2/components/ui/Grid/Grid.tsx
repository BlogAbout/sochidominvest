import React from 'react'
import classNames from 'classnames/bind'
import classes from './Grid.module.scss'

interface Props extends React.PropsWithChildren<any> {
    isWrap?: boolean
    isVerticalCenter?: boolean
    isHorizontalCenter?: boolean
    className?: string
}

const defaultProps: Props = {
    isWrap: false
}

const cx = classNames.bind(classes)

const Grid: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx(props.className, {
            'Grid': true,
            'wrap': props.isWrap,
            'vTop': props.isVerticalCenter,
            'hTop': props.isHorizontalCenter
        })}>
            {props.children}
        </div>
    )
}

Grid.defaultProps = defaultProps
Grid.displayName = 'Grid'

export default React.memo(Grid)