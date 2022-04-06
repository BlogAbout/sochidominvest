import * as React from 'react'
import classNames from 'classnames'
import classes from './BlockingElement.module.scss'

interface Props {
    fetching: boolean
    className?: string | null
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
        <div className={blockingElementStyle} style={{position: 'relative'}}>
            {props.children}

            {!props.fetching ? null :
                <div className={classes.blockSpinner}>
                    <div className={classes.spinner}>
                        <div className={classes.bounce1}/>
                        <div className={classes.bounce2}/>
                        <div/>
                    </div>
                </div>
            }
        </div>
    )
}

BlockingElement.defaultProps = defaultProps
BlockingElement.displayName = 'BlockingElement'

export default BlockingElement