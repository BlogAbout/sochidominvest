import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import classNames from 'classnames/bind'
import BuildingService from '../../../api/BuildingService'
import AttachmentService from '../../../api/AttachmentService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBuilding, IBuildingPassed, IBuildingRent} from '../../../@types/IBuilding'
import {ITab} from '../../../@types/ITab'
import {ISelector} from '../../../@types/ISelector'
import {IAttachment} from '../../../@types/IAttachment'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import NumberBox from '../../NumberBox/NumberBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import ComboBox from '../../ComboBox/ComboBox'
import Tabs from '../../Tabs/Tabs'
import TagBox from '../../TagBox/TagBox'
import Empty from '../../Empty/Empty'
import CheckerList from './components/CheckerList/CheckerList'
import DeveloperList from './components/DeveloperList/DeveloperList'
import AgentList from './components/AgentList/AgentList'
import DocumentList from './components/DocumentList/DocumentList'
import UserList from './components/UserList/UserList'
import SelectorBox from '../../SelectorBox/SelectorBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import PassedBox from '../../PassedBox/PassedBox'
import FileList from '../../FileList/FileList'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import openPopupFileManager from '../../PopupFileManager/PopupFileManager'
import openPopupBuildingRent from '../PopupBuildingRent/PopupBuildingRent'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import ArticleList from './components/ArticleList/ArticleList'
import AddressBox from '../../form/AddressBox/AddressBox'
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
} from '../../../helpers/buildingHelper'
import {sortAttachments} from '../../../helpers/attachmentHelper'
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
        coordinates: '',
        type: props.type || 'building',
        status: 'sold',
        active: 1,
        author: 0,
        tags: [],
        contacts: [],
        developers: [],
        agents: [],
        advantages: [],
        articles: [],
        images: [],
        videos: [],
        surchargeDoc: 0,
        surchargeGas: 0,
        area: 0,
        cost: 0
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
                        setImages(sortAttachments(response.data, building.images))
                    })
                    .finally(() => setFetchingImages(false))
            }

            if (building.videos && building.videos.length) {
                setFetchingVideos(true)
                AttachmentService.fetchAttachments({active: [0, 1], id: building.videos, type: 'video'})
                    .then((response: any) => {
                        setVideos(sortAttachments(response.data, building.videos))
                    })
                    .finally(() => setFetchingVideos(false))
            }
        }
    }, [building.id])

    useEffect(() => {
        if (images && images.length) {
            checkAvatar()
        }
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

    const onUpdateOrderingImagesHandler = (files: IAttachment[]) => {
        const ids: number[] = files.map((attachment: IAttachment) => attachment.id)
        setImages(sortAttachments(files, ids))
        setBuilding({...building, images: ids})
    }

    const onUpdateOrderingVideosHandler = (files: IAttachment[]) => {
        const ids: number[] = files.map((attachment: IAttachment) => attachment.id)
        setVideos(sortAttachments(files, ids))
        setBuilding({...building, videos: ids})
    }

    const removeSelectedImageHandler = (file: IAttachment) => {
        setBuilding({...building, images: building.images.filter((id: number) => id !== file.id)})
        setImages([...images.filter((attachment: IAttachment) => attachment.id !== file.id)])
    }

    const removeSelectedVideoHandler = (file: IAttachment) => {
        setBuilding({...building, videos: building.images.filter((id: number) => id !== file.id)})
        setVideos([...videos.filter((attachment: IAttachment) => attachment.id !== file.id)])
    }

    // Вкладка состояния объекта
    const renderStateTab = () => {
        return (
            <div key='state' className={classes.tabContent}>
                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={building.name}
                             onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                 ...building,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={building.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Адрес'/>

                    <AddressBox address={building.address || ''}
                                coordinates={building.coordinates || ''}
                                onSelect={(address: string, coordinates: string) => setBuilding({
                                    ...building,
                                    address: address,
                                    coordinates: coordinates
                                })}
                                placeHolder='Укажите адрес'
                                error={!building.address || building.address.trim() === ''}
                                showRequired
                                errorText='Поле обязательно для заполнения'
                                styleType='minimal'
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Описание'/>

                    <TextAreaBox value={building.description}
                                 onChange={(value: string) => setBuilding({
                                     ...building,
                                     description: value
                                 })}
                                 placeHolder='Введите описание об объекте'
                                 icon='paragraph'
                                 isVisual={true}
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Статус'/>

                    <ComboBox selected={building.status}
                              items={Object.values(buildingStatuses)}
                              onSelect={(value: string) => setBuilding({...building, status: value})}
                              placeHolder='Выберите статус'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Дата сдачи'/>

                    <PassedBox selected={building.passed || null}
                               onChange={(value: IBuildingPassed) => setBuilding({...building, passed: value})}
                               placeHolder='Укажите дату сдачи'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Теги'/>

                    <TagBox tags={building.tags}
                            onSelect={(value: number[]) => setBuilding({...building, tags: value})}
                            placeHolder='Выберите теги'
                            multi
                            styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Сумма в договоре'/>

                    <ComboBox selected={building.amountContract || null}
                              items={Object.values(amountContract)}
                              onSelect={(value: string) => setBuilding({...building, amountContract: value})}
                              placeHolder='Выберите сумму в договоре'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Доплата за документы, руб.'/>

                    <NumberBox value={building.surchargeDoc || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   surchargeDoc: value
                               })}
                               placeHolder='Введите размер доплаты за документы'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Доплата за газ, руб.'/>

                    <NumberBox value={building.surchargeGas || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   surchargeGas: value
                               })}
                               placeHolder='Введите размер доплаты за газ'
                               styleType='minimal'
                    />
                </div>

                {building.type !== 'building' ?
                    <div className={classes.field}>
                        <CheckBox label='Сдается в аренду'
                                  title='Сдается в аренду'
                                  type='modern'
                                  width={110}
                                  checked={!!building.rent}
                                  onChange={(n) => {
                                      openPopupBuildingRent(document.body, {
                                          building: building,
                                          onSave: (active: number, rentData: IBuildingRent) => {
                                              setBuilding({
                                                  ...building,
                                                  rent: active,
                                                  rentData: rentData
                                              })
                                          }
                                      })
                                  }}
                        />
                    </div>
                    : null
                }

                <div className={classes.field}>
                    <CheckBox label='Продажа для нерезидентов'
                              title='Продажа для нерезидентов'
                              type='modern'
                              width={110}
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
                              width={110}
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
                              width={110}
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
                            <Label text='Площадь, м<sup>2</sup>'/>

                            <NumberBox value={building.area || ''}
                                       min={0}
                                       step={0.01}
                                       max={999999999}
                                       countAfterComma={2}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                           ...building,
                                           area: value
                                       })}
                                       placeHolder='Введите площадь'
                                       styleType='minimal'
                            />
                        </div>

                        <div className={classes.field}>
                            <Label text='Стоимость, руб.'/>

                            <NumberBox value={building.cost || ''}
                                       min={0}
                                       step={1}
                                       max={999999999}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                           ...building,
                                           cost: value
                                       })}
                                       placeHolder='Введите стоимость'
                                       styleType='minimal'
                            />
                        </div>
                    </>
                    : null
                }

                <div className={classes.field}>
                    <Label text='Район'/>

                    <ComboBox selected={building.district || null}
                              items={Object.values(districtList)}
                              onSelect={(value: string) => setBuilding({...building, district: value})}
                              placeHolder='Выберите район'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Микрорайон'/>

                    <ComboBox selected={building.districtZone || null}
                              items={districtZones && districtZones.children ? Object.values(districtZones.children) : []}
                              onSelect={(value: string) => setBuilding({...building, districtZone: value})}
                              placeHolder='Выберите микрорайон'
                              styleType='minimal'
                              showEmpty
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Особенности'/>

                    <SelectorBox selected={building.advantages || []}
                                 items={Object.values(buildingAdvantages)}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     advantages: value
                                 })}
                                 title='Выберите особенности'
                                 placeHolder='Выберите особенности'
                                 multi
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Варианты оплаты'/>

                    <SelectorBox selected={building.payments || []}
                                 items={Object.values(paymentsList)}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     payments: value
                                 })}
                                 title='Выберите варианты оплаты'
                                 placeHolder='Выберите варианты оплаты'
                                 multi
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Варианты оформления покупки'/>

                    <SelectorBox selected={building.formalization || []}
                                 items={Object.values(formalizationList)}
                                 onSelect={(value: string[]) => setBuilding({
                                     ...building,
                                     formalization: value
                                 })}
                                 title='Выберите варианты оформления покупки'
                                 placeHolder='Выберите варианты оформления покупки'
                                 multi
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Класс дома'/>

                    <ComboBox selected={building.houseClass || ''}
                              items={Object.values(buildingClasses)}
                              onSelect={(value: string) => setBuilding({...building, houseClass: value})}
                              placeHolder='Выберите класс дома'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Материал здания'/>

                    <ComboBox selected={building.material || ''}
                              items={Object.values(buildingMaterials)}
                              onSelect={(value: string) => setBuilding({...building, material: value})}
                              placeHolder='Выберите тип материала здания'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Тип дома'/>

                    <ComboBox selected={building.houseType || ''}
                              items={Object.values(buildingFormat)}
                              onSelect={(value: string) => setBuilding({...building, houseType: value})}
                              placeHolder='Выберите тип дома'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Паркинг'/>

                    <ComboBox selected={building.parking || ''}
                              items={Object.values(buildingParking)}
                              onSelect={(value: string) => setBuilding({...building, parking: value})}
                              placeHolder='Выберите тип паркинга'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Территория'/>

                    <ComboBox selected={building.territory || ''}
                              items={Object.values(buildingTerritory)}
                              onSelect={(value: string) => setBuilding({...building, territory: value})}
                              placeHolder='Выберите тип территории'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Подъезд к дому'/>

                    <ComboBox selected={building.entranceHouse || ''}
                              items={Object.values(buildingEntrance)}
                              onSelect={(value: string) => setBuilding({...building, entranceHouse: value})}
                              placeHolder='Выберите тип подъезда к дому'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Газ'/>

                    <ComboBox selected={building.gas || ''}
                              items={Object.values(buildingGas)}
                              onSelect={(value: string) => setBuilding({...building, gas: value})}
                              placeHolder='Выберите подключение газа'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Отопление'/>

                    <ComboBox selected={building.heating || ''}
                              items={Object.values(buildingHeating)}
                              onSelect={(value: string) => setBuilding({...building, heating: value})}
                              placeHolder='Выберите тип отопления'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Электричество'/>

                    <ComboBox selected={building.electricity || ''}
                              items={Object.values(buildingElectricity)}
                              onSelect={(value: string) => setBuilding({...building, electricity: value})}
                              placeHolder='Выберите тип электричества'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Канализация'/>

                    <ComboBox selected={building.sewerage || ''}
                              items={Object.values(buildingSewerage)}
                              onSelect={(value: string) => setBuilding({...building, sewerage: value})}
                              placeHolder='Выберите тип канализации'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Водоснабжение'/>

                    <ComboBox selected={building.waterSupply || ''}
                              items={Object.values(buildingWaterSupply)}
                              onSelect={(value: string) => setBuilding({...building, waterSupply: value})}
                              placeHolder='Выберите тип водоснабжения'
                              styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Расстояние до моря, м.'/>

                    <NumberBox value={building.distanceSea || ''}
                               min={0}
                               step={1}
                               max={999999999}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setBuilding({
                                   ...building,
                                   distanceSea: value
                               })}
                               placeHolder='Укажите расстояние до моря'
                               styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Высота потолков, м.'/>

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
                               styleType='minimal'
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
                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Фотогалерея'/>

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
                              onRemove={removeSelectedImageHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingImagesHandler.bind(this)}
                              isOnlyList={true}
                    />
                </div>

                <div className={cx({'field': true, 'fieldWrap': true})}>
                    <Label text='Видео'/>

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
                              onRemove={removeSelectedVideoHandler.bind(this)}
                              onUpdateOrdering={onUpdateOrderingVideosHandler.bind(this)}
                              isOnlyList={true}
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

    // Вкладка агентства объекта
    const renderAgentTab = () => {
        return (
            <div key='agent' className={classes.tabContent}>
                <AgentList selected={building.agents}
                           onSelect={(value: number[]) => setBuilding({...building, agents: value})}
                />
            </div>
        )
    }

    // Вкладка контактов объекта
    const renderContactTab = () => {
        return (
            <div key='contact' className={classes.tabContent}>
                <UserList selectedAgents={building.agents}
                          selectedUsers={building.contactUsers}
                          selectedContacts={building.contactContacts}
                          onSelectUsers={(value: number[]) => setBuilding({...building, contactUsers: value})}
                          onSelectContacts={(value: number[]) => setBuilding({...building, contactContacts: value})}
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

    // Вкладка статей объекта
    const renderArticleTab = () => {
        return (
            <div key='article' className={classes.tabContent}>
                <ArticleList selected={building.articles || []}
                             onSelect={(value: number[]) => setBuilding({...building, articles: value})}
                />
            </div>
        )
    }

    const renderSeoTab = () => {
        return (
            <div key='seo' className={classes.tabContent}>
                <div className={classes.info}>
                    <div className={classes.field}>
                        <Label text='Meta Title'/>

                        <TextBox value={building.metaTitle}
                                 onChange={(e: React.MouseEvent, value: string) => setBuilding({
                                     ...building,
                                     metaTitle: value
                                 })}
                                 placeHolder='Введите Meta Title'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Meta Description'/>

                        <TextAreaBox value={building.metaDescription || ''}
                                     onChange={(value: string) => setBuilding({
                                         ...building,
                                         metaDescription: value
                                     })}
                                     placeHolder='Введите Meta Description'
                                     width='100%'
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
        agent: {title: 'Агентство', render: renderAgentTab()},
        contact: {title: 'Контакты', render: renderContactTab()},
        documents: {title: 'Документы', render: renderDocumentTab()},
        articles: {title: 'Статьи', render: renderArticleTab()},
        seo: {title: 'СЕО', render: renderSeoTab()}
    }

    if (building.type !== 'building') {
        delete tabs.checker
    }

    return (
        <Popup className={classes.PopupBuildingCreate}>
            <BlockingElement fetching={fetchingBuilding} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>{building.id ? 'Редактировать недвижимость' : 'Добавить недвижимость'}</Title>

                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={isDisableButton()}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={isDisableButton()}
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
        </Popup>
    )
}

PopupBuildingCreate.defaultProps = defaultProps
PopupBuildingCreate.displayName = 'PopupBuildingCreate'

export default function openPopupBuildingCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBuildingCreate), popupProps, undefined, block, displayOptions)
}