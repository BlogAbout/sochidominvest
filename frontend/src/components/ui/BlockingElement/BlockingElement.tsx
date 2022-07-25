import React from 'react'
import classNames from 'classnames'
import Preloader from '../../Preloader/Preloader'
import classes from './BlockingElement.module.scss'

interface Props {
    fetching: boolean
    className?: string | null
    innerRef?: React.MutableRefObject<any> | null
}

const defaultProps: Props = {
    fetching: false,
    className: null
}

const cx = classNames.bind(classes)

const BlockingElement: React.FC<Props> = (props) => {
    const blockingElementStyle = cx({
        [classes.BlockingElement]: true,
        [`${props.className}`]: props.className !== undefined,
        [classes.fetching]: props.fetching
    })

    return (
        <div className={blockingElementStyle} style={{position: 'relative'}} ref={props.innerRef}>
            {props.children}

            {props.fetching && <Preloader/>}
        </div>
    )
}

BlockingElement.defaultProps = defaultProps
BlockingElement.displayName = 'BlockingElement'

export default BlockingElement