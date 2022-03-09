import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import BuildingService from '../../api/BuildingService'
import {PopupProps} from '../../@types/IPopup'
import {IBuilding} from '../../@types/IBuilding'
import {ITab} from '../../@types/ITab'
import {IImage, IImageDb} from '../../@types/IImage'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import NumberBox from '../NumberBox/NumberBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import ComboBox from '../ComboBox/ComboBox'
import Tabs from '../Tabs/Tabs'
import TagBox from '../TagBox/TagBox'
import Empty from '../Empty/Empty'
import CheckerList from './components/CheckerList/CheckerList'
import ImageUploader from '../ImageUploader/ImageUploader'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {
    buildingAdvantages,
    buildingClasses,
    buildingElectricity,
    buildingEntrance,
    buildingFormat,
    buildingGas,
    buildingHeating,
    buildingMaterials,
    buildingParking,
    buildingSewerage,
    buildingStatuses,
    buildingTerritory,
    buildingTypes,
    buildingWaterSupply
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
    const [building, setBuilding] = useState<IBuilding>(props.building ? JSON.parse(JSON.stringify(props.building)) : {
        id: null,
        name: '',
        address: '',
        type: 'new_building',
        status: 'sold',
        active: 1,
        author: 0,
        tags: [],
        advantages: [],
        images: [],
        newImages: [],
        surchargeDoc: 0,
        surchargeGas: 0
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
                console.log('error', error)
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
    }

    // Смена выбранных особенностей объекта
    const changeAdvantagesHandler = (key: string, value: boolean) => {
        let advantagesList: string[] = building.advantages ? [...building.advantages] : []

        if (value) {
            advantagesList.push(key)
        } else {
            if (building.advantages) {
                advantagesList = building.advantages.filter(item => item !== key)
            }
        }

        setBuilding({...building, advantages: advantagesList})
    }

    // Загрузка изображений
    const uploadImagesHandler = (images: IImageDb[], newImages: IImage[]) => {
        setBuilding({...building, images: images, newImages: newImages})
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
                    <div className={classes.field_label}>Доплата за документы, руб.</div>

                    <NumberBox value={building.surchargeDoc || 0}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   surchargeDoc: value
                               })}
                               placeHolder={'Введите размер доплаты за документы'}
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Доплата за газ, руб.</div>

                    <NumberBox value={building.surchargeGas || 0}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   surchargeGas: value
                               })}
                               placeHolder={'Введите размер доплаты за газ'}
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
                    <div className={classes.field_label}>Тип</div>

                    <ComboBox selected={building.type}
                              items={Object.values(buildingTypes)}
                              onSelect={(value: string) => setBuilding({...building, type: value})}
                              placeHolder={'Выберите тип'}
                              styleType='standard'
                              icon='user-check'
                    />
                </div>

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

                <div className={classes.field}>
                    <div className={classes.field_label}>Газ</div>

                    <ComboBox selected={building.gas || ''}
                              items={Object.values(buildingGas)}
                              onSelect={(value: string) => setBuilding({...building, gas: value})}
                              placeHolder={'Выберите подключение газа'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Отопление</div>

                    <ComboBox selected={building.heating || ''}
                              items={Object.values(buildingHeating)}
                              onSelect={(value: string) => setBuilding({...building, heating: value})}
                              placeHolder={'Выберите тип отопления'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Электричество</div>

                    <ComboBox selected={building.electricity || ''}
                              items={Object.values(buildingElectricity)}
                              onSelect={(value: string) => setBuilding({...building, electricity: value})}
                              placeHolder={'Выберите тип электричества'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Канализация</div>

                    <ComboBox selected={building.sewerage || ''}
                              items={Object.values(buildingSewerage)}
                              onSelect={(value: string) => setBuilding({...building, sewerage: value})}
                              placeHolder={'Выберите тип канализации'}
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Водоснабжение</div>

                    <ComboBox selected={building.waterSupply || ''}
                              items={Object.values(buildingWaterSupply)}
                              onSelect={(value: string) => setBuilding({...building, waterSupply: value})}
                              placeHolder={'Выберите тип водоснабжения'}
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
                    <CheckerList buildingId={building.id}/>
                    : <Empty message='Для получения доступа к шахматке сохраните изменения'/>
                }
            </div>
        )
    }

    // Вкладка галереии объекта
    const renderGalleryTab = () => {
        const listActiveImages: IImageDb[] = building.images.filter((image: IImageDb) => image.active)

        return (
            <div key='gallery' className={classes.tabContent}>
                <ImageUploader images={listActiveImages}
                               newImages={building.newImages}
                               multi
                               showUploadList
                               onChange={uploadImagesHandler.bind(this)}
                />
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
                >Сохранить и закрыть</Button>

                <Button type="apply"
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || building.name.trim() === '' || !building.address || building.address.trim() === ''}
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