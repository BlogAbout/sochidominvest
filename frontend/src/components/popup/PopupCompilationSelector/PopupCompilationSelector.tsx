import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import CompilationService from '../../../api/CompilationService'
import {ICompilation} from '../../../@types/ICompilation'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {openPopup, removePopup} from '../../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../Empty/Empty'
import openContextMenu from '../../ContextMenu/ContextMenu'
import ButtonAdd from '../../ButtonAdd/ButtonAdd'
import SearchBox from '../../SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './PopupCompilationSelector.module.scss'

interface Props extends PopupProps {
    exclude?: number[]
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    exclude: [],
    selected: [],
    buttonAdd: true,
    multi: false,
    onAdd: () => {
        console.info('PopupCompilationSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupCompilationSelector onSelect', value)
    }
}

const PopupCompilationSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterCompilation, setFilterCompilation] = useState<ICompilation[]>([])
    const [selectedCompilations, setSelectedCompilations] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingCompilationList, compilations} = useTypedSelector(state => state.compilationReducer)
    const {fetchCompilationList} = useActions()

    useEffect(() => {
        if (!compilations.length || isUpdate) {
            fetchCompilationList()

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [compilations])

    useEffect(() => {
        setFetching(fetchingCompilationList)
    }, [fetchingCompilationList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (compilation: ICompilation) => {
        if (props.multi) {
            selectRowMulti(compilation)
        } else if (props.onSelect !== null) {
            props.onSelect(compilation.id ? [compilation.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (compilation: ICompilation) => {
        if (compilation.id) {
            if (checkSelected(compilation.id)) {
                setSelectedCompilations(selectedCompilations.filter((key: number) => key !== compilation.id))
            } else {
                setSelectedCompilations([...selectedCompilations, compilation.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedCompilations.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterCompilation(compilations.filter((compilation: ICompilation) => {
                return compilation.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 && (!compilation.id || !props.exclude || !props.exclude.length || !props.exclude.includes(compilation.id))
            }))
        } else {
            setFilterCompilation(compilations.filter((compilation: ICompilation) => !compilation.id || (props.exclude && !props.exclude.includes(compilation.id))))
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {

    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, compilation: ICompilation) => {

    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedCompilations)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, compilation: ICompilation) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${compilation.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (compilation.id) {
                            CompilationService.removeCompilation(compilation.id)
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
    const onContextMenu = (e: React.MouseEvent, compilation: ICompilation) => {
        e.preventDefault()

        // if (['director', 'administrator', 'manager'].includes(role)) {
        //     const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, compilation)}]
        //
        //     if (['director', 'administrator'].includes(role)) {
        //         menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, compilation)})
        //     }
        //
        //     openContextMenu(e, menuItems)
        // }
    }

    const renderLeftBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 36}}>
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
                           countFind={filterCompilation ? filterCompilation.length : 0}
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
                {filterCompilation.length ?
                    filterCompilation.map((compilation: ICompilation) => renderRow(compilation, 'left', checkSelected(compilation.id)))
                    :
                    <Empty message={!compilations.length ? 'Нет подборок' : 'Подборки не найдены'}/>
                }
            </div>
        )
    }

    const renderRightBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 36, flex: 'none'}}/>
                <div className={classes['box_border']} style={{height: 400}}>
                    {renderRightTab()}
                </div>
            </div>
        )
    }

    const renderRightTab = () => {
        const rows = filterCompilation.filter((compilation: ICompilation) => checkSelected(compilation.id))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map((compilation: ICompilation) => renderRow(compilation, 'right', checkSelected(compilation.id))) : ''}
            </div>
        )
    }

    const renderRow = (compilation: ICompilation, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={compilation.id}
                 onClick={() => selectRow(compilation)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, compilation)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type='classic' onChange={e => e}
                              checked={checked}
                              margin='0px 0px 0px 10px'
                              label=''
                    />
                    : null
                }

                <div className={classes['item_name']}>{compilation.name}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать подборку' popupId={props.id || ''} onClose={() => close()}/>

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

PopupCompilationSelector.defaultProps = defaultProps
PopupCompilationSelector.displayName = 'PopupCompilationSelector'

export default function openPopupCompilationSelector(target: any, popupProps = {} as Props, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(withStore(PopupCompilationSelector), popupProps, undefined, target, displayOptions)
}