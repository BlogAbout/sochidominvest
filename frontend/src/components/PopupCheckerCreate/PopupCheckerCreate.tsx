import React, {useEffect, useState} from 'react'
import {IBuildingChecker} from '../../@types/IBuilding'
import {PopupProps} from '../../@types/IPopup'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import openPopupAlert from '../PopupAlert/PopupAlert'
import CheckerService from '../../api/CheckerService'
import Button from '../Button/Button'
import TextBox from '../TextBox/TextBox'
import NumberBox from '../NumberBox/NumberBox'
import CheckBox from '../CheckBox/CheckBox'
import ComboBox from '../ComboBox/ComboBox'
import {checkerFurnish} from '../../helpers/buildingHelper'
import classes from './PopupCheckerCreate.module.scss'

interface Props extends PopupProps {
    checker?: IBuildingChecker
    buildingId: number | null

    onSave(): void
}

const defaultProps: Props = {
    buildingId: null,
    onSave: () => {
        console.info('PopupCheckerCreate onSave')
    }
}

const PopupCheckerCreate: React.FC<Props> = (props) => {
    const [checker, setChecker] = useState<IBuildingChecker>(props.checker || {
        id: null,
        buildingId: props.buildingId,
        name: '',
        area: 0,
        cost: 0,
        furnish: 'draft',
        housing: 1,
        stage: 'Ц',
        rooms: 1,
        active: 1,
        status: 'sold'
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
        if (!checker.buildingId || checker.name.trim() === '' || !checker.area || !checker.cost) {
            return
        }

        setFetching(true)

        CheckerService.saveChecker(checker)
            .then((response: any) => {
                setFetching(false)
                setChecker(response.data)

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
        <Popup className={classes.PopupCheckerCreate}>
            <Header title={checker.id ? 'Редактировать картиру' : 'Добавить квартиру'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
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
                        <div className={classes.field_label}>Корпус</div>

                        <NumberBox value={checker.housing || 1}
                                   min={0}
                                   step={1}
                                   max={999}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setChecker({
                                       ...checker,
                                       housing: value
                                   })}
                                   placeHolder='Укажите номер корпуса'
                                   error={!checker.housing}
                                   showRequired
                                   errorText='Поле обязательно для заполнения'
                                   icon='1'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Площадь, кв.м.</div>

                        <NumberBox value={checker.area || 0}
                                   min={0}
                                   step={0.01}
                                   max={999}
                                   countAfterComma={2}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setChecker({
                                       ...checker,
                                       area: value
                                   })}
                                   placeHolder='Укажите площадь в квадратных метрах'
                                   icon='up-right-and-down-left-from-center'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Цена, руб.</div>

                        <NumberBox value={checker.cost || 0}
                                   min={0}
                                   step={1}
                                   max={999999999}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setChecker({
                                       ...checker,
                                       cost: value
                                   })}
                                   placeHolder='Укажите полную стоимость'
                                   icon='ruble-sign'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Вид отделки</div>

                        <ComboBox selected={checker.furnish}
                                  items={Object.values(checkerFurnish)}
                                  onSelect={(value: string) => setChecker({...checker, furnish: value})}
                                  placeHolder='Выберите вид отделки'
                                  styleType='standard'
                                  icon='paint-roller'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Этаж</div>

                        <TextBox value={checker.stage}
                                 onChange={(e: React.MouseEvent, value: string) => setChecker({
                                     ...checker,
                                     stage: value
                                 })}
                                 placeHolder='Укажите этаж'
                                 icon='elevator'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Количество комнат</div>

                        <NumberBox value={checker.rooms || 1}
                                   min={0}
                                   step={1}
                                   max={99}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setChecker({
                                       ...checker,
                                       rooms: value
                                   })}
                                   placeHolder='Укажите количество комнат'
                                   icon='bed'
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
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || !checker.buildingId || checker.name.trim() === '' || !checker.area || !checker.cost}
                >Сохранить и закрыть</Button>

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || !checker.buildingId || checker.name.trim() === '' || !checker.area || !checker.cost}
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