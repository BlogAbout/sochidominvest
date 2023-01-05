import React from 'react'
import classNames from 'classnames/bind'
import classes from './Wrapper.module.scss'

interface Props extends React.PropsWithChildren<any> {
    isFull?: boolean
}

const defaultProps: Props = {
    isFull: false
}

const cx = classNames.bind(classes)

const Wrapper = (props: Props): React.ReactElement => {
    return (
        <div className={cx({'Wrapper': true, 'full': props.isFull})}>
            {props.children}
        </div>
    )
}

Wrapper.defaultProps = defaultProps
Wrapper.displayName = 'Wrapper'

export default React.memo(Wrapper)