import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import {ICompilation} from '../../@types/ICompilation'
import {PopupProps} from '../../@types/IPopup'
import CompilationService from '../../api/CompilationService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Header, Popup} from '../popup/Popup/Popup'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import Empty from '../ui/Empty/Empty'
import openContextMenu from '../ContextMenu/ContextMenu'
import ButtonAdd from '../form/ButtonAdd/ButtonAdd'
import SearchBox from '../SearchBox/SearchBox'
import openPopupAlert from '../PopupAlert/PopupAlert'
import openPopupCompilationCreate from '../PopupCompilationCreate/PopupCompilationCreate'
import showBackgroundBlock from '../ui/BackgroundBlock/BackgroundBlock'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import classes from './PopupCompilationSelector.module.scss'

interface Props extends PopupProps {
    buildingId: number

    onSave(): void
}

const defaultProps: Props = {
    buildingId: 0,
    onSave: () => {
        console.info('PopupCompilationSelector onSave')
    }
}

// Todo: Удалить, не используется, перенести методы
const PopupCompilationSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [filterCompilation, setFilterCompilation] = useState<ICompilation[]>([])
    const [fetching, setFetching] = useState(false)

    const {fetching: fetchingCompilationList, compilations} = useTypedSelector(state => state.compilationReducer)
    const {fetchCompilationList} = useActions()

    useEffect(() => {
        return () => {
            removePopup(props.blockId || '')
        }
    }, [props.blockId])

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

    const findSelectedCompilationOld = () => {
        if (!compilations || !compilations.length) {
            return null
        }

        const findCompilation = compilations.find((compilation: ICompilation) => compilation.buildings && compilation.buildings.length && compilation.buildings.includes(props.buildingId))

        return findCompilation ? findCompilation.id : null
    }

    const updateSelectedCompilation = (compilationId: number) => {
        const compilationIdOld = findSelectedCompilationOld()
        setFetching(true)

        CompilationService.addBuildingInCompilation(compilationId, props.buildingId, compilationIdOld)
            .then(() => {
                props.onSave()
                close()
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

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (compilation: ICompilation) => {
        if (compilation.id) {
            updateSelectedCompilation(compilation.id)
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (compilation: ICompilation) => {
        console.log('checkSelected', !!(compilation.buildings && compilation.buildings.length && compilation.buildings.includes(props.buildingId)))
        return !!(compilation.buildings && compilation.buildings.length && compilation.buildings.includes(props.buildingId))
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterCompilation(compilations.filter((compilation: ICompilation) => {
                return compilation.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterCompilation(compilations)
        }
    }

    // Добавление нового элемента
    const onClickAdd = () => {
        openPopupCompilationCreate(document.body, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (compilation: ICompilation) => {
        openPopupCompilationCreate(document.body, {
            compilation: compilation,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Удаление элемента справочника
    const onClickDelete = (compilation: ICompilation) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить подборку "${compilation.name}"? Все объекты из нее также будут удалены!`,
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

        const menuItems = [
            {text: 'Редактировать', onClick: () => onClickEdit(compilation)},
            {text: 'Удалить', onClick: () => onClickDelete(compilation)}
        ]

        openContextMenu(e, menuItems)
    }

    const renderLeftBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 36}}>
                    {renderSearch()}
                </div>
                <div className={classes['box_border']} style={{height: 300}}>
                    {renderLeftTab()}
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

                <ButtonAdd onClick={onClickAdd.bind(this)}/>
            </div>
        )
    }

    const renderLeftTab = () => {
        return (
            <div className={classes['box_content']}>
                {filterCompilation.length ?
                    filterCompilation.map((compilation: ICompilation) => renderRow(compilation, 'left', checkSelected(compilation)))
                    : <Empty message={!compilations.length ? 'Нет подборок' : 'Подборки не найдены'}/>
                }
            </div>
        )
    }

    const renderRow = (compilation: ICompilation, side: string, checked: boolean) => {
        console.log('checked', checked)
        return (
            <div className={classes['row']}
                 key={compilation.id}
                 onClick={() => selectRow(compilation)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, compilation)}
            >
                <div className={classes['item_name']}>{compilation.name}</div>

                {checked && <div className={classes['selected_icon']}/>}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать подборку' popupId={props.id || ''}/>

            <BlockingElement fetching={fetching}>
                <Content className={classes.content}>
                    {renderLeftBox()}
                </Content>
            </BlockingElement>
        </Popup>
    )
}

PopupCompilationSelector.defaultProps = defaultProps
PopupCompilationSelector.displayName = 'PopupCompilationSelector'

export default function openPopupCompilationSelector(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupCompilationSelector), popupProps, undefined, block, displayOptions)
}