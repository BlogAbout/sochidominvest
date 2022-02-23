import React, {useEffect, useState} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {ITag} from '../../@types/ITag'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import classes from './PopupBuildingCreate.module.scss'

interface Props extends PopupProps {
    tag?: ITag | null

    onSave(): void
}

const defaultProps: Props = {
    tag: null,
    onSave: () => {
        console.info('PopupTagCreate onSave')
    }
}

const PopupTagCreate: React.FC<Props> = (props) => {
    const [tag, setTag] = useState<ITag>(props.tag || {
        id: null,
        name: '',
        status: 1
    })

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
    const saveHandler = () => {
        // Todo
    }

    return (
        <Popup className={classes.PopupTagCreate}>
            <Header title={props.tag ? 'Редактировать метку' : 'Добавить метку'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={false} className={classes.content}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Название</div>

                        <TextBox value={tag.name}
                                 onChange={(e: React.MouseEvent, value: string) => setTag({
                                     ...tag,
                                     name: value
                                 })}
                                 placeHolder={'Введите название'}
                                 error={tag.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 icon='heading'
                        />
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type="apply"
                        icon='check'
                        onClick={saveHandler.bind(this)}
                        disabled={false}
                >Сохранить</Button>

                <Button type="save"
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupTagCreate.defaultProps = defaultProps
PopupTagCreate.displayName = 'PopupTagCreate'

export default function openPopupTagCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupTagCreate, popupProps, undefined, block, displayOptions)
}