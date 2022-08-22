import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBuilding, IBuildingRent} from '../../../@types/IBuilding'
import {rentTypes} from '../../../helpers/buildingHelper'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import NumberBox from '../../NumberBox/NumberBox'
import classes from './PopupBuildingRent.module.scss'

interface Props extends PopupProps {
    building: IBuilding

    onSave(active: number, rentData: IBuildingRent): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    onSave: (active: number, rentData: IBuildingRent) => {
        console.info('PopupBuildingRent onSave', active, rentData)
    }
}

const cx = classNames.bind(classes)

const PopupBuildingRent: React.FC<Props> = (props) => {
    const [building, setBuilding] = useState<IBuilding>(props.building)
    const [rentData, setRentData] = useState<IBuildingRent>(props.building.rentData || {
        description: '',
        type: 'long',
        deposit: 0,
        commission: 0,
        cost: 0,
        costDeposit: 0,
        costCommission: 0
    })

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    const onSaveHandler = () => {
        props.onSave(building.rent, rentData)
        close()
    }

    const checkDisabled = () => {
        if (building.rent === 0) {
            return false
        }

        if (!rentData.cost || rentData.cost <= 0) {
            return true
        }

        if (rentData.deposit && (!rentData.costDeposit || rentData.costDeposit <= 0)) {
            return true
        }

        return !!(rentData.commission && (!rentData.costCommission || rentData.costCommission <= 0))
    }

    return (
        <Popup className={classes.PopupBuildingRent}>
            <BlockingElement fetching={false} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация об аренде</Title>

                    <div className={classes.field}>
                        <CheckBox label='Аренда'
                                  type='modern'
                                  width={110}
                                  checked={!!building.rent}
                                  onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                      ...building,
                                      rent: value ? 1 : 0
                                  })}
                        />
                    </div>

                    {!!building.rent ?
                        <>
                            <div className={classes.field}>
                                <Label text='Тип'/>

                                <ComboBox selected={rentData.type}
                                          items={Object.values(rentTypes)}
                                          onSelect={(value: string) => setRentData({...rentData, type: value})}
                                          placeHolder='Выберите тип'
                                          styleType='minimal'
                                />
                            </div>

                            <div className={classes.field}>
                                <Label text={'Стоимость, руб./' + (rentData.type ? 'месяц' : 'сутки')}/>

                                <NumberBox value={rentData.cost || ''}
                                           min={0}
                                           step={1}
                                           max={999999999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setRentData({
                                               ...rentData,
                                               cost: value
                                           })}
                                           placeHolder={'Укажите стоимость аренды за ' + (rentData.type ? 'месяц' : 'сутки')}
                                           error={!rentData.cost || rentData.cost <= 0}
                                           showRequired
                                           errorText='Поле обязательно для заполнения'
                                           styleType='minimal'
                                />
                            </div>

                            <div className={classes.field}>
                                <CheckBox label='Депозит'
                                          type='modern'
                                          width={110}
                                          checked={!!rentData.deposit}
                                          onChange={(e: React.MouseEvent, value: boolean) => setRentData({
                                              ...rentData,
                                              deposit: value ? 1 : 0
                                          })}
                                />
                            </div>

                            {!!rentData.deposit ?
                                <div className={classes.field}>
                                    <Label text='Сумма депозита, руб.'/>

                                    <NumberBox value={rentData.costDeposit || ''}
                                               min={0}
                                               step={1}
                                               max={999999999}
                                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setRentData({
                                                   ...rentData,
                                                   costDeposit: value
                                               })}
                                               placeHolder='Укажите сумму депозита'
                                               error={!rentData.costDeposit || rentData.costDeposit <= 0}
                                               showRequired
                                               errorText='Поле обязательно для заполнения'
                                               styleType='minimal'
                                    />
                                </div>
                                : null
                            }

                            <div className={classes.field}>
                                <CheckBox label='Комиссия'
                                          type='modern'
                                          width={110}
                                          checked={!!rentData.commission}
                                          onChange={(e: React.MouseEvent, value: boolean) => setRentData({
                                              ...rentData,
                                              commission: value ? 1 : 0
                                          })}
                                />
                            </div>

                            {!!rentData.commission ?
                                <div className={classes.field}>
                                    <Label text='Сумма комиссии, руб.'/>

                                    <NumberBox value={rentData.costCommission || ''}
                                               min={0}
                                               step={1}
                                               max={999999999}
                                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setRentData({
                                                   ...rentData,
                                                   costCommission: value
                                               })}
                                               placeHolder='Укажите сумму комиссии'
                                               error={!rentData.costCommission || rentData.costCommission <= 0}
                                               showRequired
                                               errorText='Поле обязательно для заполнения'
                                               styleType='minimal'
                                    />
                                </div>
                                : null
                            }

                            <div className={cx({'field': true, 'fieldWrap': true})}>
                                <Label text='Описание'/>

                                <TextAreaBox value={rentData.description}
                                             onChange={(value: string) => setRentData({
                                                 ...rentData,
                                                 description: value
                                             })}
                                             placeHolder='Введите описание об объекте'
                                             icon='paragraph'
                                             isVisual={true}
                                             width='100%'
                                />
                            </div>
                        </>
                        : null
                    }
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check'
                        onClick={() => onSaveHandler()}
                        disabled={checkDisabled()}
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

PopupBuildingRent.defaultProps = defaultProps
PopupBuildingRent.displayName = 'PopupBuildingRent'

export default function openPopupBuildingRent(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupBuildingRent, popupProps, undefined, block, displayOptions)
}