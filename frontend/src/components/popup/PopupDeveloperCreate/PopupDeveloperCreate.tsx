import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import DeveloperService from '../../../api/DeveloperService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IDeveloper} from '../../../@types/IDeveloper'
import {developerTypes} from '../../../helpers/developerHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../TextAreaBox/TextAreaBox'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import AvatarBox from '../../form/AvatarBox/AvatarBox'
import classes from './PopupDeveloperCreate.module.scss'

interface Props extends PopupProps {
    developer?: IDeveloper | null

    onSave(): void
}

const defaultProps: Props = {
    developer: null,
    onSave: () => {
        console.info('PopupTagCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupDeveloperCreate: React.FC<Props> = (props) => {
    const [developer, setDeveloper] = useState<IDeveloper>(props.developer || {
        id: null,
        name: '',
        description: '',
        address: '',
        phone: '',
        type: 'constructionCompany',
        active: 1,
        author: null
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

        DeveloperService.saveDeveloper(developer)
            .then((response: any) => {
                setFetching(false)
                setDeveloper(response.data)

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
        <Popup className={classes.PopupDeveloperCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о застройщике</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={developer.name}
                                 onChange={(e: React.MouseEvent, value: string) => setDeveloper({
                                     ...developer,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={developer.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Адрес'/>

                        <TextBox value={developer.address}
                                 onChange={(e: React.MouseEvent, value: string) => setDeveloper({
                                     ...developer,
                                     address: value
                                 })}
                                 placeHolder='Введите адрес'
                                 error={!developer.address || developer.address.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Телефон'/>

                        <TextBox value={developer.phone}
                                 onChange={(e: React.MouseEvent, value: string) => setDeveloper({
                                     ...developer,
                                     phone: value
                                 })}
                                 placeHolder='Введите номер телефона'
                                 error={!developer.phone || developer.phone.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Тип'/>

                        <ComboBox selected={developer.type}
                                  items={Object.values(developerTypes)}
                                  onSelect={(value: string) => setDeveloper({...developer, type: value})}
                                  placeHolder='Выберите тип'
                                  styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Аватар'/>

                        <AvatarBox avatarId={developer.avatarId || null}
                                   fetching={fetching}
                                   onSelect={(attachmentId: number | null) => {
                                       setDeveloper({
                                           ...developer,
                                           avatarId: attachmentId
                                       })
                                   }}
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Описание'/>

                        <TextAreaBox value={developer.description}
                                     onChange={(value: string) => setDeveloper({
                                         ...developer,
                                         description: value
                                     })}
                                     placeHolder='Введите описание о застройщике'
                                     isVisual={true}
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!developer.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setDeveloper({
                                      ...developer,
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
                        disabled={fetching || developer.name.trim() === '' || developer.address.trim() === '' || developer.phone.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || developer.name.trim() === '' || developer.address.trim() === '' || developer.phone.trim() === ''}
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

PopupDeveloperCreate.defaultProps = defaultProps
PopupDeveloperCreate.displayName = 'PopupDeveloperCreate'

export default function openPopupDeveloperCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupDeveloperCreate, popupProps, undefined, block, displayOptions)
}