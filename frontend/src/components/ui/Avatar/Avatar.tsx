import React from 'react'
import classNames from 'classnames/bind'
import {configuration} from '../../../helpers/utilHelper'
import classes from './Avatar.module.scss'

interface Props extends React.PropsWithChildren<any> {
    href: string | null | undefined
    alt: string | null | undefined
    width?: number | string
    height?: number | string
    isRound?: boolean
}

const defaultProps: Props = {
    href: null,
    alt: 'Пользователь не найден',
    width: 200,
    height: 'auto',
    isRound: false
}

const cx = classNames.bind(classes)

const Avatar: React.FC<Props> = (props) => {
    return (
        <div className={cx({'Avatar': true, 'noImage': !props.href, 'round': props.isRound})}
             style={{width: props.width, height: props.height}}
        >
            {props.href ?
                <img src={`${configuration.apiUrl}uploads/image/thumb/${props.href}`}
                     alt={props.alt || 'Пользователь не найден'}
                />
                : null
            }

            {props.children ? props.children : null}
        </div>
    )
}

Avatar.defaultProps = defaultProps
Avatar.displayName = 'Avatar'

export default Avatar