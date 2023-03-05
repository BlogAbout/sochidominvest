import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import classNames from 'classnames/bind'
import StoreService from '../../../api/StoreService'
import AttachmentService from '../../../api/AttachmentService'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IProduct} from '../../../@types/IStore'
import {ITab} from '../../../@types/ITab'
import {IAttachment} from '../../../@types/IAttachment'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import NumberBox from '../../NumberBox/NumberBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Tabs from '../../ui/Tabs/Tabs'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import FileList from '../../FileList/FileList'
import CategoryBox from '../../form/CategoryBox/CategoryBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import classes from './PopupProductCreate.module.scss'

interface Props extends PopupProps {
    product?: IProduct | null

    onSave(): void
}

const defaultProps: Props = {
    product: null,
    onSave: () => {
        console.info('PopupProductCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupProductCreate: React.FC<Props> = (props) => {
    const [product, setProduct] = useState<IProduct>(props.product ? JSON.parse(JSON.stringify(props.product)) : {
        id: null,
        categoryId: 0,
        name: '',
        cost: 0,
        active: 1,
        author: 0,
        images: [],
        videos: [],
        fields: {}
    })

    const [fetchingProduct, setFetchingProduct] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [fetchingVideos, setFetchingVideos] = useState(false)
    const [images, setImages] = useState<IAttachment[]>([])
    const [videos, setVideos] = useState<IAttachment[]>([])

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (product.id) {
            if (product.images && product.images.length) {
                setFetchingImages(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: product.images, type: 'image'})
                    .then((response: any) => {
                        setImages(sortAttachments(response.data, product.images))
                    })
                    .finally(() => setFetchingImages(false))
            }

            if (product.videos && product.videos.length) {
                setFetchingVideos(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: product.videos, type: 'video'})
                    .then((response: any) => {
                        setVideos(sortAttachments(response.data, product.videos))
                    })
                    .finally(() => setFetchingVideos(false))
            }
        }
    }, [product.id])

    useEffect(() => {
        if (images && images.length) {
            checkAvatar()
        }
    }, [images])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        if (product.name.trim() === '' || !product.categoryId) {
            return
        }

        setFetchingProduct(true)

        StoreService.saveProduct(product)
            .then((response: any) => {
                setProduct(response.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                console.error('error', error)
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => {
                setFetchingProduct(false)
            })
    }

    // Добавление файла
    const addAttachmentHandler = (attachment: IAttachment) => {
        switch (attachment.type) {
            case 'image':
                setProduct({
                    ...product,
                    images: [attachment.id, ...product.images]
                })
                setImages([attachment, ...images])
                break
            case 'video':
                setProduct({
                    ...product,
                    videos: [attachment.id, ...product.videos]
                })
                setVideos([attachment, ...images])
                break
        }
    }

    // Смена главного изображения
    const selectImageAvatarHandler = (attachment: IAttachment) => {
        setProduct({...product, avatarId: attachment.id, avatar: attachment.content})
    }

    // Проверка наличия главного изображения
    const checkAvatar = () => {
        if (product.images && product.images.length && images && images.length) {
            if (!product.avatarId || !product.images.includes(product.avatarId)) {
                selectImageAvatarHandler(images[0])
            }
        } else {
            setProduct({...product, avatarId: null, avatar: null})
        }
    }

    const isDisableButton = () => {
        return fetchingProduct || fetchingImages || fetchingVideos || product.name.trim() === '' || !product.categoryId
    }

    const onUpdateOrderingImagesHandler = (files: IAttachment[]) => {
        const ids: number[] = files.map((attachment: IAttachment) => attachment.id)
        setImages(sortAttachments(files, ids))
        setProduct({...product, images: ids})
    }

    const onUpdateOrderingVideosHandler = (files: IAttachment[]) => {
        const ids: number[] = files.map((attachment: IAttachment) => attachment.id)
        setVideos(sortAttachments(files, ids))
        setProduct({...product, videos: ids})
    }

    const removeSelectedImageHandler = (file: IAttachment) => {
        setProduct({...product, images: product.images.filter((id: number) => id !== file.id)})
        setImages([...images.filter((attachment: IAttachment) => attachment.id !== file.id)])
    }

    const removeSelectedVideoHandler = (file: IAttachment) => {
        setProduct({...product, videos: product.images.filter((id: number) => id !== file.id)})
        setVideos([...videos.filter((attachment: IAttachment) => attachment.id !== file.id)])
    }

    // Вкладка состояния
    const renderStateTab = () => {
        return (
            <div key='state' className={classes.tabContent}>
                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={product.name}
                             onChange={(e: React.MouseEvent, value: string) => setProduct({
                                 ...product,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={product.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Категория'/>

                    <CategoryBox categories={product.categoryId ? [product.categoryId] : []}
                                 onSelect={(value: number[], e: React.MouseEvent) => setProduct({
                                     ...product,
                                     categoryId: value.length ? value[0] : 0
                                 })}
                                 placeHolder='Выберите категорию'
                                 error={!product.categoryId}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={product.description}
                                 onChange={(value: string) => setProduct({
                                     ...product,
                                     description: value
                                 })}
                                 placeHolder='Введите описание товара'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Цена, руб.'/>

                    <NumberBox value={product.cost || ''}
                               min={0}
                               step={0.01}
                               max={999999999}
                               countAfterComma={2}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setProduct({
                                   ...product,
                                   cost: value
                               })}
                               placeHolder='Введите стоимость товара'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Старая цена, руб.'/>

                    <NumberBox value={product.costOld || ''}
                               min={0}
                               step={0.01}
                               max={999999999}
                               countAfterComma={2}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setProduct({
                                   ...product,
                                   costOld: value
                               })}
                               placeHolder='Введите старую стоимость товара'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!product.active}
                              onChange={(e: React.MouseEvent, value: boolean) => setProduct({
                                  ...product,
                                  active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    // Вкладка информации объекта
    const renderInformationTab = () => {
        return (
            <div key='info' className={classes.tabContent}>

            </div>
        )
    }

    // Вкладка галереии объекта
    const renderMediaTab = () => {
        return (
            <div key='media' className={classes.tabContent}>
                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Фотогалерея'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'image',
                                selected: product.images,
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setProduct({...product, images: selected})
                                    setImages(attachments)
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={images}
                              selected={product.avatarId ? [product.avatarId] : []}
                              fetching={fetchingImages}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedImageHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingImagesHandler.bind(this)}
                              isOnlyList={true}
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Видео'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'video',
                                selected: product.videos,
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setProduct({...product, videos: selected})
                                    setVideos(attachments)
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={videos}
                              fetching={fetchingVideos}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedVideoHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingVideosHandler.bind(this)}
                              isOnlyList={true}
                    />
                </div>
            </div>
        )
    }

    const renderSeoTab = () => {
        return (
            <div key='seo' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={classes.field}>
                        <Label text='Meta Title'/>

                        <TextBox value={product.metaTitle}
                                 onChange={(e: React.MouseEvent, value: string) => setProduct({
                                     ...product,
                                     metaTitle: value
                                 })}
                                 placeHolder='Введите Meta Title'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Meta Description'/>

                        <TextAreaBox value={product.metaDescription || ''}
                                     onChange={(value: string) => setProduct({
                                         ...product,
                                         metaDescription: value
                                     })}
                                     placeHolder='Введите Meta Description'
                                     width='100%'
                        />
                    </div>
                </div>
            </div>
        )
    }

    const tabs: ITab = {
        state: {title: 'Состояние', render: renderStateTab()},
        info: {title: 'Информация', render: renderInformationTab()},
        media: {title: 'Медиа', render: renderMediaTab()},
        seo: {title: 'СЕО', render: renderSeoTab()}
    }

    return (
        <Popup className={classes.PopupProductCreate}>
            <BlockingElement fetching={fetchingProduct} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>{product.id ? 'Редактировать товар' : 'Новый товар'}</Title>

                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={isDisableButton()}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={isDisableButton()}
                        className='marginLeft'
                        title='Сохранить'
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupProductCreate.defaultProps = defaultProps
PopupProductCreate.displayName = 'PopupProductCreate'

export default function openPopupProductCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupProductCreate), popupProps, undefined, block, displayOptions)
}