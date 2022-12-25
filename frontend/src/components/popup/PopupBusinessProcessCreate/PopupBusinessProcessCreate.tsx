import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IBusinessProcess, IBusinessProcessRelation} from '../../../@types/IBusinessProcess'
import {ITab} from '../../../@types/ITab'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {bpTypes, getBpStepsList} from '../../../helpers/businessProcessHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import BusinessProcessService from '../../../api/BusinessProcessService'
import SelectorBox from '../../SelectorBox/SelectorBox'
import UserBox from '../../form/UserBox/UserBox'
import TextBox from '../../form/TextBox/TextBox'
import Tabs from '../../Tabs/Tabs'
import UserList from './components/UserList/UserList'
import RelationList from './components/RelationList/RelationList'
import classes from './PopupBusinessProcessCreate.module.scss'

interface Props extends PopupProps {
    businessProcess?: IBusinessProcess | null

    onSave(): void
}

const defaultProps: Props = {
    businessProcess: null,
    onSave: () => {
        console.info('PopupTagCreate onSave')
    }
}

const PopupBusinessProcessCreate: React.FC<Props> = (props) => {
    const {userId} = useTypedSelector(state => state.userReducer)

    const [businessProcess, setBusinessProcess] = useState<IBusinessProcess>(props.businessProcess || {
        id: null,
        ticketId: null,
        author: userId,
        responsible: null,
        active: 1,
        type: 'feed',
        step: 'default',
        name: '',
        description: ''
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id || '')
    }

    // Сохранение изменений
    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        BusinessProcessService.saveBusinessProcess(businessProcess)
            .then((response: any) => {
                setBusinessProcess(response.data)

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
            })
            .finally(() => {
                setFetching(false)
            })
    }

    const renderStateTab = () => {
        return (
            <div key='state' className={classes.tabContent}>
                <div className={classes.field}>
                    <Label text='Название'/>

                    <TextBox value={businessProcess.name}
                             onChange={(e: React.MouseEvent, value: string) => setBusinessProcess({
                                 ...businessProcess,
                                 name: value
                             })}
                             placeHolder='Введите название'
                             error={!businessProcess.name || businessProcess.name.trim() === ''}
                             showRequired
                             errorText='Поле обязательно для заполнения'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Ответственный'/>

                    <UserBox users={businessProcess.responsible ? [businessProcess.responsible] : []}
                             onSelect={(value: number[]) => {
                                 setBusinessProcess({
                                     ...businessProcess,
                                     responsible: value.length ? value[0] : null
                                 })
                             }}
                             placeHolder='Выберите ответственного'
                             styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Тип процесса'/>

                    <SelectorBox selected={[businessProcess.type]}
                                 items={bpTypes}
                                 onSelect={(value: string[]) => {
                                     setBusinessProcess({
                                         ...businessProcess,
                                         type: value[0]
                                     })
                                 }}
                                 placeHolder='Выберите тип процесса'
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Этап'/>

                    <SelectorBox selected={[businessProcess.step]}
                                 items={getBpStepsList()}
                                 onSelect={(value: string[]) => {
                                     setBusinessProcess({
                                         ...businessProcess,
                                         step: value[0]
                                     })
                                 }}
                                 placeHolder='Выберите этап'
                                 styleType='minimal'
                    />
                </div>

                <div className={classes.field}>
                    <Label text='Комментарий'/>

                    <TextAreaBox value={businessProcess.description}
                                 onChange={(value: string) => {
                                     setBusinessProcess({
                                         ...businessProcess,
                                         description: value
                                     })
                                 }}
                                 placeHolder='Введите комментарий'
                                 width='100%'
                    />
                </div>

                <div className={classes.field}>
                    <CheckBox label='Активен'
                              type='modern'
                              width={110}
                              checked={!!businessProcess.active}
                              onChange={(e: React.MouseEvent, value: boolean) => {
                                  setBusinessProcess({
                                      ...businessProcess,
                                      active: value ? 1 : 0
                                  })
                              }}
                    />
                </div>
            </div>
        )
    }

    const renderRelationsTab = () => {
        return (
            <div key='relations' className={classes.tabContent}>
                <RelationList selected={businessProcess.relations || []}
                              fetching={fetching}
                              onSelect={(value: IBusinessProcessRelation[]) => {
                                  setBusinessProcess({...businessProcess, relations: value})
                              }}
                />
            </div>
        )
    }

    const renderAttendeesTab = () => {
        return (
            <div key='attendees' className={classes.tabContent}>
                <UserList selected={businessProcess.attendees || []}
                          onSelect={(value: number[]) => setBusinessProcess({...businessProcess, attendees: value})}
                />
            </div>
        )
    }

    const tabs: ITab = {
        state: {title: 'Состояние', render: renderStateTab()},
        info: {title: 'Связи', render: renderRelationsTab()},
        checker: {title: 'Участники', render: renderAttendeesTab()}
    }

    return (
        <Popup className={classes.PopupBusinessProcessCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о бизнес-процессе</Title>

                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || businessProcess.name.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || businessProcess.name.trim() === ''}
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

PopupBusinessProcessCreate.defaultProps = defaultProps
PopupBusinessProcessCreate.displayName = 'PopupBusinessProcessCreate'

export default function openPopupBusinessProcessCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupBusinessProcessCreate), popupProps, undefined, block, displayOptions)
}