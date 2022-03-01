import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import BuildingService from '../../api/BuildingService'
import {PopupProps} from '../../@types/IPopup'
import {IBuilding} from '../../@types/IBuilding'
import {ITab} from '../../@types/ITab'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import ComboBox from '../ComboBox/ComboBox'
import Tabs from '../Tabs/Tabs'
import TagBox from '../TagBox/TagBox'
import Empty from '../Empty/Empty'
import CheckerList from './components/CheckerList/CheckerList'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {
    buildingAdvantages,
    buildingClasses,
    buildingEntrance,
    buildingFormat,
    buildingMaterials,
    buildingParking,
    buildingStatuses,
    buildingTerritory,
    buildingTypes
} from '../../helpers/buildingHelper'
import classes from './PopupBuildingCreate.module.scss'

interface Props extends PopupProps {
    building?: IBuilding | null

    onSave(): void
}

const defaultProps: Props = {
    building: null,
    onSave: () => {
        console.info('PopupBuildingCreate onSave')
    }
}

const PopupBuildingCreate: React.FC<Props> = (props) => {
    const [building, setBuilding] = useState<IBuilding>(props.building || {
        id: null,
        name: '',
        address: '',
        area: 0,
        cost: 0,
        type: 'new_building',
        status: 'sold',
        active: 1,
        tags: []
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        if (building.name.trim() === '' || !building.address || building.address.trim() === '') {
            return
        }

        setFetching(true)

        BuildingService.saveBuilding(building)
            .then((response: any) => {
                setFetching(false)
                setBuilding(response.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
    }

    // Смена выбранных особенностей объекта
    const changeAdvantagesHandler = (key: string, value: boolean) => {
        let advantagesList: string[] = building.advantages || []

        if (value) {
            advantagesList.push(key)
        } else {
            if (building.advantages) {
                advantagesList = building.advantages.filter(item => item !== key)
            }
        }

        setBuilding({...building, advantages: advantagesList})
    }

    // Вкладка состояния объекта
    const renderStateTab = () => {
        return (
            <div key='state' className={classes.tabContent}>
                <div className={classes.field}>
                    <div className={classes.field_label}>Статус</div>

                    <ComboBox selected={building.status}
                              items={Object.values(buildingStatuses)}
                              onSelect={(value: string) => setBuilding({...building, status: value})}
                              placeHolder={'Выберите статус'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Теги</div>

                    <TagBox tags={building.tags}
                            onSelect={(value: number[]) => setBuilding({...building, tags: value})}
                            placeHolder={'Выберите теги'}
                            multi
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              checked={!!building.active}
                              onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                  ...building,
                                  active: value ? 1 : 0
                              })}
                    />
                </div>
            </div>
        )
    }

    // Вкладка информации объекта
    const renderInformationTab = () => {
        return (
            <div key='info' className={classes.tabContent}>
                <div className={classes.field}>
                    <div className={classes.field_label}>Класс дома</div>

                    <ComboBox selected={building.houseClass || ''}
                              items={Object.values(buildingClasses)}
                              onSelect={(value: string) => setBuilding({...building, houseClass: value})}
                              placeHolder={'Выберите класс дома'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Материал здания</div>

                    <ComboBox selected={building.material || ''}
                              items={Object.values(buildingMaterials)}
                              onSelect={(value: string) => setBuilding({...building, material: value})}
                              placeHolder={'Выберите тип материала здания'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Тип дома</div>

                    <ComboBox selected={building.houseType || ''}
                              items={Object.values(buildingFormat)}
                              onSelect={(value: string) => setBuilding({...building, houseType: value})}
                              placeHolder={'Выберите тип дома'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Паркинг</div>

                    <ComboBox selected={building.parking || ''}
                              items={Object.values(buildingParking)}
                              onSelect={(value: string) => setBuilding({...building, parking: value})}
                              placeHolder={'Выберите тип паркинга'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Территория</div>

                    <ComboBox selected={building.territory || ''}
                              items={Object.values(buildingTerritory)}
                              onSelect={(value: string) => setBuilding({...building, territory: value})}
                              placeHolder={'Выберите тип территории'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Подъезд к дому</div>

                    <ComboBox selected={building.entranceHouse || ''}
                              items={Object.values(buildingEntrance)}
                              onSelect={(value: string) => setBuilding({...building, entranceHouse: value})}
                              placeHolder={'Выберите тип подъезда к дому'}
                              styleType='standard'
                    />
                </div>
            </div>
        )
    }

    // Вкладка особенностей объекта
    const renderAdvantagesTab = () => {
        return (
            <div key='info' className={classes.tabContent}>
                <div className={classes.advantagesList}>
                    {buildingAdvantages.map(item => {
                        let checked = false

                        if (building.advantages) {
                            checked = building.advantages.includes(item.key)
                        }

                        return (
                            <div key={item.key} className={classes.field}>
                                <CheckBox label={item.text}
                                          type='classic'
                                          checked={checked}
                                          onChange={(e: React.MouseEvent, value: boolean) => changeAdvantagesHandler(item.key, value)}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    // Вкладка шахматки объекта
    const renderCheckerBoardTab = () => {
        return (
            <div key='checker' className={classes.tabContent}>
                {building.id ?
                    <CheckerList checkers={building.checker || []}/>
                    : <Empty message='Для получения доступа к шахматке сохраните изменения'/>
                }
            </div>
        )
    }

    // Вкладка галереии объекта
    const renderGalleryTab = () => {
        return (
            <div key='gallery' className={classes.tabContent}>

            </div>
        )
    }

    const tabs: ITab = {
        state: {title: 'Состояние', render: renderStateTab()},
        info: {title: 'Информация', render: renderInformationTab()},
        advantages: {title: 'Особенности', render: renderAdvantagesTab()},
        checker: {title: 'Шахматка', render: renderCheckerBoardTab()},
        gallery: {title: 'Галерея', render: renderGalleryTab()}
    }

    return (
        <Popup className={classes.PopupBuildingCreate}>
            <Header title={building.id ? 'Редактировать недвижимость' : 'Добавить недвижимость'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <div className={classes.info}>
                        <div className={classes.field}>
                            <div className={classes.field_label}>Название</div>

                            <TextBox value={building.name}
                                     onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                         ...building,
                                         name: value
                                     })}
                                     placeHolder={'Введите название'}
                                     error={building.name.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='heading'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Адрес</div>

                            <TextBox value={building.address}
                                     onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                         ...building,
                                         address: value
                                     })}
                                     placeHolder={'Введите адрес'}
                                     error={!building.address || building.address.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='location-dot'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Площадь, м<sup>2</sup></div>

                            <TextBox value={building.area}
                                     onChange={(e: React.MouseEvent, value: number) => setBuilding({
                                         ...building,
                                         area: value
                                     })}
                                     placeHolder={'Введите площадь'}
                                     icon='arrow-up-right-from-square'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Тип</div>

                            <ComboBox selected={building.type}
                                      items={Object.values(buildingTypes)}
                                      onSelect={(value: string) => setBuilding({...building, type: value})}
                                      placeHolder={'Выберите тип'}
                                      styleType='standard'
                                      icon='user-check'
                            />
                        </div>
                    </div>

                    <div className={classes['tabs']}>
                        <Tabs tabs={tabs} paddingFirstTab='popup'/>
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type="save"
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || building.name.trim() === '' || !building.address || building.address.trim() === ''}
                >Сохранить</Button>

                <Button type="apply"
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={false}
                        className='marginLeft'
                >Сохранить</Button>

                <Button type="regular"
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupBuildingCreate.defaultProps = defaultProps
PopupBuildingCreate.displayName = 'PopupBuildingCreate'

export default function openPopupBuildingCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBuildingCreate), popupProps, undefined, block, displayOptions)
}