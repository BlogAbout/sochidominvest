import React from 'react'
import classNames from 'classnames/bind'
import {configuration} from '../../../../helpers/utilHelper'
import classes from './Avatar.module.scss'

interface Props extends React.PropsWithChildren<any> {
    href: string | null | undefined
    alt: string
    width?: number | string
    height?: number | string
    isRound?: boolean
    withWrap?: boolean
}

const defaultProps: Props = {
    href: null,
    alt: '',
    width: '100%',
    height: '100%',
    isRound: false,
    withWrap: false
}

const cx = classNames.bind(classes)

const Avatar: React.FC<Props> = (props): React.ReactElement => {
    const renderAvatar = () => {
        return (
            <div className={cx({'Avatar': true, 'noImage': !props.href, 'round': props.isRound})}
                 style={{width: props.width, height: props.height}}
            >
                {props.href ?
                    <img src={`${configuration.siteUrl}uploads/image/thumb/${props.href}`} alt={props.alt}/>
                    : null
                }

                {props.children ? props.children : null}
            </div>
        )
    }

    const renderAvatarWithWrap = () => {
        return (
            <div className={classes.avatarWrapper}>{renderAvatar()}</div>
        )
    }

    return props.withWrap ? renderAvatarWithWrap() : renderAvatar()
}

Avatar.defaultProps = defaultProps
Avatar.displayName = 'Avatar'

export default React.memo(Avatar)