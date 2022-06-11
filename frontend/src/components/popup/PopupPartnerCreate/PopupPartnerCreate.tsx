import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import classNames from 'classnames/bind'
import PartnerService from '../../../api/PartnerService'
import {PopupProps} from '../../../@types/IPopup'
import {IPartner} from '../../../@types/IPartner'
import {partnerTypes} from '../../../helpers/partnerHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import AvatarBox from '../../form/AvatarBox/AvatarBox'
import classes from './PopupPartnerCreate.module.scss'

interface Props extends PopupProps {
    partner?: IPartner | null

    onSave(): void
}

const defaultProps: Props = {
    partner: null,
    onSave: () => {
        console.info('PopupPartnerCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupPartnerCreate: React.FC<Props> = (props) => {
    const [partner, setPartner] = useState<IPartner>(props.partner || {
        id: null,
        name: '',
        description: '',
        subtitle: '',
        author: null,
        type: 'partner',
        active: 1,
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

        PartnerService.savePartner(partner)
            .then((response: any) => {
                setPartner(response.data)

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
            .finally(() => {
                setFetching(false)
            })
    }

    const renderContentBlock = () => {
        return (
            <div key='content' className={classes.blockContent}>
                <Title type={2}>Информация о партнере</Title>
                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={partner.name}
                             onChange={(e: React.MouseEvent, value: string) => setPartner({
                                 ...partner,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={!partner.name || partner.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Подпись (слоган)'/>

                    <TextBox value={partner.subtitle}
                             onChange={(e: React.MouseEvent, value: string) => setPartner({
                                 ...partner,
                                 subtitle: value
                             })}
                             placeHolder='Введите подпись'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Тип'/>

                    <ComboBox selected={partner.type}
                              items={Object.values(partnerTypes)}
                              onSelect={(value: string) => setPartner({...partner, type: value})}
                              placeHolder='Выберите тип'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Аватар'/>

                    <AvatarBox avatarId={partner.avatarId || null}
                               fetching={fetching}
                               onSelect={(attachmentId: number | null) => {
                                   setPartner({
                                       ...partner,
                                       avatarId: attachmentId
                                   })
                               }}
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={partner.description}
                                 onChange={(value: string) => setPartner({
                                     ...partner,
                                     description: value
                                 })}
                                 placeHolder='Введите описание'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!partner.active}
                              onChange={(e: React.MouseEvent, value: boolean) => setPartner({
                                  ...partner,
                                  active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    const renderInfoBlock = () => {
        // Todo
        return (
            <div key='info' className={classes.blockContent}>
                <Title type={2}>Контакты</Title>
                В разработке
            </div>
        )
    }

    const renderSeoBlock = () => {
        return (
            <div key='seo' className={classes.blockContent}>
                <Title type={2}>СЕО</Title>

                <div className={cx({'field': true, 'full': true})}>
                    <Label text='Meta Title'/>

                    <TextBox value={partner.metaTitle}
                             onChange={(e: React.MouseEvent, value: string) => setPartner({
                                 ...partner,
                                 metaTitle: value
                             })}
                             placeHolder='Введите Meta Title'
                             styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Meta Description'/>

                    <TextAreaBox value={partner.metaDescription || ''}
                                 onChange={(value: string) => setPartner({
                                     ...partner,
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
        <Popup className={classes.PopupPartnerCreate}>
            <Header title={partner.id ? 'Редактировать партнера' : 'Добавить партнера'}
                    popupId={props.id ? props.id : ''}
            />

            <BlockingElement fetching={fetching} className={classes.content}>
                {renderContentBlock()}
                {renderInfoBlock()}
                {renderSeoBlock()}
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || partner.name.trim() === ''}
                >Сохранить и закрыть</Button>

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || partner.name.trim() === ''}
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

PopupPartnerCreate.defaultProps = defaultProps
PopupPartnerCreate.displayName = 'PopupPartnerCreate'

export default function openPopupPartnerCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupPartnerCreate), popupProps, undefined, block, displayOptions)
}