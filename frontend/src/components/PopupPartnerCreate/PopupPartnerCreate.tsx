import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import classNames from 'classnames/bind'
import PartnerService from '../../api/PartnerService'
import {PopupProps} from '../../@types/IPopup'
import {IPartner} from '../../@types/IPartner'
import {ITab} from '../../@types/ITab'
import {partnerTypes} from '../../helpers/partnerHelper'
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
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
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

    const renderContentTab = () => {
        return (
            <div key='content' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Название</div>

                        <TextBox value={partner.name}
                                 onChange={(e: React.MouseEvent, value: string) => setPartner({
                                     ...partner,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={!partner.name || partner.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Подпись (слоган)</div>

                        <TextBox value={partner.subtitle}
                                 onChange={(e: React.MouseEvent, value: string) => setPartner({
                                     ...partner,
                                     subtitle: value
                                 })}
                                 placeHolder='Введите подпись'
                                 icon='s'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Тип</div>

                        <ComboBox selected={partner.type}
                                  items={Object.values(partnerTypes)}
                                  onSelect={(value: string) => setPartner({...partner, type: value})}
                                  placeHolder='Выберите тип'
                                  styleType='standard'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Аватар</div>

                        <Button type='save'
                                icon='arrow-pointer'
                                onClick={() => openPopupFileManager(document.body, {
                                    type: 'image',
                                    selected: partner.avatarId ? [partner.avatarId] : [],
                                    onSelect: (selected: number[]) => {
                                        setPartner({
                                            ...partner,
                                            avatarId: selected.length ? selected[0] : null
                                        })
                                    }
                                })}
                                disabled={fetching}
                        >{partner.avatarId ? 'Заменить' : 'Выбрать / Загрузить'}</Button>
                    </div>

                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Описание</div>

                        <TextAreaBox value={partner.description}
                                     onChange={(value: string) => setPartner({
                                         ...partner,
                                         description: value
                                     })}
                                     placeHolder='Введите описание'
                                     icon='paragraph'
                                     isVisual={true}
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  checked={!!partner.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setPartner({
                                      ...partner,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const renderInfoTab = () => {
        // Todo
        return (
            <div key='info' className={classes.tabContent}>
                В разработке
            </div>
        )
    }

    const renderSeoTab = () => {
        return (
            <div key='seo' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Meta Title</div>

                        <TextBox value={partner.metaTitle}
                                 onChange={(e: React.MouseEvent, value: string) => setPartner({
                                     ...partner,
                                     metaTitle: value
                                 })}
                                 placeHolder='Введите Meta Title'
                                 icon='heading'
                        />
                    </div>

                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Meta Description</div>

                        <TextAreaBox value={partner.metaDescription || ''}
                                     onChange={(value: string) => setPartner({
                                         ...partner,
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
        info: {title: 'Информация', render: renderInfoTab()},
        seo: {title: 'СЕО', render: renderSeoTab()}
    }

    return (
        <Popup className={classes.PopupPartnerCreate}>
            <Header title={partner.id ? 'Редактировать партнера' : 'Добавить партнера'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </BlockingElement>
            </Content>

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
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupPartnerCreate), popupProps, undefined, block, displayOptions)
}