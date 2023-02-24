import React from 'react'
import classNames from 'classnames/bind'
import {IAttachment} from '../../../@types/IAttachment'
import ImageCarousel from '../ImageCarousel/ImageCarousel'
import Preloader from '../Preloader/Preloader'
import classes from './Gallery.module.scss'

interface Props {
    images?: IAttachment[]
    videos?: IAttachment[]
    avatar?: number | null
    alt: string
    fetching: boolean
    type?: 'carousel'
    className?: string
}

const defaultProps: Props = {
    images: [],
    videos: [],
    avatar: null,
    alt: '',
    fetching: false,
    type: 'carousel'
}

const cx = classNames.bind(classes)

const Gallery: React.FC<Props> = (props) => {
    return (
        <div className={cx(props.className, {'Gallery': true})}>
            {props.fetching && <Preloader/>}

            <div className={classes.carousel}>
                {(props.images && props.images.length) || (props.videos && props.videos.length) ?
                    <ImageCarousel images={props.images}
                                   videos={props.videos}
                                   alt={props.alt}
                                   avatar={props.avatar}
                                   fancy
                    />
                    : <img src='https://api.sochidominvest.ru/uploads/no-image.jpg' alt={props.alt}/>
                }
            </div>
        </div>
    )
}

Gallery.defaultProps = defaultProps
Gallery.displayName = 'Gallery'

export default Gallery