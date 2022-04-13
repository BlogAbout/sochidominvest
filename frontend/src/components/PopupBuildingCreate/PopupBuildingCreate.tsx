import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import classNames from 'classnames/bind'
import BuildingService from '../../api/BuildingService'
import AttachmentService from '../../api/AttachmentService'
import {PopupProps} from '../../@types/IPopup'
import {IBuilding, IBuildingPassed} from '../../@types/IBuilding'
import {ITab} from '../../@types/ITab'
import {ISelector} from '../../@types/ISelector'
import {IAttachment} from '../../@types/IAttachment'
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
import DeveloperList from './components/DeveloperList/DeveloperList'
import DocumentList from './components/DocumentList/DocumentList'
import UserList from './components/UserList/UserList'
import SelectorBox from '../SelectorBox/SelectorBox'
import TextAreaBox from '../TextAreaBox/TextAreaBox'
import PassedBox from '../PassedBox/PassedBox'
import FileList from '../FileList/FileList'
import openPopupAlert from '../PopupAlert/PopupAlert'
import openPopupFileManager from '../PopupFileManager/PopupFileManager'
import {
    amountContract,
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
    buildingWaterSupply,
    districtList,
    formalizationList,
    paymentsList
} from '../../helpers/buildingHelper'
import classes from './PopupBuildingCreate.module.scss'

interface Props extends PopupProps {
    building?: IBuilding | null
    type?: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage'

    onSave(): void
}

const defaultProps: Props = {
    building: null,
    type: 'building',
    onSave: () => {
        console.info('PopupBuildingCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupBuildingCreate: React.FC<Props> = (props) => {
    const [building, setBuilding] = useState<IBuilding>(props.building ? JSON.parse(JSON.stringify(props.building)) : {
        id: null,
        name: '',
        address: '',
        type: props.type || 'building',
        status: 'sold',
        active: 1,
        author: 0,
        tags: [],
        contacts: [],
        developers: [],
        advantages: [],
        images: [],
        videos: [],
        surchargeDoc: 0,
        surchargeGas: 0,
        area: 0,
        cost: 0,
    })

    const [fetchingBuilding, setFetchingBuilding] = useState(false)
    const [fetchingImages, setFetchingImages] = useState(false)
    const [fetchingVideos, setFetchingVideos] = useState(false)
    const [images, setImages] = useState<IAttachment[]>([])
    const [videos, setVideos] = useState<IAttachment[]>([])

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (building.id) {
            if (building.images && building.images.length) {
                setFetchingImages(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: building.images, type: 'image'})
                    .then((response: any) => {
                        setImages(response.data)
                    })
                    .finally(() => setFetchingImages(false))
            }

            if (building.videos && building.videos.length) {
                setFetchingVideos(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: building.videos, type: 'video'})
                    .then((response: any) => {
                        setVideos(response.data)
                    })
                    .finally(() => setFetchingVideos(false))
            }
        }
    }, [building])

    useEffect(() => {
        checkAvatar()
    }, [images])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        if (building.name.trim() === '' || !building.address || building.address.trim() === '') {
            return
        }

        setFetchingBuilding(true)

        BuildingService.saveBuilding(building)
            .then((response: any) => {
                setBuilding(response.data)

                props.onSave()

                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                console.error('error', error)
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => {
                setFetchingBuilding(false)
            })
    }

    // Добавление файла
    const addAttachmentHandler = (attachment: IAttachment) => {
        switch (attachment.type) {
            case 'image':
                setBuilding({
                    ...building,
                    images: [attachment.id, ...building.images]
                })
                setImages([attachment, ...images])
                break
            case 'video':
                setBuilding({
                    ...building,
                    videos: [attachment.id, ...building.videos]
                })
                setVideos([attachment, ...images])
                break
        }
    }

    // Смена главного изображения
    const selectImageAvatarHandler = (attachment: IAttachment) => {
        setBuilding({...building, avatarId: attachment.id, avatar: attachment.content})
    }

    // Проверка наличия главного изображения
    const checkAvatar = () => {
        if (building.images && building.images.length && images && images.length) {
            if (!building.avatarId || !building.images.includes(building.avatarId)) {
                selectImageAvatarHandler(images[0])
            }
        } else {
            setBuilding({...building, avatarId: null, avatar: null})
        }
    }

    const isDisableButton = () => {
        return fetchingBuilding || fetchingImages || fetchingVideos ||
            building.name.trim() === '' || !building.address || building.address.trim() === ''
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
                              placeHolder='Выберите статус'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Дата сдачи</div>

                    <PassedBox selected={building.passed || null}
                               onChange={(value: IBuildingPassed) => setBuilding({...building, passed: value})}
                               placeHolder='Укажите дату сдачи'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Теги</div>

                    <TagBox tags={building.tags}
                            onSelect={(value: number[]) => setBuilding({...building, tags: value})}
                            placeHolder='Выберите теги'
                            multi
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Сумма в договоре</div>

                    <ComboBox selected={building.amountContract || null}
                              items={Object.values(amountContract)}
                              onSelect={(value: string) => setBuilding({...building, amountContract: value})}
                              placeHolder='Выберите сумму в договоре'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Доплата за документы, руб.</div>

                    <NumberBox value={building.surchargeDoc || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   surchargeDoc: value
                               })}
                               placeHolder='Введите размер доплаты за документы'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Доплата за газ, руб.</div>

                    <NumberBox value={building.surchargeGas || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   surchargeGas: value
                               })}
                               placeHolder='Введите размер доплаты за газ'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Продажа для нерезидентов'
                              type='modern'
                              checked={!!building.saleNoResident}
                              onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                  ...building,
                                  saleNoResident: value ? 1 : 0
                              })}
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Публичный'
                              type='modern'
                              checked={!!building.publish}
                              onChange={(e: React.MouseEvent, value: boolean) => setBuilding({
                                  ...building,
                                  publish: value ? 1 : 0
                              })}
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
        const districtZones = districtList.find((item: ISelector) => item.key === building.district)

        return (
            <div key='info' className={classes.tabContent}>
                {building.type !== 'building' ?
                    <>
                        <div className={classes.field}>
                            <div className={classes.field_label}>Площадь, м<sup>2</sup></div>

                            <NumberBox value={building.area || ''}
                                       min={0}
                                       step={0.01}
                                       max={999}
                                       countAfterComma={2}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                           ...building,
                                           area: value
                                       })}
                                       placeHolder='Введите площадь'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Стоимость, руб.</div>

                            <NumberBox value={building.cost || ''}
                                       min={0}
                                       step={1}
                                       max={999999999}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                           ...building,
                                           cost: value
                                       })}
                                       placeHolder='Введите стоимость'
                            />
                        </div>
                    </>
                    : null
                }

                <div className={classes.field}>
                    <div className={classes.field_label}>Район</div>

                    <ComboBox selected={building.district || null}
                              items={Object.values(districtList)}
                              onSelect={(value: string) => setBuilding({...building, district: value})}
                              placeHolder='Выберите район'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Микрорайон</div>

                    <ComboBox selected={building.districtZone || null}
                              items={districtZones && districtZones.children ? Object.values(districtZones.children) : []}
                              onSelect={(value: string) => setBuilding({...building, districtZone: value})}
                              placeHolder='Выберите микрорайон'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Особенности</div>

                    <SelectorBox selected={building.advantages || []}
                                 items={Object.values(buildingAdvantages)}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     advantages: value
                                 })}
                                 title='Выберите особенности'
                                 placeHolder='Выберите особенности'
                                 multi
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Варианты оплаты</div>

                    <SelectorBox selected={building.payments || []}
                                 items={Object.values(paymentsList)}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     payments: value
                                 })}
                                 title='Выберите варианты оплаты'
                                 placeHolder='Выберите варианты оплаты'
                                 multi
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Варианты оформления покупки</div>

                    <SelectorBox selected={building.formalization || []}
                                 items={Object.values(formalizationList)}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     formalization: value
                                 })}
                                 title='Выберите варианты оформления покупки'
                                 placeHolder='Выберите варианты оформления покупки'
                                 multi
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Класс дома</div>

                    <ComboBox selected={building.houseClass || ''}
                              items={Object.values(buildingClasses)}
                              onSelect={(value: string) => setBuilding({...building, houseClass: value})}
                              placeHolder='Выберите класс дома'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Материал здания</div>

                    <ComboBox selected={building.material || ''}
                              items={Object.values(buildingMaterials)}
                              onSelect={(value: string) => setBuilding({...building, material: value})}
                              placeHolder='Выберите тип материала здания'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Тип дома</div>

                    <ComboBox selected={building.houseType || ''}
                              items={Object.values(buildingFormat)}
                              onSelect={(value: string) => setBuilding({...building, houseType: value})}
                              placeHolder='Выберите тип дома'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Паркинг</div>

                    <ComboBox selected={building.parking || ''}
                              items={Object.values(buildingParking)}
                              onSelect={(value: string) => setBuilding({...building, parking: value})}
                              placeHolder='Выберите тип паркинга'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Территория</div>

                    <ComboBox selected={building.territory || ''}
                              items={Object.values(buildingTerritory)}
                              onSelect={(value: string) => setBuilding({...building, territory: value})}
                              placeHolder='Выберите тип территории'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Подъезд к дому</div>

                    <ComboBox selected={building.entranceHouse || ''}
                              items={Object.values(buildingEntrance)}
                              onSelect={(value: string) => setBuilding({...building, entranceHouse: value})}
                              placeHolder='Выберите тип подъезда к дому'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Газ</div>

                    <ComboBox selected={building.gas || ''}
                              items={Object.values(buildingGas)}
                              onSelect={(value: string) => setBuilding({...building, gas: value})}
                              placeHolder='Выберите подключение газа'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Отопление</div>

                    <ComboBox selected={building.heating || ''}
                              items={Object.values(buildingHeating)}
                              onSelect={(value: string) => setBuilding({...building, heating: value})}
                              placeHolder='Выберите тип отопления'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Электричество</div>

                    <ComboBox selected={building.electricity || ''}
                              items={Object.values(buildingElectricity)}
                              onSelect={(value: string) => setBuilding({...building, electricity: value})}
                              placeHolder='Выберите тип электричества'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Канализация</div>

                    <ComboBox selected={building.sewerage || ''}
                              items={Object.values(buildingSewerage)}
                              onSelect={(value: string) => setBuilding({...building, sewerage: value})}
                              placeHolder='Выберите тип канализации'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Водоснабжение</div>

                    <ComboBox selected={building.waterSupply || ''}
                              items={Object.values(buildingWaterSupply)}
                              onSelect={(value: string) => setBuilding({...building, waterSupply: value})}
                              placeHolder='Выберите тип водоснабжения'
                              styleType='standard'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Расстояние до моря, м.</div>

                    <NumberBox value={building.distanceSea || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   distanceSea: value
                               })}
                               placeHolder='Укажите расстояние до моря'
                    />
                </div>

                <div className={classes.field}>
                    <div className={classes.field_label}>Высота потолков, м.</div>

                    <NumberBox value={building.ceilingHeight || ''}
                               min={0}
                               step={0.01}
                               max={99}
                               countAfterComma={2}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   ceilingHeight: value
                               })}
                               placeHolder='Укажите высоту потолков'
                    />
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
    const renderMediaTab = () => {
        return (
            <div key='media' className={classes.tabContent}>
                <div className={cx({'field': true, 'full': true})}>
                    <div className={classes.field_label}>Фотогалерея</div>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'image',
                                selected: building.images,
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setBuilding({...building, images: selected})
                                    setImages(attachments)
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={images}
                              selected={building.avatarId ? [building.avatarId] : []}
                              fetching={fetchingImages}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                    />
                </div>

                <div className={cx({'field': true, 'full': true})}>
                    <div className={classes.field_label}>Видео</div>

                    <Button type='save'
                            icon='arrow-pointer'
                            onClick={() => openPopupFileManager(document.body, {
                                type: 'video',
                                selected: building.videos,
                                onSelect: (selected: number[], attachments: IAttachment[]) => {
                                    setBuilding({...building, videos: selected})
                                    setVideos(attachments)
                                },
                                multi: true
                            })}
                            disabled={isDisableButton()}
                    >Выбрать / Загрузить</Button>

                    <FileList files={videos}
                              fetching={fetchingVideos}
                              onSave={addAttachmentHandler.bind(this)}
                              onSelect={selectImageAvatarHandler.bind(this)}
                    />
                </div>
            </div>
        )
    }

    // Вкладка застройщика объекта
    const renderDeveloperTab = () => {
        return (
            <div key='developer' className={classes.tabContent}>
                <DeveloperList selected={building.developers}
                               onSelect={(value: number[]) => setBuilding({...building, developers: value})}
                />
            </div>
        )
    }

    // Вкладка контактов объекта
    const renderContactTab = () => {
        return (
            <div key='developer' className={classes.tabContent}>
                <UserList selected={building.contacts}
                          onSelect={(value: number[]) => setBuilding({...building, contacts: value})}
                />
            </div>
        )
    }

    // Вкладка документов объекта
    const renderDocumentTab = () => {
        return (
            <div key='document' className={classes.tabContent}>
                {building.id ?
                    <DocumentList buildingId={building.id}/>
                    : <Empty message='Для получения доступа к документам сохраните изменения'/>
                }
            </div>
        )
    }

    const renderSeoTab = () => {
        return (
            <div key='seo' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Meta Title</div>

                        <TextBox value={building.metaTitle}
                                 onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                     ...building,
                                     metaTitle: value
                                 })}
                                 placeHolder='Введите Meta Title'
                                 icon='heading'
                        />
                    </div>

                    <div className={cx({'field': true, 'full': true})}>
                        <div className={classes.field_label}>Meta Description</div>

                        <TextAreaBox value={building.metaDescription || ''}
                                     onChange={(value: string) => setBuilding({
                                         ...building,
                                         metaDescription: value
                                     })}
                                     placeHolder='Введите Meta Description'
                                     icon='paragraph'
                        />
                    </div>
                </div>
            </div>
        )
    }

    const tabs: ITab = {
        state: {title: 'Состояние', render: renderStateTab()},
        info: {title: 'Информация', render: renderInformationTab()},
        checker: {title: 'Шахматка', render: renderCheckerBoardTab()},
        media: {title: 'Медиа', render: renderMediaTab()},
        developer: {title: 'Застройщик', render: renderDeveloperTab()},
        contact: {title: 'Контакты', render: renderContactTab()},
        documents: {title: 'Документы', render: renderDocumentTab()},
        seo: {title: 'СЕО', render: renderSeoTab()}
    }

    if (building.type !== 'building') {
        delete tabs.checker
    }

    return (
        <Popup className={classes.PopupBuildingCreate}>
            <Header title={building.id ? 'Редактировать недвижимость' : 'Добавить недвижимость'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetchingBuilding} className={classes.content}>
                    <div className={classes.info}>
                        <div className={classes.field}>
                            <div className={classes.field_label}>Название</div>

                            <TextBox value={building.name}
                                     onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                         ...building,
                                         name: value
                                     })}
                                     placeHolder='Введите название'
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
                                     placeHolder='Введите адрес'
                                     error={!building.address || building.address.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='location-dot'
                            />
                        </div>

                        <div className={cx({'field': true, 'full': true})}>
                            <div className={classes.field_label}>Описание</div>

                            <TextAreaBox value={building.description}
                                         onChange={(value: string) => setBuilding({
                                             ...building,
                                             description: value
                                         })}
                                         placeHolder='Введите описание об объекте'
                                         icon='paragraph'
                            />
                        </div>
                    </div>

                    <div className={classes['tabs']}>
                        <Tabs tabs={tabs} paddingFirstTab='popup'/>
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={isDisableButton()}
                >Сохранить и закрыть</Button>

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={isDisableButton()}
                        className='marginLeft'
                >Сохранить</Button>

                <Button type='regular'
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