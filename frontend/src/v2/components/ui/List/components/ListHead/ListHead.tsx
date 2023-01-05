import React from 'react'
import classes from './ListHead.module.scss'

interface Props extends React.PropsWithChildren<any> {

}

const defaultProps: Props = {}

const ListHead: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.ListHead}>
            {props.children}
        </div>
    )
}

ListHead.defaultProps = defaultProps
ListHead.displayName = 'ListHead'

export default React.memo(ListHead)