import React from 'react'
import classes from './GridColumn.module.scss'

interface Props extends React.PropsWithChildren<any> {
    width?: number | string
}

const defaultProps: Props = {
    width: '100%'
}

const GridColumn: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={classes.GridColumn}
             style={{width: props.width, flexGrow: props.width !== undefined && props.width !== '100%' ? 0 : 1}}
        >
            {props.children}
        </div>
    )
}

GridColumn.defaultProps = defaultProps
GridColumn.displayName = 'GridColumn'

export default React.memo(GridColumn)