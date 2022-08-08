import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {IBuildingChecker} from '../../../../../@types/IBuilding'
import {ISelector} from '../../../../../@types/ISelector'
import {checkerStatuses} from '../../../../../helpers/buildingHelper'
import {numberWithSpaces} from '../../../../../helpers/numberHelper'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../Empty/Empty'
import openPopupCheckerCreate from '../../../PopupCheckerCreate/PopupCheckerCreate'
import CheckerService from '../../../../../api/CheckerService'
import openPopupAlert from '../../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import Preloader from '../../../../Preloader/Preloader'
import classes from './CheckerList.module.scss'

interface Props {
    buildingId: number | null
}

const defaultProps: Props = {
    buildingId: null
}

const CheckerList: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [checkers, setCheckers] = useState<IBuildingChecker[]>([])

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate && props.buildingId) {
            CheckerService.fetchCheckers(props.buildingId)
                .then((response: any) => {
                    setFetching(false)
                    setCheckers(response.data)
                })
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })

                    setFetching(false)
                })

            setIsUpdate(false)
        }
    }, [isUpdate, props.buildingId])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление элемента
    const createHandler = () => {
        openPopupCheckerCreate(document.body, {
            buildingId: props.buildingId,
            onSave: () => onSave()
        })
    }

    // Обновление элемента
    const updateHandler = (checker: IBuildingChecker) => {
        openPopupCheckerCreate(document.body, {
            checker: checker,
            buildingId: props.buildingId,
            onSave: () => onSave()
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, checker: IBuildingChecker) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => updateHandler(checker)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(checker)})
            }

            openContextMenu(e, menuItems)
        }
    }

    // Удаление элемента
    const removeHandler = (checker: IBuildingChecker) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${checker.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (checker.id) {
                            setFetching(true)

                            CheckerService.removeChecker(checker.id)
                                .then(() => {
                                    onSave()
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

    return (
        <div className={classes.CheckerList}>
            {fetching && <Preloader/>}

            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.status}>Статус</div>
                <div className={classes.housing}>Кор.</div>
                <div className={classes.stage}>Эт.</div>
                <div className={classes.area}>Пл., м<sup>2</sup></div>
                <div className={classes.cost}>Цена, руб.</div>
            </div>

            <div className={classes.addChecker} onClick={createHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetching} className={classes.list}>
                {checkers && checkers.length ?
                    checkers.map((checker: IBuildingChecker) => {
                        const status = checkerStatuses.find((item: ISelector) => item.key === checker.status)

                        return (
                            <div key={checker.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, checker)}
                            >
                                <div className={classes.name}>{checker.name}</div>
                                <div className={classes.status}>{status ? status.text : ''}</div>
                                <div className={classes.housing}>{checker.housing}</div>
                                <div className={classes.stage}>{checker.stage}</div>
                                <div className={classes.area}>{checker.area ? checker.area : ''}</div>
                                <div className={classes.cost}>{checker.cost ? numberWithSpaces(checker.cost) : ''}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не имеет шахматок'/>
                }
            </BlockingElement>
        </div>
    )
}

CheckerList.defaultProps = defaultProps
CheckerList.displayName = 'CheckerList'

export default CheckerList