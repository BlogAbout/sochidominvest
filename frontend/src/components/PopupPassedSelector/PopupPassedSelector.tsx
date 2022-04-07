import React, {useState} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../@types/IPopup'
import {IBuildingPassed} from '../../@types/IBuilding'
import {openPopup, removePopup} from '../../helpers/popupHelper'
import CheckBox from '../CheckBox/CheckBox'
import NumberBox from '../NumberBox/NumberBox'
import {Content, Footer, Popup} from '../Popup/Popup'
import Button from '../Button/Button'
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
        quarter: 1,
        year: 2020
    })

    const close = () => {
        removePopup(props.id || '')
    }

    const quarters = [1, 2, 3, 4]

    return (
        <Popup className={classes.PopupPassedSelector}>
            <Content className={classes['popup-content']}>
                <div className={classes.content}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Квартал</div>

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
                        <div className={classes.field_label}>Год</div>

                        <NumberBox value={passed.year || ''}
                                   min={1}
                                   step={1}
                                   max={2100}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setPassed({
                                       ...passed,
                                       year: value
                                   })}
                                   placeHolder='Введите год сдачи'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Сдан'
                                  type='modern'
                                  checked={!!passed.is}
                                  onChange={(e: React.MouseEvent, value: boolean) => setPassed({
                                      ...passed,
                                      is: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </Content>
            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => {
                            props.onChange(passed)
                            close()
                        }}
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

PopupPassedSelector.defaultProps = defaultProps
PopupPassedSelector.displayName = 'PopupPassedSelector'

export default function openPopupPassedSelector(e: any, popupProps = {} as Props, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(PopupPassedSelector, popupProps, undefined, e, displayOptions)
}