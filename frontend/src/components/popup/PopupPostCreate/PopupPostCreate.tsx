import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import classNames from 'classnames/bind'
import {postTypes} from '../../../helpers/postHelper'
import PostService from '../../../api/PostService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IPost} from '../../../@types/IPost'
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
import ComboBox from '../../ComboBox/ComboBox'
import PostBox from '../../form/PostBox/PostBox'
import classes from './PopupPostCreate.module.scss'

interface Props extends PopupProps {
    post?: IPost | null

    onSave(): void
}

const defaultProps: Props = {
    post: null,
    onSave: () => {
        console.info('PopupPostCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupPostCreate: React.FC<Props> = (props) => {
    const [post, setPost] = useState<IPost>(props.post || {
        id: null,
        postId: null,
        name: '',
        description: '',
        author: null,
        type: 'common',
        active: 1
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

        PostService.savePost(post)
            .then((response: any) => {
                setFetching(false)
                setPost(response.data)

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

    return (
        <Popup className={classes.PopupPostCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type={2}>Информация о должности</Title>

                    <div className={classes.field}>
                        <Label text='Наименование'/>

                        <TextBox value={post.name}
                                 onChange={(e: React.MouseEvent, value: string) => setPost({
                                     ...post,
                                     name: value
                                 })}
                                 placeHolder='Введите наименование'
                                 error={!post.name || post.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Родительская должность'/>

                        <PostBox posts={post.postId ? [post.postId] : []}
                                 excludePosts={post.id ? [post.id] : []}
                                 onSelect={(value: number[]) => setPost({...post, postId: value[0]})}
                                 placeHolder='Выберите родительскую должность'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Тип'/>

                        <ComboBox selected={post.type}
                                  items={Object.values(postTypes)}
                                  onSelect={(value: string) => setPost({...post, type: value})}
                                  placeHolder='Выберите тип'
                                  styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Комментарий'/>

                        <TextAreaBox value={post.description || ''}
                                     onChange={(value: string) => setPost({
                                         ...post,
                                         description: value
                                     })}
                                     placeHolder='Введите комментарий'
                                     width='100%'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!post.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setPost({
                                      ...post,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || post.name.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || post.name.trim() === ''}
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

PopupPostCreate.defaultProps = defaultProps
PopupPostCreate.displayName = 'PopupPostCreate'

export default function openPopupPostCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupPostCreate), popupProps, undefined, block, displayOptions)
}