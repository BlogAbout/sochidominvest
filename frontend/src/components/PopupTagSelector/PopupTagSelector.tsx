import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import TagService from '../../api/TagService'
import {ITag} from '../../@types/ITag'
import {PopupDisplayOptions, PopupProps} from '../../@types/IPopup'
import openPopupTagCreate from '../PopupTagCreate/PopupTagCreate'
import {openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../popup/Popup/Popup'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import Empty from '../ui/Empty/Empty'
import openContextMenu from '../ContextMenu/ContextMenu'
import ButtonAdd from '../form/ButtonAdd/ButtonAdd'
import SearchBox from '../SearchBox/SearchBox'
import CheckBox from '../form/CheckBox/CheckBox'
import Button from '../form/Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import classes from './PopupTagSelector.module.scss'

interface Props extends PopupProps {
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    selected: [],
    buttonAdd: true,
    multi: false,
    onAdd: () => {
        console.info('PopupTagSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupTagSelector onSelect', value)
    }
}

const PopupTagSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [tagFilter, setTagFilter] = useState<ITag[]>([])
    const [selectedTags, setSelectedTags] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingTagList, tags} = useTypedSelector(state => state.tagReducer)
    const {fetchTagList} = useActions()

    useEffect(() => {
        if (!tags.length || isUpdate) {
            fetchTagList()

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [tags])

    useEffect(() => {
        setFetching(fetchingTagList)
    }, [fetchingTagList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (tag: ITag) => {
        if (props.multi) {
            selectRowMulti(tag)
        } else if (props.onSelect !== null) {
            props.onSelect(tag.id ? [tag.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (tag: ITag) => {
        if (tag.id) {
            if (checkSelected(tag.id)) {
                setSelectedTags(selectedTags.filter((key: number) => key !== tag.id))
            } else {
                setSelectedTags([...selectedTags, tag.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedTags.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setTagFilter(tags.filter((tag: ITag) => {
                return tag.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setTagFilter(tags)
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupTagCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, tag: ITag) => {
        openPopupTagCreate(e.currentTarget, {
            tag: tag,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedTags)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, tag: ITag) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${tag.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (tag.id) {
                            TagService.removeTag(tag.id)
                                .then(() => {
                                    setFetching(false)
                                    setIsUpdate(true)
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data,
                                        onOk: close.bind(this)
                                    })

                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе справочника
    const onContextMenu = (e: React.MouseEvent, tag: ITag) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, tag)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, tag)})
            }

            openContextMenu(e, menuItems)
        }
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
                           onChange={(value: string) => search(value)}
                           countFind={tagFilter ? tagFilter.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && ['director', 'administrator', 'manager'].includes(role) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null}
            </div>
        )
    }

    const renderLeftTab = () => {
        return (
            <div className={classes['box_content']}>
                {tagFilter.length ?
                    tagFilter.map((tag: ITag) => renderRow(tag, 'left', checkSelected(tag.id)))
                    :
                    <Empty message={!tags.length ? 'Нет меток' : 'Метки не найдены'}/>
                }
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
        const rows = tagFilter.filter((tag: ITag) => checkSelected(tag.id))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map((tag: ITag) => renderRow(tag, 'right', checkSelected(tag.id))) : ''}
            </div>
        )
    }

    const renderRow = (tag: ITag, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={tag.id}
                 onClick={() => selectRow(tag)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, tag)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type='classic' onChange={e => e}
                              checked={checked}
                              margin='0px 0px 0px 10px'
                              label=''
                    />
                    : null
                }

                <div className={classes['item_name']}>{tag.name}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать метку' popupId={props.id ? props.id : ''} onClose={() => close()}/>

            <BlockingElement fetching={fetching}>
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

PopupTagSelector.defaultProps = defaultProps
PopupTagSelector.displayName = 'PopupTagSelector'

export default function openPopupTagSelector(target: any, popupProps = {} as Props, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(withStore(PopupTagSelector), popupProps, undefined, target, displayOptions)
}