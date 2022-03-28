import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../@types/IPopup'
import {ISelector} from '../../@types/ISelector'
import {openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import SearchBox from '../SearchBox/SearchBox'
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

    const renderLeftBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 38}}>
                    {renderSearch()}
                </div>
                <div className={classes['box_border']} style={{height: 300}}>
                    {!props.multi ? renderLeftTab() :
                        <div className={classes['box_content_wrapper']}>
                            {renderLeftTab()}
                        </div>
                    }
                </div>
            </div>
        )
    }

    const renderSearch = () => {
        return (
            <div className={classes['search_and_button']}>
                <SearchBox value={searchText}
                           onChange={search.bind(this)}
                           countFind={filteredItems.length}
                           showClear
                           margin={'0 0 11px 0'}
                           flexGrow
                           autoFocus={true}
                />
            </div>
        )
    }

    const renderLeftTab = () => {
        return (
            <div className={classes['box_content']}>
                {filteredItems.map((item: ISelector) => {
                    return renderRow(item, 'left', checkSelected(item.key))
                })}
            </div>
        )
    }

    const renderRightBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 38, flex: 'none'}}/>
                <div className={classes['box_border']} style={{height: 400}}>
                    {renderRightTab()}
                </div>
            </div>
        )
    }

    const renderRightTab = () => {
        const rows = filteredItems.filter((item: ISelector) => checkSelected(item.key))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map(row => renderRow(row, 'right', checkSelected(row.key))) : ''}
            </div>
        )
    }

    const renderRow = (item: ISelector, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={'rowItem' + item.key}
                 onClick={() => selectRow(item)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type={'classic'} onChange={e => e}
                              checked={checked}
                              margin={'0px 0px 0px 10px'}
                              label={''}
                    />
                    : null
                }

                <div className={classes['item_name']}>{item.text}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes['popup']}>
            <Header title={props.title} popupId={props.id || ''} onClose={() => close()}/>

            <BlockingElement fetching={false}>
                <Content className={props.multi ? classes['content_multi'] : classes['content']}>
                    {renderLeftBox()}

                    {!props.multi ? null : renderRightBox()}
                </Content>

                {props.multi ?
                    <Footer>
                        <Button type='apply'
                                icon='check'
                                onClick={() => onClickSave()}
                                className='marginLeft'
                        >Сохранить</Button>

                        <Button type='regular'
                                icon='arrow-rotate-left'
                                onClick={close.bind(this)}
                                className='marginLeft'
                        >Отменить</Button>
                    </Footer>
                    :
                    <div className={classes['footer_spacer']}/>
                }
            </BlockingElement>
        </Popup>
    )
}

PopupSelector.defaultProps = defaultProps
PopupSelector.displayName = 'PopupSelector'

export default function openPopupSelector(target: any, popupProps = {} as Props, displayOptions = {} as PopupDisplayOptions) {
    return openPopup(withStore(PopupSelector), popupProps, undefined, target, displayOptions)
}