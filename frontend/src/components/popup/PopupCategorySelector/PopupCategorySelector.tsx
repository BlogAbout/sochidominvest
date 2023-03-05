import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../../hoc/withStore'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import StoreService from '../../../api/StoreService'
import {ICategory} from '../../../@types/IStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import openPopupCategoryCreate from '../PopupCategoryCreate/PopupCategoryCreate'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import openContextMenu from '../../ContextMenu/ContextMenu'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'
import SearchBox from '../../SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import classes from './PopupCategorySelector.module.scss'

interface Props extends PopupProps {
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean
    onlyRent?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    selected: [],
    buttonAdd: true,
    multi: false,
    onlyRent: false,
    onAdd: () => {
        console.info('PopupCategorySelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupCategorySelector onSelect', value)
    }
}

const PopupCategorySelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterCategory, setFilterCategory] = useState<ICategory[]>([])
    const [selectedCategories, setSelectedCategories] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingCategoryList, categories} = useTypedSelector(state => state.storeReducer)
    const {fetchCategoryList} = useActions()

    useEffect(() => {
        if (!categories.length || isUpdate) {
            fetchCategoryList({active: [0, 1]})

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [categories])

    useEffect(() => {
        setFetching(fetchingCategoryList)
    }, [fetchingCategoryList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (category: ICategory) => {
        if (props.multi) {
            selectRowMulti(category)
        } else if (props.onSelect !== null) {
            props.onSelect(category.id ? [category.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (category: ICategory) => {
        if (category.id) {
            if (checkSelected(category.id)) {
                setSelectedCategories(selectedCategories.filter((key: number) => key !== category.id))
            } else {
                setSelectedCategories([...selectedCategories, category.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedCategories.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterCategory(categories.filter((category: ICategory) => {
                return category.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterCategory(categories)
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupCategoryCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, category: ICategory) => {
        openPopupCategoryCreate(e.currentTarget, {
            category: category,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedCategories)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, category: ICategory) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${category.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (category.id) {
                            StoreService.removeCategory(category.id)
                                .then(() => setIsUpdate(true))
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data,
                                        onOk: close.bind(this)
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе справочника
    const onContextMenu = (e: React.MouseEvent, category: ICategory) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, category)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, category)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const renderSearch = () => {
        return (
            <div className={classes['search']}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterCategory ? filterCategory.length : 0}
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

    const renderListBox = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {filterCategory.length
                        ? filterCategory.map((category: ICategory) => renderRow(category, 'left', checkSelected(category.id)))
                        : <Empty message={
                            !filterCategory.length ? 'Нет категорий товаров' : 'Категории товаров не найдены'
                        }/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterCategory.filter((category: ICategory) => checkSelected(category.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((category: ICategory) => renderRow(category, 'right', checkSelected(category.id)))
                        : <Empty message='Категории товаров не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (category: ICategory, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={category.id}
                 onClick={() => selectRow(category)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, category)}
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

                <div className={classes.name}>{category.name}</div>

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
        <Popup className={classes.PopupCategorySelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Выбрать категории товаров</Title>

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

PopupCategorySelector.defaultProps = defaultProps
PopupCategorySelector.displayName = 'PopupCategorySelector'

export default function openPopupCategorySelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupCategorySelector), popupProps, undefined, block, displayOptions)
}