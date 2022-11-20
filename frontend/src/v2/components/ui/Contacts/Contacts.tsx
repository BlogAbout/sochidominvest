import React from 'react'
import classNames from 'classnames/bind'
import {configuration} from '../../../../helpers/utilHelper'
import classes from './Contacts.module.scss'

interface Props {
    className?: string
    align?: 'left' | 'center' | 'right'
}

const defaultProps: Props = {
    align: 'left'
}

const cx = classNames.bind(classes)

const Contacts: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx(props.className, {'Contacts': true, [props.align || 'left']: true})}>
            <div className={classes.item}>
                <a href={configuration.sitePhoneUrl} className={classes.phone}>{configuration.sitePhone}</a>
            </div>
            <div className={classes.item}>
                <a href={configuration.siteEmailUrl} className={classes.email}>{configuration.siteEmail}</a>
            </div>
        </div>
    )
}

Contacts.defaultProps = defaultProps
Contacts.displayName = 'Contacts'

export default React.memo(Contacts)