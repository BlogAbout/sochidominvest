import React, {useEffect, useState} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {IBuilding} from '../../@types/IBuilding'
import {ITab} from '../../@types/ITab'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import ComboBox from '../ComboBox/ComboBox'
import Tabs from '../Tabs/Tabs'
import classes from './PopupBuildingCreate.module.scss'

interface Props extends PopupProps {
    building?: IBuilding | null

    onSave(): void
}

const defaultProps: Props = {
    building: null,
    onSave: () => {
        console.info('PopupBuildingCreate onSave')
    }
}

const PopupBuildingCreate: React.FC<Props> = (props) => {
    const [building, setBuilding] = useState<IBuilding>(props.building || {
        id: null,
        name: '',
        address: '',
        area: 0,
        cost: 0,
        type: 'apartment',
        status: 'sold',
        active: 1
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

    const typesList = [
        {key: 'apartment', text: 'Апартаменты'}
    ]

    const statusesList = [
        {key: 'sold', text: 'Продано'}
    ]

    // Вкладка состояния объекта
    const renderStateTab = () => {
        return (
            <div key='state' className={classes.tabContent}>
                <div className={classes.field}>
                    <div className={classes.field_label}>Статус</div>

                    <ComboBox selected={building.status}
                              items={Object.values(statusesList)}
                              onSelect={(value: string) => setBuilding({...building, status: value})}
                              placeHolder={'Выберите статус'}
                              styleType='standard'
                              icon='flag'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              checked={!!building.active}
                              onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                  ...building,
                                  active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    // Вкладка цен объекта
    const renderPriceTab = () => {
        return (
            <div key='price' className={classes.tabContent}>
                <div className={classes.field}>
                    <div className={classes.field_label}>Цена</div>

                    <TextBox value={building.cost}
                             onChange={(e: React.MouseEvent, value: number) => setBuilding({
                                 ...building,
                                 cost: value
                             })}
                             placeHolder={'Введите цену'}
                             icon='ruble-sign'
                    />
                </div>
            </div>
        )
    }

    // Вкладка шахматки объекта
    const renderCheckerBoardTab = () => {
        return (
            <div key='checker' className={classes.tabContent}>

            </div>
        )
    }

    // Вкладка галереии объекта
    const renderGalleryTab = () => {
        return (
            <div key='gallery' className={classes.tabContent}>

            </div>
        )
    }

    const tabs: ITab = {
        state: {title: 'Состояние', render: renderStateTab()},
        price: {title: 'Цены', render: renderPriceTab()},
        checker: {title: 'Шахматка', render: renderCheckerBoardTab()},
        gallery: {title: 'Галерея', render: renderGalleryTab()}
    }

    return (
        <Popup className={classes.PopupBuildingCreate}>
            <Header title={props.building ? 'Редактировать недвижимость' : 'Добавить недвижимость'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={false} className={classes.content}>
                    <div className={classes.info}>
                        <div className={classes.field}>
                            <div className={classes.field_label}>Название</div>

                            <TextBox value={building.name}
                                     onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                         ...building,
                                         name: value
                                     })}
                                     placeHolder={'Введите название'}
                                     error={building.name.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='heading'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Адрес</div>

                            <TextBox value={building.address}
                                     onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                         ...building,
                                         address: value
                                     })}
                                     placeHolder={'Введите адрес'}
                                     error={!building.address || building.address.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='location-dot'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Площадь, м<sup>2</sup></div>

                            <TextBox value={building.area}
                                     onChange={(e: React.MouseEvent, value: number) => setBuilding({
                                         ...building,
                                         area: value
                                     })}
                                     placeHolder={'Введите площадь'}
                                     icon='arrow-up-right-from-square'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Тип</div>

                            <ComboBox selected={building.type}
                                      items={Object.values(typesList)}
                                      onSelect={(value: string) => setBuilding({...building, type: value})}
                                      placeHolder={'Выберите тип'}
                                      styleType='standard'
                                      icon='user-check'
                            />
                        </div>
                    </div>

                    <div className={classes['tabs']}>
                        <Tabs tabs={tabs} paddingFirstTab='popup'/>
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

PopupBuildingCreate.defaultProps = defaultProps
PopupBuildingCreate.displayName = 'PopupBuildingCreate'

export default function openPopupBuildingCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupBuildingCreate, popupProps, undefined, block, displayOptions)
}