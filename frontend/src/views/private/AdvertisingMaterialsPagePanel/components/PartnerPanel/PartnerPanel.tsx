import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IPartner} from '../../../../../@types/IPartner'
import {IFilterBase} from '../../../../../@types/IFilter'
import PartnerService from '../../../../../api/PartnerService'
import {compareText} from '../../../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../../../helpers/utilHelper'
import Title from '../../../../../components/ui/Title/Title'
import FilterBase from '../../../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import PartnerListContainer from '../../../../../components/container/PartnerListContainer/PartnerListContainer'
import openPopupPartnerCreate from '../../../../../components/popup/PopupPartnerCreate/PopupPartnerCreate'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './PartnerPanel.module.scss'

const PartnerPanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterPartner, setFilterPartner] = useState<IPartner[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('partners'))
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {partners, fetching: fetchingPartner} = useTypedSelector(state => state.partnerReducer)
    const {fetchPartnerList} = useActions()

    useEffect(() => {
        if (isUpdate || !partners.length) {
            fetchPartnerList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [partners, selectedType])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!partners || !partners.length) {
            setFilterPartner([])
        }

        if (value !== '') {
            setFilterPartner(partners.filter((partner: IPartner) => {
                return (!selectedType.length || selectedType.includes(partner.type)) && compareText(partner.name, value)
            }))
        } else {
            setFilterPartner(!selectedType.length ? partners : partners.filter((partner: IPartner) => selectedType.includes(partner.type)))
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('partners', value)
    }

    const onClickHandler = (partner: IPartner) => {
        navigate('/panel/partner/' + partner.id)
    }

    const onAddHandler = () => {
        openPopupPartnerCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование
    const onEditHandler = (partner: IPartner) => {
        openPopupPartnerCreate(document.body, {
            partner: partner,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (partner: IPartner) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${partner.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (partner.id) {
                            setFetching(true)

                            PartnerService.removePartner(partner.id)
                                .then(() => {
                                    onSaveHandler()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
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

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, partner: IPartner) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(partner)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(partner)})
            }

            openContextMenu(e, menuItems)
        }
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'partner',
            title: 'Партнеры',
            icon: 'handshake-angle',
            active: selectedType.includes('partner'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'sponsor',
            title: 'Спонсоры',
            icon: 'money-bill-1-wave',
            active: selectedType.includes('sponsor'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.PartnerPanel}>
            <PageInfo title='Спонсоры и партнеры'/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       layout={layout}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                       showChangeLayout
                >Спонсоры и партнеры</Title>

                <PartnerListContainer partners={filterPartner}
                                      fetching={fetching || fetchingPartner}
                                      layout={layout}
                                      onClick={onClickHandler.bind(this)}
                                      onEdit={onEditHandler.bind(this)}
                                      onRemove={onRemoveHandler.bind(this)}
                                      onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

PartnerPanel.displayName = 'PartnerPanel'

export default PartnerPanel