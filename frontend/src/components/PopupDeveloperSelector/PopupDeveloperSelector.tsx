import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import {PopupProps} from '../../@types/IPopup'
import {IDeveloper} from '../../@types/IDeveloper'
import DeveloperService from '../../api/DeveloperService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import Empty from '../Empty/Empty'
import openContextMenu from '../ContextMenu/ContextMenu'
import openPopupDeveloperCreate from '../PopupDeveloperCreate/PopupDeveloperCreate'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import ButtonAdd from '../ButtonAdd/ButtonAdd'
import SearchBox from '../SearchBox/SearchBox'
import CheckBox from '../CheckBox/CheckBox'
import Button from '../Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import classes from './PopupDeveloperSelector.module.scss'

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
        console.info('PopupDeveloperSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupDeveloperSelector onSelect', value)
    }
}

const PopupDeveloperSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterDevelopers, setFilterDevelopers] = useState<IDeveloper[]>([])
    const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {fetching: fetchingDeveloperList, developers} = useTypedSelector(state => state.developerReducer)
    const {fetchDeveloperList} = useActions()

    useEffect(() => {
        if (!developers.length || isUpdate) {
            fetchDeveloperList({active: [0, 1]})

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [developers])

    useEffect(() => {
        setFetching(fetchingDeveloperList)
    }, [fetchingDeveloperList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (developer: IDeveloper) => {
        if (props.multi) {
            selectRowMulti(developer)
        } else if (props.onSelect !== null) {
            props.onSelect(developer.id ? [developer.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (developer: IDeveloper) => {
        if (developer.id) {
            if (checkSelected(developer.id)) {
                setSelectedDevelopers(selectedDevelopers.filter((key: number) => key !== developer.id))
            } else {
                setSelectedDevelopers([...selectedDevelopers, developer.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedDevelopers.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterDevelopers(developers.filter((developer: IDeveloper) => {
                return developer.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterDevelopers(developers)
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupDeveloperCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, developer: IDeveloper) => {
        openPopupDeveloperCreate(e.currentTarget, {
            developer: developer,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedDevelopers)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, developer: IDeveloper) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${developer.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (developer.id) {
                            DeveloperService.removeDeveloper(developer.id)
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
    const onContextMenu = (e: React.MouseEvent, developer: IDeveloper) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, developer)},
            {text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, developer)}
        ]

        openContextMenu(e, menuItems)
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
                           countFind={filterDevelopers ? filterDevelopers.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && <ButtonAdd onClick={onClickAdd.bind(this)}/>}
            </div>
        )
    }

    const renderLeftTab = () => {
        return (
            <div className={classes['box_content']}>
                {filterDevelopers.length ?
                    filterDevelopers.map((developer: IDeveloper) => renderRow(developer, 'left', checkSelected(developer.id)))
                    :
                    <Empty message={!developers.length ? 'Нет застройщиков' : 'Застройщики не найдены'}/>
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
        const rows = filterDevelopers.filter((developer: IDeveloper) => checkSelected(developer.id))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map((developer: IDeveloper) => renderRow(developer, 'right', checkSelected(developer.id))) : ''}
            </div>
        )
    }

    const renderRow = (developer: IDeveloper, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={developer.id}
                 onClick={() => selectRow(developer)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, developer)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type={'classic'} onChange={e => e}
                              checked={checked}
                              margin={'0px 0px 0px 10px'}
                              label={''}
                    />
                    : null
                }

                <div className={classes['item_name']}>{developer.name}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать застройщика' popupId={props.id ? props.id : ''} onClose={() => close()}/>

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

PopupDeveloperSelector.defaultProps = defaultProps
PopupDeveloperSelector.displayName = 'PopupDeveloperSelector'

export default function openPopupDeveloperSelector(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupDeveloperSelector), popupProps, undefined, block, displayOptions)
}