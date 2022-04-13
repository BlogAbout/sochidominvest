import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import classNames from 'classnames/bind'
import ArticleService from '../../api/ArticleService'
import AttachmentService from '../../api/AttachmentService'
import {PopupProps} from '../../@types/IPopup'
import {IArticle} from '../../@types/IArticle'
import {ITab} from '../../@types/ITab'
import {IAttachment} from '../../@types/IAttachment'
import {articleTypes} from '../../helpers/articleHelper'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import TextAreaBox from '../TextAreaBox/TextAreaBox'
import ComboBox from '../ComboBox/ComboBox'
import Tabs from '../Tabs/Tabs'
import BuildingBox from '../BuildingBox/BuildingBox'
import classes from './PopupArticleCreate.module.scss'
import FileList from "../FileList/FileList";

interface Props extends PopupProps {
    article?: IArticle | null

    onSave(): void
}

const defaultProps: Props = {
    article: null,
    onSave: () => {
        console.info('PopupTagCreate onSave')
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
        images: [],
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
        checkAvatar()
    }, [images])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        setFetching(true)

        ArticleService.saveArticle(article)
            .then((response: any) => {
                setFetching(false)
                setArticle(response.data)

                props.onSave()
                close()
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

    const renderContentTab = () => {
        return (
            <div key='content' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Название</div>

                        <TextBox value={article.name}
                                 onChange={(e: React.MouseEvent, value: string) => setArticle({
                                     ...article,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={!article.name || article.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Тип</div>

                        <ComboBox selected={article.type}
                                  items={Object.values(articleTypes)}
                                  onSelect={(value: string) => setArticle({...article, type: value})}
                                  placeHolder='Выберите тип'
                                  styleType='standard'
                        />
                    </div>

                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Описание</div>

                        <TextAreaBox value={article.description}
                                     onChange={(value: string) => setArticle({
                                         ...article,
                                         description: value
                                     })}
                                     placeHolder='Введите текст статьи'
                                     icon='paragraph'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Публичный'
                                  type='modern'
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
                                  checked={!!article.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setArticle({
                                      ...article,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Вкладка галереии
    const renderGalleryTab = () => {
        return (
            <div key='gallery' className={classes.tabContent}>
                <div className={cx({'field': true, 'full': true})}>
                    <div className={classes.field_label}>Фотогалерея</div>

                    <FileList files={images}
                              selected={article.avatarId ? [article.avatarId] : []}
                              fetching={fetchingImages}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                    />
                </div>
            </div>
        )
    }

    const renderRelationTab = () => {
        return (
            <div key='relation' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Объекты недвижимости</div>

                        <BuildingBox buildings={article.buildings}
                                     onSelect={(value: number[]) => setArticle({...article, buildings: value})}
                                     placeHolder='Выберите объекты недвижимости'
                                     multi
                        />
                    </div>
                </div>
            </div>
        )
    }

    const renderSeoTab = () => {
        return (
            <div key='seo' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Meta Title</div>

                        <TextBox value={article.metaTitle}
                                 onChange={(e: React.MouseEvent, value: string) => setArticle({
                                     ...article,
                                     metaTitle: value
                                 })}
                                 placeHolder='Введите Meta Title'
                                 icon='heading'
                        />
                    </div>

                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Meta Description</div>

                        <TextAreaBox value={article.metaDescription || ''}
                                     onChange={(value: string) => setArticle({
                                         ...article,
                                         metaDescription: value
                                     })}
                                     placeHolder='Введите Meta Description'
                                     icon='paragraph'
                        />
                    </div>
                </div>
            </div>
        )
    }

    const tabs: ITab = {
        content: {title: 'Содержимое', render: renderContentTab()},
        gallery: {title: 'Галерея', render: renderGalleryTab()},
        relation: {title: 'Связи', render: renderRelationTab()},
        seo: {title: 'СЕО', render: renderSeoTab()}
    }

    return (
        <Popup className={classes.PopupArticleCreate}>
            <Header title={article.id ? 'Редактировать статью' : 'Добавить статью'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || article.name.trim() === '' || article.description.trim() === ''}
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupArticleCreate.defaultProps = defaultProps
PopupArticleCreate.displayName = 'PopupArticleCreate'

export default function openPopupArticleCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupArticleCreate), popupProps, undefined, block, displayOptions)
}