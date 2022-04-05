import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import BuildingService from '../../api/BuildingService'
import {IBuilding} from '../../@types/IBuilding'
import {PopupDisplayOptions, PopupProps} from '../../@types/IPopup'
import openPopupBuildingCreate from '../PopupBuildingCreate/PopupBuildingCreate'
import {openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import Empty from '../Empty/Empty'
import openContextMenu from '../ContextMenu/ContextMenu'
import ButtonAdd from '../ButtonAdd/ButtonAdd'
import SearchBox from '../SearchBox/SearchBox'
import CheckBox from '../CheckBox/CheckBox'
import Button from '../Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import classes from './PopupBuildingSelector.module.scss'

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
        console.info('PopupBuildingSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupBuildingSelector onSelect', value)
    }
}

const PopupBuildingSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [selectedBuildings, setSelectedBuildings] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingBuildingList, buildings} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (!buildings.length || isUpdate) {
            fetchBuildingList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [buildings])

    useEffect(() => {
        setFetching(fetchingBuildingList)
    }, [fetchingBuildingList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (building: IBuilding) => {
        if (props.multi) {
            selectRowMulti(building)
        } else if (props.onSelect !== null) {
            props.onSelect(building.id ? [building.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (building: IBuilding) => {
        if (building.id) {
            if (checkSelected(building.id)) {
                setSelectedBuildings(selectedBuildings.filter((key: number) => key !== building.id))
            } else {
                setSelectedBuildings([...selectedBuildings, building.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedBuildings.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterBuilding(buildings.filter((building: IBuilding) => {
                return building.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterBuilding(buildings)
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupBuildingCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, building: IBuilding) => {
        openPopupBuildingCreate(e.currentTarget, {
            building: building,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedBuildings)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, building: IBuilding) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${building.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (building.id) {
                            BuildingService.removeBuilding(building.id)
                                .then(() => {
                                    setIsUpdate(true)
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data,
                                        onOk: close.bind(this)
                                    })
                                })
                                .finally(() => {
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
    const onContextMenu = (e: React.MouseEvent, building: IBuilding) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, building)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, building)})
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
                           countFind={filterBuilding ? filterBuilding.length : 0}
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
                {filterBuilding.length ?
                    filterBuilding.map((building: IBuilding) => renderRow(building, 'left', checkSelected(building.id)))
                    :
                    <Empty
                        message={!buildings.length ? 'Нет объектов недвижимости' : 'Объекты недвижимости не найдены'}/>
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
        const rows = filterBuilding.filter((building: IBuilding) => checkSelected(building.id))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map((building: IBuilding) => renderRow(building, 'right', checkSelected(building.id))) : ''}
            </div>
        )
    }

    const renderRow = (building: IBuilding, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={building.id}
                 onClick={() => selectRow(building)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, building)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type={'classic'} onChange={e => e}
                              checked={checked}
                              margin={'0px 0px 0px 10px'}
                              label={''}
                    />
                    : null
                }

                <div className={classes['item_name']}>{building.name}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать объект недвижимости' popupId={props.id ? props.id : ''} onClose={() => close()}/>

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

PopupBuildingSelector.defaultProps = defaultProps
PopupBuildingSelector.displayName = 'PopupBuildingSelector'

export default function openPopupBuildingSelector(target: any, popupProps = {} as Props, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(withStore(PopupBuildingSelector), popupProps, undefined, target, displayOptions)
}