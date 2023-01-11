import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import AgentService from '../../../../../api/AgentService'
import {IAgent} from '../../../../../@types/IAgent'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../Empty/Empty'
import openPopupAlert from '../../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import openPopupAgentSelector from '../../../PopupAgentSelector/PopupAgentSelector'
import classes from './AgentList.module.scss'

interface Props {
    selected: number[]

    onSelect(value: number[]): void
}

const defaultProps: Props = {
    selected: [],
    onSelect: (value: number[]) => {
        console.info('BuildingList onSelect', value)
    }
}

const AgentList: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)
    const [selectedAgents, setSelectedAgents] = useState<IAgent[]>([])

    useEffect(() => {
        loadAgentsHandler()
    }, [props.selected])

    const loadAgentsHandler = () => {
        if (!props.selected || !props.selected.length) {
            setSelectedAgents([])

            return
        }

        setFetching(true)

        AgentService.fetchAgents({active: [0, 1], id: props.selected})
            .then((response: any) => {
                setSelectedAgents(response.data)
            })
            .catch((error: any) => {
                console.error('Ошибка загрузки агентств', error)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Добавление элемента из списка
    const selectHandler = () => {
        openPopupAgentSelector(document.body, {
            selected: props.selected,
            buttonAdd: true,
            multi: true,
            onSelect: (value: number[]) => props.onSelect(value),
            onAdd: () => loadAgentsHandler()
        })
    }

    // Удаление элемента из списка
    const removeHandler = (agent: IAgent) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${agent.name} из списка выбранных?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        const removeSelectedList: number[] = props.selected.filter((item: number) => item !== agent.id)
                        props.onSelect(removeSelectedList)
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, agent: IAgent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить', onClick: () => removeHandler(agent)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.AgentList}>
            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            <div className={classes.addAgent} onClick={selectHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetching} className={classes.list}>
                {selectedAgents && selectedAgents.length ?
                    selectedAgents.map((agent: IAgent) => {
                        return (
                            <div key={agent.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, agent)}
                            >
                                <div className={classes.name}>{agent.name}</div>
                                <div className={classes.phone}>{agent.phone}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не имеет агентств'/>
                }
            </BlockingElement>
        </div>
    )
}

AgentList.defaultProps = defaultProps
AgentList.displayName = 'AgentList'

export default AgentList