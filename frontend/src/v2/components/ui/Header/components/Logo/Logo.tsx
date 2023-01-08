import React from 'react'
import {Link} from 'react-router-dom'
import classNames from 'classnames/bind'
import {RouteNames} from '../../../../../helpers/routerHelper'
import classes from './Logo.module.scss'

interface Props {
    type: 'short' | 'full'
    url?: RouteNames
}

const defaultProps: Props = {
    type: 'short',
    url: RouteNames.MAIN
}

const cx = classNames.bind(classes)

const Logo: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'Logo': true, [props.type]: true})}>
            <Link to={props.url || RouteNames.MAIN}>
                <span className={classes.image}/>
            </Link>
        </div>
    )
}

Logo.defaultProps = defaultProps
Logo.displayName = 'Logo'

export default React.memo(Logo)