import React from 'react'
import BlockingElement from '../../../../../../components/ui/BlockingElement/BlockingElement'
import classes from './ListBody.module.scss'

interface Props extends React.PropsWithChildren<any> {
    fetching: boolean
}

const defaultProps: Props = {
    fetching: false
}

const ListBody: React.FC<Props> = (props): React.ReactElement => {
    return (
        <BlockingElement fetching={props.fetching} className={classes.ListBody}>
            {props.children}
        </BlockingElement>
    )
}

ListBody.defaultProps = defaultProps
ListBody.displayName = 'ListBody'

export default React.memo(ListBody)