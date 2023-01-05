import React from 'react'
import classNames from 'classnames/bind'
import classes from './ListRow.module.scss'

interface Props extends React.PropsWithChildren<any> {
    className?: string

    onClick?(): void

    onContextMenu?(e: React.MouseEvent): void
}

const defaultProps: Props = {}

const cx = classNames.bind(classes)

const ListRow: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'ListRow': true}, props.className)}
             onClick={props.onClick}
             onContextMenu={props.onContextMenu}
        >
            {props.children}
        </div>
    )
}

ListRow.defaultProps = defaultProps
ListRow.displayName = 'ListRow'

export default React.memo(ListRow)