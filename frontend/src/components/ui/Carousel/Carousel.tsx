import React from 'react'
import {Navigation, Scrollbar} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import classes from './Carousel.module.scss'

interface Props extends React.PropsWithChildren<any> {
    slidesPerView: number
    navigation: boolean
    items: React.ReactElement[]
}

const defaultProps: Props = {
    slidesPerView: 1,
    navigation: false,
    items: []
}

const Carousel: React.FC<Props> = (props) => {
    return (
        <div className={classes.Carousel}>
            <Swiper
                modules={[Navigation, Scrollbar]}
                slidesPerView={props.slidesPerView}
                navigation={props.navigation}
                scrollbar={{draggable: true}}
            >
                {props.items.map((item: React.ReactElement, index: number) => {
                    return (
                        <SwiperSlide key={index} className={classes.item}>
                            {item}
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}

Carousel.defaultProps = defaultProps
Carousel.displayName = 'Carousel'

export default Carousel