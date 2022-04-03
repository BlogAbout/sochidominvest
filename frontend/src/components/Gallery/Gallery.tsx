import React, {useEffect, useState} from 'react'
import {IImageDb} from '../../@types/IImage'
import {IImageCarousel} from '../../@types/IImageCarousel'
import BlockingElement from '../BlockingElement/BlockingElement'
import ImageCarousel from '../ImageCarousel/ImageCarousel'
import classes from './Gallery.module.scss'

interface Props {
    images: IImageDb[]
    alt: string
    fetching: boolean
    type?: 'carousel'
}

const defaultProps: Props = {
    images: [],
    alt: '',
    fetching: false,
    type: 'carousel'
}

const Gallery: React.FC<Props> = (props) => {
    const [listImages, setListImages] = useState<IImageCarousel[]>([])

    useEffect(() => {
        if (props.images && props.images.length) {
            setListImages(
                props.images.filter((image: IImageDb) => image.active).map((image: IImageDb) => {
                    return {
                        image: 'https://api.sochidominvest.ru' + image.value,
                        alt: props.alt
                    }
                })
            )
        }
    }, [props.images])

    return (
        <BlockingElement fetching={props.fetching} className={classes.Gallery}>
            <div className={classes.carousel}>
                {listImages.length ?
                    <ImageCarousel images={listImages} alt={props.alt} fancy/>
                    : <img src='https://api.sochidominvest.ru/uploads/no-image.jpg' alt={props.alt}/>
                }
            </div>
        </BlockingElement>
    )
}

Gallery.defaultProps = defaultProps
Gallery.displayName = 'Gallery'

export default Gallery