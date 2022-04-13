import React from 'react'
import {Navigation, Scrollbar} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import {LightgalleryItem} from 'react-lightgallery'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import {IAttachment} from '../../@types/IAttachment'
import classes from './ImageCarousel.module.scss'

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
            <SwiperSlide className={classes.video}>
                <video controls preload='metadata'>
                    <source src={`https://api.sochidominvest.ru/uploads/${attachment.content}`}
                            type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                    />
                </video>
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