import React from 'react'
import classNames from 'classnames/bind'
import classes from './ListRow.module.scss'

interface Props extends React.PropsWithChildren<any> {
    isDisabled?: boolean
    isBlock?: boolean
    className?: string
    style?: React.CSSProperties

    onClick?(): void

    onContextMenu?(e: React.MouseEvent): void
}

const defaultProps: Props = {
    isDisabled: false,
    isBlock: false
}

const cx = classNames.bind(classes)

const ListRow: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'ListRow': true, 'disabled': props.isDisabled, 'block': props.isBlock}, props.className)}
             onClick={props.onClick}
             onContextMenu={props.onContextMenu}
             style={props.style}
        >
            {props.children}
        </div>
    )
}

ListRow.defaultProps = defaultProps
ListRow.displayName = 'ListRow'

export default React.memo(ListRow)