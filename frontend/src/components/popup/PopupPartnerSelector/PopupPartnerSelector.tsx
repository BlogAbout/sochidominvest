import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../../hoc/withStore'
import PartnerService from '../../../api/PartnerService'
import {IPartner} from '../../../@types/IPartner'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import openPopupPartnerCreate from '../PopupPartnerCreate/PopupPartnerCreate'
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
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
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

    const renderSearch = () => {
        return (
            <div className={classes.search}>
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

    const renderListBox = () => {
        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {filterPartner.length
                        ? filterPartner.map((partner: IPartner) => renderRow(partner, 'left', checkSelected(partner.id)))
                        : <Empty message={!partners.length ? 'Нет партнеров' : 'Партнеры не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterPartner.filter((partner: IPartner) => checkSelected(partner.id))

        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((partner: IPartner) => renderRow(partner, 'right', checkSelected(partner.id)))
                        : <Empty message='Партнеры не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (partner: IPartner, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={partner.id}
                 onClick={() => selectRow(partner)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, partner)}
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

                <div className={classes.name}>{partner.name}</div>

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
        <Popup className={classes.PopupPartnerSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Выбрать партнеров</Title>

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

PopupPartnerSelector.defaultProps = defaultProps
PopupPartnerSelector.displayName = 'PopupPartnerSelector'

export default function openPopupPartnerSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupPartnerSelector), popupProps, undefined, block, displayOptions)
}