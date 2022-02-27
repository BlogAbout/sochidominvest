import React, {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IBuildingChecker} from '../../../../@types/IBuilding'
import Empty from '../../../Empty/Empty'
import openPopupCheckerCreate from '../../../PopupCheckerCreate/PopupCheckerCreate'
import classes from './CheckerList.module.scss'

interface Props {
    checkers: IBuildingChecker[]
}

const defaultProps: Props = {
    checkers: [],
}

const CheckerList: React.FC<Props> = (props) => {
    const [checkers, setCheckers] = useState<IBuildingChecker[]>(props.checkers)

    // Добавление элемента
    const createHandler = () => {
        openPopupCheckerCreate(document.body, {
            fetching: false,
            onSave: (checker: IBuildingChecker) => {
                // Todo
            }
        })
    }

    // Обновление элемента
    const updateHandler = (checker: IBuildingChecker) => {
        openPopupCheckerCreate(document.body, {
            checker: checker,
            fetching: false,
            onSave: (checker: IBuildingChecker) => {
                // Todo
            }
        })
    }

    // Удаление элемента
    const removeHandler = () => {
        // Todo
    }

    return (
        <div className={classes.CheckerList}>
            <div className={classes.header}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Название</div>
                <div className={classes.stage}>Этаж</div>
                <div className={classes.area}>Площадь</div>
                <div className={classes.cost}>Цена</div>
            </div>

            <div className={classes.addChecker} onClick={createHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <div className={classes.list}>
                {checkers.length ?
                    checkers.map((checker: IBuildingChecker) => {
                        return (
                            <div key={checker.id} className={classes.header}>
                                <div className={classes.id}>#{checker.id}</div>
                                <div className={classes.name}>{checker.name}</div>
                                <div className={classes.stage}>{checker.stage}</div>
                                <div className={classes.area}>{checker.area ? `${checker.area} кв.м` : ''}</div>
                                <div className={classes.cost}>{checker.cost ? `${checker.cost} тыс. руб.` : ''}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не имеет шахматок'/>
                }
            </div>
        </div>
    )
}

CheckerList.defaultProps = defaultProps
CheckerList.displayName = 'CheckerList'

export default CheckerList