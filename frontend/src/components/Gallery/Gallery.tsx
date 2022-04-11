import React from 'react'
import {IAttachment} from '../../@types/IAttachment'
import ImageCarousel from '../ImageCarousel/ImageCarousel'
import Preloader from '../Preloader/Preloader'
import classes from './Gallery.module.scss'

interface Props {
    images?: IAttachment[]
    videos?: IAttachment[]
    alt: string
    fetching: boolean
    type?: 'carousel'
}

const defaultProps: Props = {
    images: [],
    videos: [],
    alt: '',
    fetching: false,
    type: 'carousel'
}

const Gallery: React.FC<Props> = (props) => {
    return (
        <div className={classes.Gallery}>
            {props.fetching && <Preloader/>}

            <div className={classes.carousel}>
                {(props.images && props.images.length) || (props.videos && props.videos.length) ?
                    <ImageCarousel images={props.images} videos={props.videos} alt={props.alt} fancy/>
                    : <img src='https://api.sochidominvest.ru/uploads/no-image.jpg' alt={props.alt}/>
                }
            </div>
        </div>
    )
}

Gallery.defaultProps = defaultProps
Gallery.displayName = 'Gallery'

export default Gallery