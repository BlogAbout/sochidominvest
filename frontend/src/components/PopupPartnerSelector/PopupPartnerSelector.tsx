import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import PartnerService from '../../api/PartnerService'
import {IPartner} from '../../@types/IPartner'
import {PopupDisplayOptions, PopupProps} from '../../@types/IPopup'
import openPopupPartnerCreate from '../popup/PopupPartnerCreate/PopupPartnerCreate'
import {openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../popup/Popup/Popup'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import Empty from '../Empty/Empty'
import openContextMenu from '../ContextMenu/ContextMenu'
import ButtonAdd from '../ButtonAdd/ButtonAdd'
import SearchBox from '../SearchBox/SearchBox'
import CheckBox from '../form/CheckBox/CheckBox'
import Button from '../form/Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import classes from './PopupPartnerSelector.module.scss'

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
        console.info('PopupPartnerSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupPartnerSelector onSelect', value)
    }
}

const PopupPartnerSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterPartner, setFilterPartner] = useState<IPartner[]>([])
    const [selectedPartners, setSelectedPartners] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingPartnerList, partners} = useTypedSelector(state => state.partnerReducer)
    const {fetchPartnerList} = useActions()

    useEffect(() => {
        if (!partners.length || isUpdate) {
            fetchPartnerList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [partners])

    useEffect(() => {
        setFetching(fetchingPartnerList)
    }, [fetchingPartnerList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (partner: IPartner) => {
        if (props.multi) {
            selectRowMulti(partner)
        } else if (props.onSelect !== null) {
            props.onSelect(partner.id ? [partner.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (partner: IPartner) => {
        if (partner.id) {
            if (checkSelected(partner.id)) {
                setSelectedPartners(selectedPartners.filter((key: number) => key !== partner.id))
            } else {
                setSelectedPartners([...selectedPartners, partner.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedPartners.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterPartner(partners.filter((partner: IPartner) => {
                return partner.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterPartner(partners)
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupPartnerCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, partner: IPartner) => {
        openPopupPartnerCreate(e.currentTarget, {
            partner: partner,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedPartners)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, partner: IPartner) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${partner.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (partner.id) {
                            PartnerService.removePartner(partner.id)
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
    const onContextMenu = (e: React.MouseEvent, partner: IPartner) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, partner)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, partner)})
            }

            openContextMenu(e, menuItems)
        }
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
                           countFind={filterPartner ? filterPartner.length : 0}
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
                {filterPartner.length ?
                    filterPartner.map((partner: IPartner) => renderRow(partner, 'left', checkSelected(partner.id)))
                    :
                    <Empty message={!partners.length ? 'Нет статей' : 'Статьи не найдены'}/>
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
        const rows = filterPartner.filter((partner: IPartner) => checkSelected(partner.id))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map((partner: IPartner) => renderRow(partner, 'right', checkSelected(partner.id))) : ''}
            </div>
        )
    }

    const renderRow = (partner: IPartner, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={partner.id}
                 onClick={() => selectRow(partner)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, partner)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type='classic' onChange={e => e}
                              checked={checked}
                              margin='0px 0px 0px 10px'
                              label=''
                    />
                    : null
                }

                <div className={classes['item_name']}>{partner.name}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать партнера' popupId={props.id || ''} onClose={() => close()}/>

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

PopupPartnerSelector.defaultProps = defaultProps
PopupPartnerSelector.displayName = 'PopupPartnerSelector'

export default function openPopupPartnerSelector(target: any, popupProps = {} as Props, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(withStore(PopupPartnerSelector), popupProps, undefined, target, displayOptions)
}