import React from 'react'
import classNames from 'classnames/bind'
import classes from './ListCell.module.scss'

interface Props extends React.PropsWithChildren<any> {
    className?: string
}

const defaultProps: Props = {}

const cx = classNames.bind(classes)

const ListCell: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'ListCell': true}, props.className)}>
            {props.children}
        </div>
    )
}

ListCell.defaultProps = defaultProps
ListCell.displayName = 'ListCell'

export default React.memo(ListCell)