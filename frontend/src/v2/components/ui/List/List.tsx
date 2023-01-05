import React from 'react'
import classNames from 'classnames/bind'
import classes from './List.module.scss'

interface Props extends React.PropsWithChildren<any> {
    className?: string
}

const cx = classNames.bind(classes)

const List: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'List': true}, props.className)}>
            {props.children}
        </div>
    )
}

List.displayName = 'List'

export default React.memo(List)