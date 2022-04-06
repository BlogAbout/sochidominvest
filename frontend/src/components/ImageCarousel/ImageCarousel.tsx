import React from 'react'
import {Navigation, Scrollbar} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import {LightgalleryItem} from 'react-lightgallery'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import {IImageCarousel} from '../../@types/IImageCarousel'
import classes from './ImageCarousel.module.scss'

interface Props {
    images: IImageCarousel[]
    video?: string
    alt: string
    fancy?: boolean
    group?: string
}

const defaultProps: Props = {
    images: [],
    alt: 'Картинка',
    fancy: false
}

const ImageCarousel: React.FC<Props> = (props) => {
    if (!props.images.length) {
        return null
    }

    const renderSlide = (image: IImageCarousel) => {
        return (
            <img src={image.image} alt={image.alt || props.alt}/>
        )
    }

    const renderFancySlide = (image: IImageCarousel) => {
        return (
            <LightgalleryItem src={image.image} className={classes.image} group={props.group || 'any'}>
                <img src={image.image} alt={image.alt || props.alt}/>
            </LightgalleryItem>
        )
    }

    const renderSlideVideo = () => {
        return (
            <SwiperSlide className={classes.video}>
                <video controls preload='metadata'>
                    <source src={`https://api.sochidominvest.ru/uploads/${props.video}`} type='video/webm; codecs="vp8, vorbis"'/>
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
                {props.video && renderSlideVideo()}

                {props.images.map((image: IImageCarousel, index: number) => {
                    return (
                        <SwiperSlide key={index} className={classes.image}>
                            {props.fancy ? renderFancySlide(image) : renderSlide(image)}
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}

ImageCarousel.defaultProps = defaultProps
ImageCarousel.displayName = 'ImageCarousel'

export default ImageCarousel