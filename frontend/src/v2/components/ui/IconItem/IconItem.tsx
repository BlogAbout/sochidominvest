import React from 'react'
import classNames from 'classnames/bind'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './IconItem.module.scss'

interface Props {
    text: string
    icon?: IconProp
    title?: string
    type?: 'round' | 'circle'
    style?: 'light' | 'dark'
}

const defaultProps: Props = {
    text: '',
    type: 'circle',
    style: 'dark'
}

const cx = classNames.bind(classes)

const IconItem: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'IconItem': true, [props.style || 'dark']: true})}>
            {props.icon ?
                <span className={cx({'icon': true, [props.type || 'round']: true})}
                      title={props.title || props.text}
                >
                    <span>
                        <FontAwesomeIcon icon={props.icon}/>
                    </span>
                </span>
                : null
            }

            <span className={classes.text}>{props.text}</span>
        </div>
    )
}

IconItem.defaultProps = defaultProps
IconItem.displayName = 'IconItem'

export default React.memo(IconItem)