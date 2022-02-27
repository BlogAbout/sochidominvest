import React, {useEffect, useState} from 'react'
import {IBuildingChecker} from '../../@types/IBuilding'
import {PopupProps} from '../../@types/IPopup'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import CheckBox from '../CheckBox/CheckBox'
import ComboBox from '../ComboBox/ComboBox'
import {checkerFurnish} from '../../helpers/buildingHelper'
import classes from './PopupCheckerCreate.module.scss'

interface Props extends PopupProps {
    checker?: IBuildingChecker
    fetching: boolean

    onSave(checker: IBuildingChecker): void
}

const defaultProps: Props = {
    checker: {} as IBuildingChecker,
    fetching: false,
    onSave: (checker: IBuildingChecker) => {
        console.info('PopupCheckerCreate onSave', checker)
    }
}

const PopupCheckerCreate: React.FC<Props> = (props) => {
    const [checker, setChecker] = useState<IBuildingChecker>(props.checker || {
        id: null,
        buildingId: 0,
        name: '',
        area: 0,
        cost: 0,
        furnish: 'draft',
        stage: 1,
        rooms: 1,
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

    return (
        <Popup className={classes.PopupCheckerCreate}>
            <Header title={checker ? 'Редактировать картиру' : 'Добавить квартиру'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={props.fetching} className={classes.content}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Название</div>

                        <TextBox value={checker.name}
                                 onChange={(e: React.MouseEvent, value: string) => setChecker({
                                     ...checker,
                                     name: value
                                 })}
                                 placeHolder={'Введите название'}
                                 error={!checker.name || checker.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Площадь, кв.м.</div>

                        <TextBox value={checker.area || 0}
                                 onChange={(e: React.MouseEvent, value: number) => setChecker({
                                     ...checker,
                                     area: value
                                 })}
                                 placeHolder='Укажите площадь в квадратных метрах'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Цена, тыс. руб.</div>

                        <TextBox value={checker.cost}
                                 onChange={(e: React.MouseEvent, value: number) => setChecker({
                                     ...checker,
                                     cost: value
                                 })}
                                 placeHolder='Укажите полную стоимость'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Вид отделки</div>

                        <ComboBox selected={checker.furnish}
                                  items={Object.values(checkerFurnish)}
                                  onSelect={(value: string) => setChecker({...checker, furnish: value})}
                                  placeHolder='Выберите вид отделки'
                                  styleType='standard'
                                  icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Этаж</div>

                        <TextBox value={checker.stage}
                                 onChange={(e: React.MouseEvent, value: number) => setChecker({
                                     ...checker,
                                     stage: value
                                 })}
                                 placeHolder='Укажите этаж'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Количество комнат</div>

                        <TextBox value={checker.rooms}
                                 onChange={(e: React.MouseEvent, value: number) => setChecker({
                                     ...checker,
                                     rooms: value
                                 })}
                                 placeHolder='Укажите количество комнат'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  checked={!!checker.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setChecker({
                                      ...checker,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                {/*<Button type="apply"*/}
                {/*        icon='check'*/}
                {/*        onClick={saveHandler.bind(this)}*/}
                {/*        disabled={false}*/}
                {/*>Сохранить</Button>*/}

                {/*<Button type="save"*/}
                {/*        icon='arrow-rotate-left'*/}
                {/*        onClick={close.bind(this)}*/}
                {/*>Отменить</Button>*/}
            </Footer>
        </Popup>
    )
}

PopupCheckerCreate.defaultProps = defaultProps
PopupCheckerCreate.displayName = 'PopupCheckerCreate'

export default function openPopupCheckerCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupCheckerCreate, popupProps, undefined, block, displayOptions)
}