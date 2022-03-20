import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import DeveloperService from '../../api/DeveloperService'
import {PopupProps} from '../../@types/IPopup'
import {IDeveloper} from '../../@types/IDeveloper'
import {developerTypes} from '../../helpers/developerHelper'
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
    const saveHandler = () => {
        setFetching(true)

        DeveloperService.saveDeveloper(developer)
            .then((response: any) => {
                setFetching(false)
                setDeveloper(response.data)

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

    return (
        <Popup className={classes.PopupDeveloperCreate}>
            <Header title={developer.id ? 'Редактировать застройщика' : 'Добавить застройщика'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <div className={classes.info}>
                        <div className={classes.field}>
                            <div className={classes.field_label}>Название</div>

                            <TextBox value={developer.name}
                                     onChange={(e: React.MouseEvent, value: string) => setDeveloper({
                                         ...developer,
                                         name: value
                                     })}
                                     placeHolder='Введите название'
                                     error={developer.name.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='heading'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Адрес</div>

                            <TextBox value={developer.address}
                                     onChange={(e: React.MouseEvent, value: string) => setDeveloper({
                                         ...developer,
                                         address: value
                                     })}
                                     placeHolder='Введите адрес'
                                     error={!developer.address || developer.address.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='location-dot'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Телефон</div>

                            <TextBox value={developer.phone}
                                     onChange={(e: React.MouseEvent, value: string) => setDeveloper({
                                         ...developer,
                                         phone: value
                                     })}
                                     placeHolder='Введите номер телефона'
                                     error={!developer.phone || developer.phone.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='phone'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Тип</div>

                            <ComboBox selected={developer.type}
                                      items={Object.values(developerTypes)}
                                      onSelect={(value: string) => setDeveloper({...developer, type: value})}
                                      placeHolder='Выберите тип'
                                      styleType='standard'
                            />
                        </div>

                        <div className={cx({'field': true, 'full': true})}>
                            <div className={classes.field_label}>Описание</div>

                            <TextAreaBox value={developer.description}
                                         onChange={(value: string) => setDeveloper({
                                             ...developer,
                                             description: value
                                         })}
                                         placeHolder='Введите описание о застройщике'
                                         icon='paragraph'
                            />
                        </div>

                        <div className={classes.field}>
                            <CheckBox label='Активен'
                                      type='modern'
                                      checked={!!developer.active}
                                      onChange={(e: React.MouseEvent, value: boolean) => setDeveloper({
                                          ...developer,
                                          active: value ? 1 : 0
                                      })}
                            />
                        </div>
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type="apply"
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || developer.name.trim() === '' || developer.address.trim() === '' || developer.phone.trim() === ''}
                >Сохранить</Button>

                <Button type="regular"
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupDeveloperCreate.defaultProps = defaultProps
PopupDeveloperCreate.displayName = 'PopupDeveloperCreate'

export default function openPopupDeveloperCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupDeveloperCreate, popupProps, undefined, block, displayOptions)
}