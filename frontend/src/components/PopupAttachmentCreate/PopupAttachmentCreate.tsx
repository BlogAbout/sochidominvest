import React, {useEffect, useState} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {IAttachment} from '../../@types/IAttachment'
import AttachmentService from '../../api/AttachmentService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import TextAreaBox from '../TextAreaBox/TextAreaBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
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
            <Header title='Редактировать вложение' popupId={props.id || ''}/>

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Название</div>

                        <TextBox value={attachment.name || ''}
                                 onChange={(e: React.MouseEvent, value: string) => setAttachment({
                                     ...attachment,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Описание</div>

                        <TextAreaBox value={attachment.description || ''}
                                     onChange={(value: string) => setAttachment({
                                         ...attachment,
                                         description: value
                                     })}
                                     placeHolder='Введите описание'
                                     icon='paragraph'
                        />
                    </div>

                    {attachment.type === 'video' ?
                        <div className={classes.field}>
                            <div className={classes.field_label}>Постер</div>

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
                                  checked={!!attachment.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setAttachment({
                                      ...attachment,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching}
                >Сохранить и закрыть</Button>

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching}
                        className='marginLeft'
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

PopupAttachmentCreate.defaultProps = defaultProps
PopupAttachmentCreate.displayName = 'PopupAttachmentCreate'

export default function openPopupAttachmentCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupAttachmentCreate, popupProps, undefined, block, displayOptions)
}