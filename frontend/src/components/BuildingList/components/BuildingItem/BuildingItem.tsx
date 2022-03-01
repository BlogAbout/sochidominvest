import React, {useState} from 'react'
import classNames from 'classnames/bind'
import BuildingService from '../../../../api/BuildingService'
import {IBuilding} from '../../../../@types/IBuilding'
import openPopupBuildingCreate from '../../../PopupBuildingCreate/PopupBuildingCreate'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import Preloader from '../../../Preloader/Preloader'
import classes from './BuildingItem.module.scss'

interface Props {
    building: IBuilding

    onSave(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    onSave: () => {
        console.info('BuildingItem onSave')
    }
}

const cx = classNames.bind(classes)

const BuildingItem: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)

    // Редактирование объекта
    const updateHandler = (building: IBuilding) => {
        openPopupBuildingCreate(document.body, {
            building: building,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление объекта
    const removeHandler = (building: IBuilding) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${building.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (building.id) {
                            setFetching(true)

                            BuildingService.removeBuilding(building.id)
                                .then(() => {
                                    setFetching(false)
                                    props.onSave()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
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

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: () => updateHandler(props.building)},
            {text: 'Удалить', onClick: () => removeHandler(props.building)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.BuildingItem} onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}>
            {fetching && <Preloader/>}

            <div className={cx({'itemImage': true, 'noImage': true})}/>

            <div className={classes.itemContent}>
                <h2>{props.building.name}</h2>
                <div className={classes.address}>{props.building.address}</div>
            </div>

            <div className={classes.itemInfo}>
                <div className={classes.counter}>1 квартира</div>
                <div className={classes.cost}>От 4 890 000 руб.</div>
                <div className={classes.costPer}>161 923 руб. за м<sup>2</sup></div>
                <div className={classes.area}>26 м<sup>2</sup></div>
            </div>
        </div>
    )
}

BuildingItem.defaultProps = defaultProps
BuildingItem.displayName = 'BuildingItem'

export default BuildingItem