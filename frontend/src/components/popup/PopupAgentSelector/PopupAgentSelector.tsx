import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IAgent} from '../../../@types/IAgent'
import AgentService from '../../../api/AgentService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import openContextMenu from '../../ContextMenu/ContextMenu'
import openPopupAgentCreate from '../PopupAgentCreate/PopupAgentCreate'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'
import SearchBox from '../../SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import classes from './PopupAgentSelector.module.scss'

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
        console.info('PopupAgentSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupAgentSelector onSelect', value)
    }
}

const PopupAgentSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [agents, setAgents] = useState<IAgent[]>([])
    const [filterAgents, setFilterAgents] = useState<IAgent[]>([])
    const [selectedAgents, setSelectedAgents] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role, userId} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate) {
            loadAgentsHandler()

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [agents])

    const loadAgentsHandler = () => {
        setFetching(true)

        AgentService.fetchAgents({active: [0, 1], author: [userId]})
            .then((response: any) => {
                setAgents(response.data)
            })
            .catch((error: any) => {
                console.error('Ошибка загрузки агентств пользователя', error)
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
    const selectRow = (agent: IAgent) => {
        if (props.multi) {
            selectRowMulti(agent)
        } else if (props.onSelect !== null) {
            props.onSelect(agent.id ? [agent.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (agent: IAgent) => {
        if (agent.id) {
            if (checkSelected(agent.id)) {
                setSelectedAgents(selectedAgents.filter((key: number) => key !== agent.id))
            } else {
                setSelectedAgents([...selectedAgents, agent.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedAgents.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterAgents(agents.filter((agent: IAgent) => {
                return agent.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterAgents(agents)
        }
    }

    // Добавление нового элемента
    const onClickAdd = () => {
        openPopupAgentCreate(document.body, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, agent: IAgent) => {
        openPopupAgentCreate(document.body, {
            agent: agent,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedAgents)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, agent: IAgent) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${agent.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (agent.id) {
                            AgentService.removeAgent(agent.id)
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
    const onContextMenu = (e: React.MouseEvent, agent: IAgent) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, agent)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, agent)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const renderSearch = () => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterAgents ? filterAgents.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && ['director', 'administrator', 'manager'].includes(role) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null
                }
            </div>
        )
    }

    const renderListBox = () => {
        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {filterAgents.length ?
                        filterAgents.map((agent: IAgent) => renderRow(agent, 'left', checkSelected(agent.id)))
                        : <Empty message={!agents.length ? 'Нет агентств' : 'Агентства не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterAgents.filter((agent: IAgent) => checkSelected(agent.id))

        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((agent: IAgent) => renderRow(agent, 'right', checkSelected(agent.id)))
                        : <Empty message='Агентства не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (agent: IAgent, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={agent.id}
                 onClick={() => selectRow(agent)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, agent)}
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

                <div className={classes.name}>{agent.name}</div>

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
        <Popup className={classes.PopupAgentSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Выбрать агентства</Title>

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

PopupAgentSelector.defaultProps = defaultProps
PopupAgentSelector.displayName = 'PopupAgentSelector'

export default function openPopupAgentSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupAgentSelector), popupProps, undefined, block, displayOptions)
}