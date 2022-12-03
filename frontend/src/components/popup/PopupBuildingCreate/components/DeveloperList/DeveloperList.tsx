import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IDeveloper} from '../../../../../@types/IDeveloper'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../Empty/Empty'
import openPopupAlert from '../../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import openPopupDeveloperSelector from '../../../PopupDeveloperSelector/PopupDeveloperSelector'
import Preloader from '../../../../Preloader/Preloader'
import classes from './DeveloperList.module.scss'

interface Props {
    selected: number[]

    onSelect(value: number[]): void
}

const defaultProps: Props = {
    selected: [],
    onSelect: (value: number[]) => {
        console.info('AgentList onSelect', value)
    }
}

const DeveloperList: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [selectedDevelopers, setSelectedDevelopers] = useState<IDeveloper[]>([])

    const {fetching: fetchingDeveloperList, developers} = useTypedSelector(state => state.developerReducer)
    const {fetchDeveloperList} = useActions()

    useEffect(() => {
        if (!developers.length || isUpdate) {
            fetchDeveloperList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (developers && developers.length) {

            setSelectedDevelopers(developers.filter((developer: IDeveloper) => developer.id && props.selected.includes(developer.id)))
        } else {
            setSelectedDevelopers([])
        }
    }, [developers, props.selected])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление элемента из списка
    const selectHandler = () => {
        openPopupDeveloperSelector(document.body, {
            selected: props.selected,
            buttonAdd: true,
            multi: true,
            onSelect: (value: number[]) => props.onSelect(value),
            onAdd: () => onSave()
        })
    }

    // Удаление элемента из списка
    const removeHandler = (developer: IDeveloper) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${developer.name} из списка выбранных?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        const removeSelectedList: number[] = props.selected.filter((item: number) => item !== developer.id)
                        props.onSelect(removeSelectedList)
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, developer: IDeveloper) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить', onClick: () => removeHandler(developer)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.DeveloperList}>
            {fetchingDeveloperList && <Preloader/>}

            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            <div className={classes.addDeveloper} onClick={selectHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetchingDeveloperList} className={classes.list}>
                {selectedDevelopers && selectedDevelopers.length ?
                    selectedDevelopers.map((developer: IDeveloper) => {
                        return (
                            <div key={developer.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, developer)}
                            >
                                <div className={classes.name}>{developer.name}</div>
                                <div className={classes.phone}>{developer.phone}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не имеет застройщиков'/>
                }
            </BlockingElement>
        </div>
    )
}

DeveloperList.defaultProps = defaultProps
DeveloperList.displayName = 'DeveloperList'

export default DeveloperList