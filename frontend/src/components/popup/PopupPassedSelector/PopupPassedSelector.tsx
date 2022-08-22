import React, {useEffect, useState} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBuildingPassed} from '../../../@types/IBuilding'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import CheckBox from '../../form/CheckBox/CheckBox'
import NumberBox from '../../NumberBox/NumberBox'
import {Footer, Popup} from '../Popup/Popup'
import Button from '../../form/Button/Button'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupPassedSelector.module.scss'

interface Props extends PopupProps {
    selected: IBuildingPassed | null

    onChange(value: IBuildingPassed): void
}

const defaultProps: Props = {
    selected: null,
    onChange: (value: IBuildingPassed) => {
        console.info('PopupPassedSelector onSelect', value)
    }
}

const PopupPassedSelector: React.FC<Props> = (props) => {
    const [passed, setPassed] = useState<IBuildingPassed>(props.selected || {
        is: 0,
        quarter: null,
        year: 2020
    })

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    const close = () => {
        removePopup(props.id || '')
    }

    const quarters = [1, 2, 3, 4]

    return (
        <Popup className={classes.PopupPassedSelector}>
            <BlockingElement fetching={false} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о сдаче объекта</Title>

                    <div className={classes.field}>
                        <CheckBox label='Сдан'
                                  type='modern'
                                  width={110}
                                  checked={!!passed.is}
                                  onChange={(e: React.MouseEvent, value: boolean) => setPassed({
                                      ...passed,
                                      is: value ? 1 : 0
                                  })}
                        />
                    </div>

                    <div className={classes.field}>
                        <Label text='Квартал'/>

                        <div className={classes.radio}>
                            {quarters.map(item => {
                                return (
                                    <span key={item}
                                          className={passed.quarter === item ? classes.active : undefined}
                                          onClick={() => setPassed({
                                              ...passed,
                                              quarter: passed.quarter === item ? null : item
                                          })}
                                    >{item}</span>
                                )
                            })}
                        </div>
                    </div>

                    <div className={classes.field}>
                        <Label text='Год'/>

                        <NumberBox value={passed.year || ''}
                                   min={1}
                                   step={1}
                                   max={2100}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setPassed({
                                       ...passed,
                                       year: value
                                   })}
                                   placeHolder='Введите год сдачи'
                                   styleType='minimal'
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => {
                            props.onChange(passed)
                            close()
                        }}
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

PopupPassedSelector.defaultProps = defaultProps
PopupPassedSelector.displayName = 'PopupPassedSelector'

export default function openPopupPassedSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupPassedSelector, popupProps, undefined, block, displayOptions)
}