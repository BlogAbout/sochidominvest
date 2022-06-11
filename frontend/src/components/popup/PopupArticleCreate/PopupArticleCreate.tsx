import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import classNames from 'classnames/bind'
import ArticleService from '../../../api/ArticleService'
import AttachmentService from '../../../api/AttachmentService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IArticle} from '../../../@types/IArticle'
import {IAttachment} from '../../../@types/IAttachment'
import {articleTypes} from '../../../helpers/articleHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import ComboBox from '../../ComboBox/ComboBox'
import BuildingBox from '../../form/BuildingBox/BuildingBox'
import FileList from '../../FileList/FileList'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import openPopupFileManager from '../../PopupFileManager/PopupFileManager'
import {sortAttachments} from '../../../helpers/attachmentHelper'
import classes from './PopupArticleCreate.module.scss'

interface Props extends PopupProps {
    article?: IArticle | null

    onSave(): void
}

const defaultProps: Props = {
    article: null,
    onSave: () => {
        console.info('PopupArticleCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupArticleCreate: React.FC<Props> = (props) => {
    const [article, setArticle] = useState<IArticle>(props.article || {
        id: null,
        name: '',
        description: '',
        author: null,
        type: 'article',
        active: 1,
        publish: 0,
        buildings: [],
        images: []
    })

    const [fetching, setFetching] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [images, setImages] = useState<IAttachment[]>([])

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (article.id) {
            if (article.images && article.images.length) {
                setFetchingImages(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: article.images, type: 'image'})
                    .then((response: any) => {
                        setImages(response.data)
                    })
                    .finally(() => setFetchingImages(false))
            }
        }
    }, [article])

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
        setFetching(true)

        ArticleService.saveArticle(article)
            .then((response: any) => {
                setFetching(false)
                setArticle(response.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
    }

    // Добавление файла
    const addAttachmentHandler = (attachment: IAttachment) => {
        switch (attachment.type) {
            case 'image':
                setArticle({
                    ...article,
                    images: [attachment.id, ...article.images]
                })
                setImages([attachment, ...images])
                break
        }
    }

    // Смена главного изображения
    const selectImageAvatarHandler = (attachment: IAttachment) => {
        setArticle({...article, avatarId: attachment.id, avatar: attachment.content})
    }

    // Проверка наличия главного изображения
    const checkAvatar = () => {
        if (article.images && article.images.length && images && images.length) {
            if (!article.avatarId || !article.images.includes(article.avatarId)) {
                selectImageAvatarHandler(images[0])
            }
        } else {
            setArticle({...article, avatarId: null, avatar: null})
        }
    }

    const onUpdateOrderingImagesHandler = (files: IAttachment[]) => {
        const ids: number[] = files.map((attachment: IAttachment) => attachment.id)
        setImages(sortAttachments(files, ids))
        setArticle({...article, images: ids})
    }

    const removeSelectedImageHandler = (file: IAttachment) => {
        setArticle({...article, images: article.images.filter((id: number) => id !== file.id)})
        setImages([...images.filter((attachment: IAttachment) => attachment.id !== file.id)])
    }

    const renderContentBlock = () => {
        return (
            <div key='content' className={classes.blockContent}>
                <Title type={2}>Информация о статье</Title>

                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={article.name}
                             onChange={(e: React.MouseEvent, value: string) => setArticle({
                                 ...article,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={!article.name || article.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Тип'/>

                    <ComboBox selected={article.type}
                              items={Object.values(articleTypes)}
                              onSelect={(value: string) => setArticle({...article, type: value})}
                              placeHolder='Выберите тип'
                              styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={article.description}
                                 onChange={(value: string) => setArticle({
                                     ...article,
                                     description: value
                                 })}
                                 placeHolder='Введите текст статьи'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Публичный'
                              type='modern'
                              width={110}
                              checked={!!article.publish}
                              onChange={(e: React.MouseEvent, value: boolean) => setArticle({
                                  ...article,
                                  publish: value ? 1 : 0
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!article.active}
                              onChange={(e: React.MouseEvent, value: boolean) => setArticle({
                                  ...article,
                                  active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    // Вкладка галереии
    const renderGalleryBlock = () => {
        return (
            <div key='gallery' className={classes.blockContent}>
                <Title type={2}>Медиа</Title>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Фотогалерея'/>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'image',
                                selected: article.images,
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setArticle({...article, images: selected})
                                    setImages(attachments)
                                },
                                multi: true
                            })}
                            disabled={fetching}
                    >Выбрать / Загрузить</Button>

                    <FileList files={images}
                              selected={article.avatarId ? [article.avatarId] : []}
                              fetching={fetchingImages}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                              onRemove={removeSelectedImageHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingImagesHandler.bind(this)}
                              isOnlyList
                    />
                </div>
            </div>
        )
    }

    const renderRelationBlock = () => {
        return (
            <div key='relation' className={classes.blockContent}>
                <Title type={2}>Связи</Title>

                <div className={classes.field}>
                    <Label text='Недвижимость'/>

                    <BuildingBox buildings={article.buildings}
                                 onSelect={(value: number[]) => setArticle({...article, buildings: value})}
                                 placeHolder='Выберите объекты недвижимости'
                                 styleType='minimal'
                                 multi
                    />
                </div>
            </div>
        )
    }

    const renderSeoBlock = () => {
        return (
            <div key='seo' className={classes.blockContent}>
                <Title type={2}>СЕО</Title>

                <div className={classes.field}>
                    <Label text='Meta Title'/>

                    <TextBox value={article.metaTitle}
                             onChange={(e: React.MouseEvent, value: string) => setArticle({
                                 ...article,
                                 metaTitle: value
                             })}
                             placeHolder='Введите Meta Title'
                             styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Meta Description'/>

                    <TextAreaBox value={article.metaDescription || ''}
                                 onChange={(value: string) => setArticle({
                                     ...article,
                                     metaDescription: value
                                 })}
                                 placeHolder='Введите Meta Description'
                                 width='100%'
                    />
                </div>
            </div>
        )
    }

    return (
        <Popup className={classes.PopupArticleCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                {renderContentBlock()}
                {renderGalleryBlock()}
                {renderRelationBlock()}
                {renderSeoBlock()}
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || article.name.trim() === '' || article.description.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || article.name.trim() === '' || article.description.trim() === ''}
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

PopupArticleCreate.defaultProps = defaultProps
PopupArticleCreate.displayName = 'PopupArticleCreate'

export default function openPopupArticleCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupArticleCreate), popupProps, undefined, block, displayOptions)
}