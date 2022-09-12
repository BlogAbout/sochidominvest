import React, {useEffect, useState} from 'react'
import {IBuildingChecker} from '../../../@types/IBuilding'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import CheckerService from '../../../api/CheckerService'
import Button from '../../form/Button/Button'
import TextBox from '../../form/TextBox/TextBox'
import NumberBox from '../../NumberBox/NumberBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import {checkerFurnish, checkerStatuses} from '../../../helpers/buildingHelper'
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
        costOld: 0,
        furnish: 'draft',
        housing: 1,
        stage: 'Ц',
        rooms: 1,
        active: 1,
        status: 'free'
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
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о квартире</Title>
                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={checker.name}
                                 onChange={(e: React.MouseEvent, value: string) => setChecker({
                                     ...checker,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={!checker.name || checker.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Корпус'/>

                        <NumberBox value={checker.housing || ''}
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
                                   styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Площадь, кв.м.'/>

                        <NumberBox value={checker.area || ''}
                                   min={0}
                                   step={0.01}
                                   max={999}
                                   countAfterComma={2}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setChecker({
                                       ...checker,
                                       area: value
                                   })}
                                   placeHolder='Укажите площадь в квадратных метрах'
                                   styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Цена, руб.'/>

                        <NumberBox value={checker.cost || ''}
                                   min={0}
                                   step={1}
                                   max={999999999}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setChecker({
                                       ...checker,
                                       cost: value
                                   })}
                                   placeHolder='Укажите полную стоимость'
                                   styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Вид отделки'/>

                        <ComboBox selected={checker.furnish}
                                  items={Object.values(checkerFurnish)}
                                  onSelect={(value: string) => setChecker({...checker, furnish: value})}
                                  placeHolder='Выберите вид отделки'
                                  styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Этаж'/>

                        <TextBox value={checker.stage}
                                 onChange={(e: React.MouseEvent, value: string) => setChecker({
                                     ...checker,
                                     stage: value
                                 })}
                                 placeHolder='Укажите этаж'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Количество комнат'/>

                        <NumberBox value={checker.rooms || ''}
                                   min={0}
                                   step={1}
                                   max={99}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setChecker({
                                       ...checker,
                                       rooms: value
                                   })}
                                   placeHolder='Укажите количество комнат'
                                   styleType='minimal'
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Статус'/>

                        <ComboBox selected={checker.status || 'free'}
                                  items={Object.values(checkerStatuses)}
                                  onSelect={(value: string) => setChecker({...checker, status: value})}
                                  placeHolder='Выберите статус'
                                  styleType='minimal'
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
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || !checker.buildingId || checker.name.trim() === '' || !checker.area || !checker.cost}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || !checker.buildingId || checker.name.trim() === '' || !checker.area || !checker.cost}
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

PopupCheckerCreate.defaultProps = defaultProps
PopupCheckerCreate.displayName = 'PopupCheckerCreate'

export default function openPopupCheckerCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupCheckerCreate, popupProps, undefined, block, displayOptions)
}