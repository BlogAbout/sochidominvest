import React from 'react'
import {Navigation, Scrollbar} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import {LightgalleryItem} from 'react-lightgallery'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import {IAttachment} from '../../@types/IAttachment'
import classes from './ImageCarousel.module.scss'
import VideoPlayer from "../VideoPlayer/VideoPlayer";

interface Props {
    images?: IAttachment[]
    videos?: IAttachment[]
    alt: string
    fancy?: boolean
    group?: string
}

const defaultProps: Props = {
    images: [],
    videos: [],
    alt: '',
    fancy: false
}

const ImageCarousel: React.FC<Props> = (props) => {
    if ((!props.images || !props.images.length) && (!props.videos || !props.videos.length)) {
        return null
    }

    const renderSlide = (attachment: IAttachment) => {
        return (
            <SwiperSlide key={attachment.id} className={classes.image}>
                <img src={`https://api.sochidominvest.ru/uploads/thumbs/2000/${attachment.content}`}
                     alt={attachment.name || props.alt}
                />
            </SwiperSlide>
        )
    }

    const renderFancySlide = (attachment: IAttachment) => {
        return (
            <SwiperSlide key={attachment.id} className={classes.image}>
                <LightgalleryItem src={`https://api.sochidominvest.ru/uploads/thumbs/2000/${attachment.content}`}
                                  className={classes.image}
                                  group={props.group || 'any'}
                >
                    <img src={`https://api.sochidominvest.ru/uploads/thumbs/2000/${attachment.content}`}
                         alt={attachment.name || props.alt}
                    />
                </LightgalleryItem>
            </SwiperSlide>
        )
    }

    const renderSlideVideo = (attachment: IAttachment) => {
        return (
            <SwiperSlide key={attachment.id} className={classes.video}>
                <VideoPlayer video={`https://api.sochidominvest.ru/uploads/${attachment.content}`}/>
            </SwiperSlide>
        )
    }

    return (
        <div className={classes.ImageCarousel}>
            <Swiper
                modules={[Navigation, Scrollbar]}
                slidesPerView={1}
                navigation
                scrollbar={{draggable: true}}
            >
                {props.videos ?
                    props.videos.map((attachment: IAttachment) => renderSlideVideo(attachment))
                    : null
                }

                {props.images ?
                    props.images.map((attachment: IAttachment) => props.fancy ? renderFancySlide(attachment) : renderSlide(attachment))
                    : null
                }
            </Swiper>
        </div>
    )
}

ImageCarousel.defaultProps = defaultProps
ImageCarousel.displayName = 'ImageCarousel'

export default ImageCarousel