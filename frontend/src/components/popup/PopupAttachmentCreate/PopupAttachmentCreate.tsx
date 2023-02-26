import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IAttachment} from '../../../@types/IAttachment'
import AttachmentService from '../../../api/AttachmentService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupAttachmentCreate.module.scss'

interface Props extends PopupProps {
    attachment: IAttachment

    onSave(attachment: IAttachment): void
}

const defaultProps: Props = {
    attachment: {} as IAttachment,
    onSave: (attachment: IAttachment) => {
        console.info('PopupAttachmentCreate onSave', attachment)
    }
}

const cx = classNames.bind(classes)

const PopupAttachmentCreate: React.FC<Props> = (props) => {
    const [attachment, setAttachment] = useState<IAttachment>(props.attachment)
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

        AttachmentService.updateAttachment(attachment)
            .then((response: any) => {
                setFetching(false)
                setAttachment(response.data)

                props.onSave(response.data)

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
        <Popup className={classes.PopupAttachmentCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о вложении</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={attachment.name || ''}
                                 onChange={(e: React.MouseEvent, value: string) => setAttachment({
                                     ...attachment,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Описание'/>

                        <TextAreaBox value={attachment.description || ''}
                                     onChange={(value: string) => setAttachment({
                                         ...attachment,
                                         description: value
                                     })}
                                     placeHolder='Введите описание'
                                     width='100%'
                        />
                    </div>

                    {attachment.type === 'video' ?
                        <div className={classes.field}>
                            <Label text='Постер'/>

                            <Button type='save'
                                    icon='arrow-pointer'
                                    onClick={() => openPopupFileManager(document.body, {
                                        type: 'image',
                                        selected: attachment.poster ? [attachment.poster] : [],
                                        onSelect: (selected: number[]) => {
                                            setAttachment({
                                                ...attachment,
                                                poster: selected.length ? selected[0] : null
                                            })
                                        }
                                    })}
                                    disabled={fetching}
                            >{attachment.poster ? 'Заменить' : 'Выбрать / Загрузить'}</Button>
                        </div>
                        : null
                    }

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!attachment.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setAttachment({
                                      ...attachment,
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
                        disabled={fetching}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching}
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

PopupAttachmentCreate.defaultProps = defaultProps
PopupAttachmentCreate.displayName = 'PopupAttachmentCreate'

export default function openPopupAttachmentCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupAttachmentCreate, popupProps, undefined, block, displayOptions)
}