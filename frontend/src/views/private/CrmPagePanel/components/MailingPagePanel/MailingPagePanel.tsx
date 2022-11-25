import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {compareText} from '../../../../../helpers/filterHelper'
import {IMailing} from '../../../../../@types/IMailing'
import MailingService from '../../../../../api/MailingService'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import Title from '../../../../../components/ui/Title/Title'
import MailingContainer from '../../../../../components/container/MailingContainer/MailingContainer'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupMailingCreate from '../../../../../components/popup/PopupMailingCreate/PopupMailingCreate'
import openPopupMailingInfo from '../../../../../components/popup/PopupMailingInfo/PopupMailingInfo'
import classes from './MailingPagePanel.module.scss'
import {IFilterBase} from "../../../../../@types/IFilter";
import FilterBase from "../../../../../components/ui/FilterBase/FilterBase";

const MailingPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [selectedType, setSelectedType] = useState<number[]>([])
    const [mailings, setMailings] = useState<IMailing[]>([])
    const [filterMailing, setFilterMailing] = useState<IMailing[]>([])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate) {
            MailingService.fetchMailings({active: [0, 1]})
                .then((response: any) => {
                    setMailings(response.data)
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

        setIsUpdate(false)
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [mailings, selectedType])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!mailings || !mailings.length) {
            setFilterMailing([])
        }

        if (value !== '') {
            setFilterMailing(mailings.filter((mailing: IMailing) => {
                return compareText(mailing.name, value) && (!selectedType.length || selectedType.includes(mailing.status))
            }))
        } else {
            setFilterMailing(mailings.filter((mailing: IMailing) => {
                return !selectedType.length || selectedType.includes(mailing.status)
            }))
        }
    }

    // Создание
    const onAddHandler = () => {
        openPopupMailingCreate(document.body, {
            onSave: onSaveHandler.bind(this)
        })
    }

    // Клик на строке
    const onClickHandler = (mailing: IMailing) => {
        openPopupMailingInfo(document.body, {
            mailing: mailing
        })
    }

    // Редактирование
    const onEditHandler = (mailing: IMailing) => {
        openPopupMailingCreate(document.body, {
            mailing: mailing,
            onSave: onSaveHandler.bind(this)
        })
    }

    // Удаление
    const onRemoveHandler = (mailing: IMailing) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${mailing.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (mailing.id) {
                            setFetching(true)

                            MailingService.removeMailing(mailing.id)
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

    const onRunHandler = (mailing: IMailing, isRun = false) => {
        const updateMailing: IMailing = {...mailing}
        updateMailing.status = isRun ? 1 : 0

        setFetching(true)

        MailingService.saveMailing(updateMailing)
            .then((response: any) => {
                onSaveHandler()

                const newMailing: IMailing = response.data
                if (newMailing.status === 1) {
                    openPopupAlert(document.body, {
                        title: 'Рассылка запущена',
                        text: 'Рассылка успешно запущена. Отправка сообщений будет происходит автоматически, без Вашего участия.'
                    })
                }
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

    // Контекстное меню
    const onContextMenu = (e: React.MouseEvent, mailing: IMailing) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [
                {
                    text: 'Редактировать',
                    onClick: () => onEditHandler(mailing)
                },
                {
                    text: 'Удалить',
                    onClick: () => onRemoveHandler(mailing)
                }
            ]

            if (mailing.status === 1) {
                menuItems.unshift({
                    text: 'Остановить',
                    onClick: () => onRunHandler(mailing, false)
                })
            } else if (mailing.status === 0) {
                menuItems.unshift({
                    text: 'Запустить',
                    onClick: () => onRunHandler(mailing, true)
                })
            }

            openContextMenu(e, menuItems)
        }
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(+type)) {
            setSelectedType(selectedType.filter((item: number) => item !== +type))
        } else {
            setSelectedType([+type, ...selectedType])
        }
    }

    const filterBaseButtons: IFilterBase[] = [
        {
            key: '0',
            title: 'Остановленные',
            icon: 'stop',
            active: selectedType.includes(0),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: '1',
            title: 'Запущенные',
            icon: 'play',
            active: selectedType.includes(1),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: '2',
            title: 'Завершенные',
            icon: 'check',
            active: selectedType.includes(2),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.MailingPagePanel}>
            <PageInfo title='Рассылки'/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Рассылки</Title>

                <MailingContainer mailings={filterMailing}
                                  fetching={fetching}
                                  onClick={onClickHandler.bind(this)}
                                  onEdit={onEditHandler.bind(this)}
                                  onRemove={onRemoveHandler.bind(this)}
                                  onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

MailingPagePanel.displayName = 'MailingPagePanel'

export default MailingPagePanel