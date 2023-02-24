import React from 'react'
import {Navigation, Scrollbar} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import {LightgalleryItem} from 'react-lightgallery'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import {IAttachment} from '../../../@types/IAttachment'
import MediaPlayer from '../MediaPlayer/MediaPlayer'
import classes from './ImageCarousel.module.scss'

interface Props {
    images?: IAttachment[]
    videos?: IAttachment[]
    avatar?: number | null
    alt: string
    fancy?: boolean
    group?: string
}

const defaultProps: Props = {
    images: [],
    videos: [],
    avatar: null,
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
                <img src={`https://api.sochidominvest.ru/uploads/image/full/${attachment.content}`}
                     alt={attachment.name || props.alt}
                />
            </SwiperSlide>
        )
    }

    const renderFancySlide = (attachment: IAttachment) => {
        return (
            <SwiperSlide key={attachment.id} className={classes.image}>
                <LightgalleryItem src={`https://api.sochidominvest.ru/uploads/image/full/${attachment.content}`}
                                  className={classes.image}
                                  group={props.group || 'any'}
                >
                    <img src={`https://api.sochidominvest.ru/uploads/image/full/${attachment.content}`}
                         alt={attachment.name || props.alt}
                    />
                </LightgalleryItem>
            </SwiperSlide>
        )
    }

    const renderSlideVideo = (attachment: IAttachment) => {
        return (
            <SwiperSlide key={attachment.id} className={classes.video}>
                <MediaPlayer source={`https://api.sochidominvest.ru/uploads/${attachment.type}/${attachment.content}`}
                             poster={attachment.posterUrl}
                />
            </SwiperSlide>
        )
    }

    const avatarAttachment = props.avatar && props.images ? props.images.find((attachment: IAttachment) => attachment.id === props.avatar) : null

    return (
        <div className={classes.ImageCarousel}>
            <Swiper
                modules={[Navigation, Scrollbar]}
                slidesPerView={1}
                navigation
                scrollbar={{draggable: true}}
            >
                {avatarAttachment ?
                    props.fancy ? renderFancySlide(avatarAttachment) : renderSlide(avatarAttachment)
                    : null
                }

                {props.videos ?
                    props.videos.map((attachment: IAttachment) => renderSlideVideo(attachment))
                    : null
                }

                {props.images ?
                    props.images.map((attachment: IAttachment) => {
                        if (props.avatar && attachment.id === props.avatar) {
                            return null
                        } else {
                            return props.fancy ? renderFancySlide(attachment) : renderSlide(attachment)
                        }
                    })
                    : null
                }
            </Swiper>
        </div>
    )
}

ImageCarousel.defaultProps = defaultProps
ImageCarousel.displayName = 'ImageCarousel'

export default ImageCarousel