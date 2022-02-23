import React, {useEffect, useState} from 'react'
import {ITag} from '../../@types/ITag'
import {PopupProps} from '../../@types/IPopup'
import openPopupTagCreate from '../PopupTagCreate/PopupTagCreate'
import {openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import Empty from '../Empty/Empty'
import openContextMenu from '../ContextMenu/ContextMenu'
import ButtonAdd from '../ButtonAdd/ButtonAdd'
import SearchBox from '../SearchBox/SearchBox'
import openPopupAlert from '../PopupAlert/PopupAlert'
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

    // const {fetching, tags} = useTypedSelector(state => state.tagReducer)
    // const {fetchTagList, removeTag} = useActions()
    const tags: ITag[] = []
    const fetching: boolean = false

    useEffect(() => {
        if (!tags.length || isUpdate) {
            // fetchTagList(null)

            setIsUpdate(false)
        } else {
            search(searchText)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [tags])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Нажатие на строку
    const selectRow = (tag: ITag) => {
        if (props.onSelect !== null) {
            props.onSelect(tag.id ? [tag.id] : [0])
            close()
        }
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

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, tag: ITag) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${tag.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        removeTagHandler(tag)
                            .then(() => setIsUpdate(true))
                            .catch((error) => {
                                console.error('Ошибка удаления метки', error)

                                openPopupAlert(document.body, {
                                    text: 'Ошибка удаления метки',
                                    onOk: close.bind(this)
                                })
                            })
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const removeTagHandler = async (tag: ITag) => {
        // Todo: await removeTag(tag)
    }

    // Открытие контекстного меню на элементе справочника
    const onContextMenu = (e: React.MouseEvent, tag: ITag) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, tag)},
            {text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, tag)}
        ]

        openContextMenu(e, menuItems)
    }

    const renderSearch = () => {
        return (
            <div className={classes['search_and_button']}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={tagFilter ? tagFilter.length : 0}
                           showClear
                           margin={'0 0 11px 0'}
                           flexGrow
                           autoFocus={true}
                />

                {props.buttonAdd && <ButtonAdd onClick={onClickAdd.bind(this)} margin={'0 0 0 11px'}/>}
            </div>
        )
    }

    const renderLeftTab = () => {
        return (
            <div className={classes['box_content']}>
                {tagFilter.length ?
                    tagFilter.map(tag => renderRow(tag))
                    :
                    <Empty message={tags ? 'Метки не найдены' : 'Нет доступных меток'}/>
                }
            </div>
        )
    }

    const renderRow = (tag: ITag) => {
        return (
            <div className={classes['row']}
                 key={tag.id}
                 onClick={() => selectRow(tag)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, tag)}
            >
                <div className={classes['text']} title={tag.name}>{tag.name}</div>

                {tag.id && props.selected && props.selected.includes(tag.id) &&
                <div className={classes['selected_icon']}/>}
            </div>
        )
    }

    return (
        <Popup className={classes['popup']}>
            <Header title='Выбрать метку' popupId={props.id ? props.id : ''} onClose={() => close()}/>

            <BlockingElement fetching={fetching}>
                <Content className={classes['content']}>
                    <div className={classes['box_no_menu']}>
                        <div style={{height: 38}}>{renderSearch()}</div>

                        <div className={classes['box_border']} style={{height: 393}}>
                            {renderLeftTab()}
                        </div>
                    </div>
                </Content>
            </BlockingElement>
        </Popup>
    )
}

PopupTagSelector.defaultProps = defaultProps
PopupTagSelector.displayName = 'PopupTagSelector'

export default function openPopupTagSelector(target: any, popupProps = {} as Props, displayOptions = {}) {
    return openPopup(PopupTagSelector, popupProps, undefined, target, displayOptions)
}