import React, {useRef} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Resizer from 'react-image-file-resizer'
import {IImage, IImageDb} from '../../@types/IImage'
import Button from '../Button/Button'
import Preloader from '../Preloader/Preloader'
import Empty from '../Empty/Empty'
import classes from './ImageUploader.module.scss'

interface Props {
    images: IImageDb[]
    newImages: IImage[]
    multi?: boolean
    type?: 'image' | 'document'
    showUploadList?: boolean
    disabled?: boolean
    text?: string
    fetching?: boolean

    onChange(updateImages: IImageDb[], uploadImages: IImage[]): void
}

const defaultProps: Props = {
    images: [],
    newImages: [],
    multi: false,
    type: 'image',
    showUploadList: false,
    disabled: false,
    text: 'Загрузить',
    fetching: false,
    onChange: (updateImages: IImageDb[], uploadImages: IImage[]) => {
        console.info('ImageUploader onChange', updateImages, uploadImages)
    }
}

const ImageUploader: React.FC<Props> = (props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const accept = !props.type || props.type === 'image' ? 'image/jpeg,image/png,image/jpg' : ''

    const resizeFile = (file: File) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                1200,
                1200,
                "JPEG",
                90,
                0,
                (uri) => {
                    resolve(uri)
                },
                "base64"
            )
        })

    // Загрузчик изображений
    const uploadImagesHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const imagesList: IImage[] = []
        const files: FileList | null = e.currentTarget.files

        if (files && files.length) {
            for (const file of Array.from(files)) {
                const image = await resizeFile(file)
                imagesList.push({name: file.name, value: image})
            }
        }

        if (inputRef && inputRef.current) {
            inputRef.current.value = ''
        }

        props.onChange(props.images, [...props.newImages, ...imagesList])
    }

    // Удаление изображения
    const removeImageHandler = (index: number, upload: boolean) => {
        let updateImages = [...props.images]
        let uploadImages = [...props.newImages]

        if (upload) {
            uploadImages.splice(index, 1)
        } else {
            updateImages[index].active = 0
        }

        props.onChange(updateImages, uploadImages)
    }

    const renderUploadList = () => {
        if (!props.showUploadList) {
            return null
        }

        return (
            <div className={classes.list}>
                {props.fetching && <Preloader/>}

                {!props.images.length && !props.newImages.length && <Empty message='Нет загруженных изображений'/>}

                {props.images.length ?
                    props.images.map((image: IImageDb, index: number) => {
                        return (
                            <div key={'selected-' + image.id} className={classes.item}>
                                <img src={'https://api.sochidominvest.ru' + image.value} alt={image.name}/>

                                <div className={classes.remove}
                                     title='Удалить'
                                     onClick={() => removeImageHandler(index, false)}
                                >
                                    <FontAwesomeIcon icon='trash'/>
                                </div>
                            </div>
                        )
                    })
                    : null
                }

                {props.newImages.length ?
                    props.newImages.map((image: IImage, index: number) => {
                        return (
                            <div key={'upload-' + index} className={classes.item}>
                                <img src={image.value} alt={image.name}/>

                                <div className={classes.remove}
                                     title='Удалить'
                                     onClick={() => removeImageHandler(index, true)}
                                >
                                    <FontAwesomeIcon icon='trash'/>
                                </div>
                            </div>
                        )
                    })
                    : null
                }
            </div>
        )
    }

    const renderInput = () => {
        return (
            <div className={classes.field}>
                <input type="file"
                       multiple={props.multi}
                       accept={accept}
                       disabled={props.disabled}
                       onChange={uploadImagesHandler.bind(this)}
                       ref={inputRef}
                />

                <Button type="apply"
                        icon='upload'
                        onClick={() => inputRef.current?.click()}
                        disabled={props.disabled || props.fetching}
                >{props.text}</Button>
            </div>
        )
    }

    return (
        <div className={classes.ImageUploader}>
            {renderUploadList()}
            {renderInput()}
        </div>
    )
}

ImageUploader.defaultProps = defaultProps
ImageUploader.displayName = 'ImageUploader'

export default ImageUploader