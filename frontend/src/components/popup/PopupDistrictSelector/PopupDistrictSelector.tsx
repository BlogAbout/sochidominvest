import React, {useEffect, useState} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {ISelector} from '../../../@types/ISelector'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {districtList} from '../../../helpers/buildingHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import Title from '../../ui/Title/Title'
import classes from './PopupDistrictSelector.module.scss'

interface Props extends PopupProps {
    selected: string[]

    onSave(selected: string[]): void
}

const defaultProps: Props = {
    selected: [],
    onSave: (selected: string[]) => {
        console.info('PopupDistrictSelector onSave', selected)
    }
}

const PopupDistrictSelector: React.FC<Props> = (props) => {
    const [selected, setSelected] = useState<string[]>(props.selected)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        props.onSave(selected)
        close()
    }

    const onChangeChecked = (key: string) => {
        if (selected.includes(key)) {
            setSelected(selected.filter((item: string) => item !== key))
        } else {
            setSelected([...selected, key])
        }
    }

    return (
        <Popup className={classes.PopupDistrictSelector}>
            <BlockingElement fetching={false} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Выбор района</Title>

                    {districtList.map((item: ISelector) => {
                        return (
                            <div key={item.key} className={classes.district}>
                                <Title type={3}>{item.text}</Title>

                                {item.children ?
                                    item.children.map((children: ISelector) => {
                                        return (
                                            <div key={children.key} className={classes.field}>
                                                <CheckBox label={children.text}
                                                          type='classic'
                                                          width={110}
                                                          checked={selected.includes(children.key)}
                                                          onChange={() => onChangeChecked(children.key)}
                                                />
                                            </div>
                                        )
                                    })
                                    : null}
                            </div>
                        )
                    })}
                </div>
            </BlockingElement>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        title='Выбрать'
                >Выбрать</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Закрыть'
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupDistrictSelector.defaultProps = defaultProps
PopupDistrictSelector.displayName = 'PopupDistrictSelector'

export default function openPopupDistrictSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupDistrictSelector, popupProps, undefined, block, displayOptions)
}