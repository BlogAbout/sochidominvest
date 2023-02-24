import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {ISelector} from '../../../@types/ISelector'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import SearchBox from '../../SearchBox/SearchBox'
import Title from '../../ui/Title/Title'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import classes from './PopupSelector.module.scss'

interface Props extends PopupProps {
    title: string
    items: ISelector[]
    selected: string[]
    multi?: boolean

    onSelect(selected: string[]): void
}

const defaultProps: Props = {
    title: 'Выбрать',
    items: [],
    selected: [],
    multi: false,
    onSelect: (selected: string[]) => {
        console.info('PopupSelector onSelect', selected)
    }
}

const PopupSelector: React.FC<Props> = (props) => {
    const [searchText, setSearchText] = useState('')
    const [filteredItems, setFilteredItems] = useState<ISelector[]>([])
    const [selectedItems, setSelectedItems] = useState<string[]>(props.selected)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [])

    useEffect(() => {
        search(searchText)
    }, [props.items])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Клик на строку
    const selectRow = (item: ISelector) => {
        if (props.multi) {
            selectRowMulti(item)
        } else if (props.onSelect !== null) {
            props.onSelect([item.key])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (item: ISelector) => {
        if (checkSelected(item.key)) {
            setSelectedItems(selectedItems.filter((key: string) => key !== item.key))
        } else {
            setSelectedItems([...selectedItems, item.key])
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (key: string) => {
        return selectedItems.includes(key)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (props.items.length) {
            if (value.trim() !== '') {
                setFilteredItems(props.items.filter((item: ISelector) => {
                    return item.text.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
                }))
            } else {
                setFilteredItems(props.items)
            }
        }
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedItems)
        close()
    }

    const renderSearch = () => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={search.bind(this)}
                           countFind={filteredItems.length}
                           showClear
                           margin='0 0 11px 0'
                           flexGrow
                           autoFocus={true}
                />
            </div>
        )
    }

    const renderListBox = () => {
        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {filteredItems.map((item: ISelector) => {
                        return renderRow(item, 'left', checkSelected(item.key))
                    })}
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filteredItems.filter((item: ISelector) => checkSelected(item.key))

        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.map((item: ISelector) => renderRow(item, 'right', checkSelected(item.key)))}
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (item: ISelector, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={'rowItem' + item.key}
                 onClick={() => selectRow(item)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type='classic'
                              onChange={e => e}
                              checked={checked}
                              margin='0px 0px 0px 10px'
                              label=''
                    />
                    : null
                }

                {!checked || props.multi ? null :
                    <div className={classes.selected}>
                        <FontAwesomeIcon icon='check'/>
                    </div>
                }

                <div className={classes.name}>{item.text}</div>

                {props.multi && side === 'right' ?
                    <div className={classes.delete} title='Удалить'>
                        <FontAwesomeIcon icon='xmark'/>
                    </div>
                    : null
                }
            </div>
        )
    }

    return (
        <Popup className={classes.PopupSelector}>
            <BlockingElement fetching={false} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>{props.title}</Title>

                    {renderSearch()}

                    {renderListBox()}

                    {props.multi ? renderSelectedListBox() : null}
                </div>
            </BlockingElement>

            {props.multi ?
                <Footer>
                    <Button type='apply'
                            icon='check'
                            onClick={() => onClickSave()}
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
                :
                null
            }
        </Popup>
    )
}

PopupSelector.defaultProps = defaultProps
PopupSelector.displayName = 'PopupSelector'

export default function openPopupSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupSelector), popupProps, undefined, block, displayOptions)
}