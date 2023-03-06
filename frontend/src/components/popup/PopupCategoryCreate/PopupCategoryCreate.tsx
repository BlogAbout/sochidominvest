import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import classNames from 'classnames/bind'
import StoreService from '../../../api/StoreService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {ICategory} from '../../../@types/IStore'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupCategoryCreate.module.scss'

interface Props extends PopupProps {
    category?: ICategory | null

    onSave(): void
}

const defaultProps: Props = {
    category: null,
    onSave: () => {
        console.info('PopupCategoryCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupCategoryCreate: React.FC<Props> = (props) => {
    const [category, setCategory] = useState<ICategory>(props.category || {
        id: null,
        name: '',
        description: '',
        active: 1,
        metaTitle: '',
        metaDescription: '',
        fields: ['test1', 'test2']
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        StoreService.saveCategory(category)
            .then((response: any) => {
                setCategory(response.data)

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
            })
            .finally(() => setFetching(false))
    }

    const renderContentBlock = () => {
        return (
            <div key='content' className={classes.blockContent}>
                <Title type={2}>Информация о категории</Title>

                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={category.name}
                             onChange={(e: React.MouseEvent, value: string) => setCategory({
                                 ...category,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={!category.name || category.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={category.description}
                                 onChange={(value: string) => setCategory({
                                     ...category,
                                     description: value
                                 })}
                                 placeHolder='Введите текст статьи'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!category.active}
                              onChange={(e: React.MouseEvent, value: boolean) => setCategory({
                                  ...category,
                                  active: value ? 1 : 0
                              })}
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

                    <TextBox value={category.metaTitle}
                             onChange={(e: React.MouseEvent, value: string) => setCategory({
                                 ...category,
                                 metaTitle: value
                             })}
                             placeHolder='Введите Meta Title'
                             styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Meta Description'/>

                    <TextAreaBox value={category.metaDescription || ''}
                                 onChange={(value: string) => setCategory({
                                     ...category,
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
        <Popup className={classes.PopupCategoryCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                {renderContentBlock()}
                {renderSeoBlock()}
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || !category.name || category.name.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || !category.name || category.name.trim() === ''}
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

PopupCategoryCreate.defaultProps = defaultProps
PopupCategoryCreate.displayName = 'PopupCategoryCreate'

export default function openPopupCategoryCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupCategoryCreate), popupProps, undefined, block, displayOptions)
}