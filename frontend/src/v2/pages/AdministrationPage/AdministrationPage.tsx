import React, {useEffect, useMemo, useState} from 'react'
import {ITab} from '../../../@types/ITab'
import {ISetting} from '../../../@types/ISetting'
import {ISelector} from '../../../@types/ISelector'
import {mapIconColors} from '../../../helpers/administrationHelper'
import AdministrationService from '../../../api/AdministrationService'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Tabs from '../../../components/ui/Tabs/Tabs'
import Button from '../../components/form/Button/Button'
import TextBox from '../../components/form/TextBox/TextBox'
import CheckBox from '../../../components/form/CheckBox/CheckBox'
import ComboBox from '../../components/form/ComboBox/ComboBox'
import NumberBox from '../../../components/NumberBox/NumberBox'
import Grid from '../../components/ui/Grid/Grid'
import GridColumn from '../../components/ui/Grid/components/GridColumn/GridColumn'
import Title from '../../components/ui/Title/Title'
import Field from '../../components/form/Field/Field'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import classes from './AdministrationPage.module.scss'

const AdministrationPagePanel: React.FC = (): React.ReactElement => {
    const [settings, setSettings] = useState<ISetting>({} as ISetting)
    const [settingsUpdate, setSettingsUpdate] = useState<ISetting>({} as ISetting)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        fetchSettingsHandler()
    }, [])

    const fetchSettingsHandler = () => {
        setFetching(true)

        AdministrationService.fetchSettings()
            .then((response: any) => {
                setSettings(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        setFetching(true)

        AdministrationService.saveSetting(settingsUpdate)
            .then((response: any) => {
                setSettings(response.data)
                setSettingsUpdate({})
            })
            .catch((error: any) => {
                console.error('Произошла ошибка сохранения данных', error)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Обработчик отмены
    const onCancelHandler = () => {
        setSettingsUpdate({})
    }

    // Получение значение из объекта
    const getSettingValue = (key: string): string | null => {
        if (settingsUpdate && key in settingsUpdate) {
            return settingsUpdate[key]
        }

        if (settings && key in settings) {
            return settings[key]
        }

        return null
    }

    // Установка значения в объекте
    const setSettingValue = (key: string, value: string) => {
        setSettingsUpdate({...settingsUpdate, [`${key}`]: value})
    }

    // Вкладка "Общие настройки"
    const renderCommonTab = (): React.ReactElement => {
        return (
            <div key='common' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <Grid className={classes.columns} isWrap>
                        <GridColumn width='32%'>
                            <Title type='h2'>Отображение</Title>

                            <Field label='Отображать дату статей'
                                   title='Отображать дату статей'
                                   type='vert'
                                   style='dark'
                            >
                                <ComboBox selected={getSettingValue('article_show_date') || 'date_created'}
                                          items={Object.values([
                                              {key: 'date_created', text: 'Дата создания'},
                                              {key: 'date_update', text: 'Дата обновления'}
                                          ] as ISelector[])}
                                          onSelect={(value: string) => setSettingValue('article_show_date', value)}
                                          placeHolder='Выберите дату для отображения'
                                          styleType='standard'
                                />
                            </Field>

                            <Field label='Количество записей на странице в панели'
                                   title='Количество записей на странице в панели'
                                   type='vert'
                                   style='dark'
                            >
                                <NumberBox value={getSettingValue('count_items_admin') || 20}
                                           min={1}
                                           step={1}
                                           max={999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('count_items_admin', value.toString())}
                                           placeHolder='Укажите количество записей, отображаемых на одной странице в административной панели'
                                />
                            </Field>
                        </GridColumn>

                        <GridColumn width='32%'>
                            <Title type='h2'>Карта (Yandex.Maps)</Title>

                            <Field label='API ключ'
                                   title='API ключ'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('map_api_key') || ''}
                                         onChange={(value: string) => setSettingValue('map_api_key', value)}
                                         placeHolder='Укажите API ключ для Yandex.Maps'
                                />
                            </Field>

                            <Field label='Цвет метки'
                                   title='Цвет метки'
                                   type='vert'
                                   style='dark'
                            >
                                <ComboBox selected={getSettingValue('map_icon_color') || 'islands#blueIcon'}
                                          items={Object.values(mapIconColors)}
                                          onSelect={(value: string) => setSettingValue('map_icon_color', value)}
                                          placeHolder='Выберите цвет метки'
                                          styleType='standard'
                                />
                            </Field>
                        </GridColumn>

                        <GridColumn width='32%'>
                        </GridColumn>
                    </Grid>
                </BlockingElement>
            </div>
        )
    }

    // Вкладка "Уведомления"
    const renderNotificationTab = (): React.ReactElement => {
        return (
            <div key='notification' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <Grid className={classes.columns} isWrap>
                        <GridColumn width='32%'>
                            <Title type='h2'>SMTP</Title>

                            <Field type='vert'
                                   style='dark'
                            >
                                <CheckBox label='Включить SMTP'
                                          type='modern'
                                          checked={(getSettingValue('smtp_enable') && getSettingValue('smtp_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('smtp_enable', value ? '1' : '0')}
                                />
                            </Field>

                            <Field type='vert'
                                   style='dark'
                            >
                                <CheckBox label='Использовать SSL'
                                          type='modern'
                                          checked={(getSettingValue('smtp_ssl') && getSettingValue('smtp_ssl') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('smtp_ssl', value ? '1' : '0')}
                                />
                            </Field>

                            <Field label='SMTP хост'
                                   title='SMTP хост'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('smtp_host') || ''}
                                         onChange={(value: string) => setSettingValue('smtp_host', value)}
                                         placeHolder='Укажите SMTP хост'
                                />
                            </Field>

                            <Field label='SMTP логин'
                                   title='SMTP логин'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('smtp_login') || ''}
                                         onChange={(value: string) => setSettingValue('smtp_login', value)}
                                         placeHolder='Укажите SMTP логин'
                                />
                            </Field>

                            <Field label='SMTP пароль'
                                   title='SMTP пароль'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('smtp_password') || ''}
                                         onChange={(value: string) => setSettingValue('smtp_password', value)}
                                         placeHolder='Укажите SMTP пароль'
                                         password={true}
                                />
                            </Field>

                            <Field label='E-mail отправителя'
                                   title='E-mail отправителя'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('smtp_email') || ''}
                                         onChange={(value: string) => setSettingValue('smtp_email', value)}
                                         placeHolder='Укажите E-mail отправителя'
                                />
                            </Field>
                        </GridColumn>

                        <GridColumn width='32%'>
                            <Title type='h2'>SMS</Title>

                            <Field type='vert'
                                   style='dark'
                            >
                                <CheckBox label='Включить SMS уведомления'
                                          type='modern'
                                          checked={(getSettingValue('sms_enable') && getSettingValue('sms_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('sms_enable', value ? '1' : '0')}
                                />
                            </Field>

                            <Field label='Адрес сервиса'
                                   title='Адрес сервиса'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('sms_address') || ''}
                                         onChange={(value: string) => setSettingValue('sms_address', value)}
                                         placeHolder='Укажите адрес сервиса'
                                />
                            </Field>

                            <Field label='API ключ'
                                   title='API ключ'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('sms_api_key') || ''}
                                         onChange={(value: string) => setSettingValue('sms_api_key', value)}
                                         placeHolder='Укажите API ключ'
                                />
                            </Field>
                        </GridColumn>

                        <GridColumn width='32%'>
                            <Title type='h2'>Telegram</Title>

                            <Field type='vert'
                                   style='dark'
                            >
                                <CheckBox label='Включить Push уведомления в Telegram'
                                          type='modern'
                                          checked={(getSettingValue('telegram_enable') && getSettingValue('telegram_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('telegram_enable', value ? '1' : '0')}
                                />
                            </Field>

                            <Field label='Идентификатор бота'
                                   title='Идентификатор бота'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('telegram_bot_id') || ''}
                                         onChange={(value: string) => setSettingValue('telegram_bot_id', value)}
                                         placeHolder='Укажите идентификатор бота'
                                />
                            </Field>

                            <Field label='API ключ бота'
                                   title='API ключ бота'
                                   type='vert'
                                   style='dark'
                            >
                                <TextBox value={getSettingValue('telegram_bot_api_key') || ''}
                                         onChange={(value: string) => setSettingValue('telegram_bot_api_key', value)}
                                         placeHolder='Укажите API ключ бота'
                                />
                            </Field>
                        </GridColumn>

                        <GridColumn width='32%'>
                            <Title type='h2'>Рассылка</Title>

                            <Field type='vert'
                                   style='dark'
                            >
                                <CheckBox label='Включить E-mail рассылку'
                                          type='modern'
                                          checked={(getSettingValue('mail_enable') && getSettingValue('mail_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('mail_enable', value ? '1' : '0')}
                                />
                            </Field>
                        </GridColumn>
                    </Grid>
                </BlockingElement>
            </div>
        )
    }

    // Вкладка "Функционал"
    const renderFunctionalTab = (): React.ReactElement => {
        return (
            <div key='functional' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <Grid className={classes.columns} isWrap>
                        <GridColumn width='32%'>
                            <Title type='h2'>Функциональные части</Title>

                            <Field label='Вебсокет для мессенджера'
                                   title='Вебсокет для мессенджера'
                                   type='vert'
                                   style='dark'
                            >
                                <CheckBox label=''
                                          type='modern'
                                          checked={(getSettingValue('websocket_messenger') && getSettingValue('websocket_messenger') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('websocket_messenger', value ? '1' : '0')}
                                />
                            </Field>

                            <Field label='Вебсокет для уведомлений'
                                   title='Вебсокет для уведомлений'
                                   type='vert'
                                   style='dark'
                            >
                                <CheckBox label=''
                                          type='modern'
                                          checked={(getSettingValue('websocket_notification') && getSettingValue('websocket_notification') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('websocket_notification', value ? '1' : '0')}
                                />
                            </Field>
                        </GridColumn>

                        <GridColumn width='32%'>
                        </GridColumn>

                        <GridColumn width='32%'>
                        </GridColumn>
                    </Grid>
                </BlockingElement>
            </div>
        )
    }

    // Вкладка "Медиа"
    const renderMediaTab = (): React.ReactElement => {
        return (
            <div key='media' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <Grid className={classes.columns} isWrap>
                        <GridColumn width='32%'>
                            <Title type='h2'>Изображения</Title>

                            <Field label='Ширина миниатюры изображения'
                                   title='Ширина миниатюры изображения'
                                   type='vert'
                                   style='dark'
                            >
                                <NumberBox value={getSettingValue('image_thumb_width') || 400}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_thumb_width', value.toString())}
                                           placeHolder='Укажите ширину миниатюры изображения'
                                />
                            </Field>

                            <Field label='Высота миниатюры изображения'
                                   title='Высота миниатюры изображения'
                                   type='vert'
                                   style='dark'
                            >
                                <NumberBox value={getSettingValue('image_thumb_height') || 400}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_thumb_height', value.toString())}
                                           placeHolder='Укажите ширину миниатюры изображения'
                                />
                            </Field>

                            <Field label='Ширина полного изображения'
                                   title='Ширина полного изображения'
                                   type='vert'
                                   style='dark'
                            >
                                <NumberBox value={getSettingValue('image_full_width') || 2000}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_full_width', value.toString())}
                                           placeHolder='Укажите ширину полного изображения'
                                />
                            </Field>

                            <Field label='Высота полного изображения'
                                   title='Высота полного изображения'
                                   type='vert'
                                   style='dark'
                            >
                                <NumberBox value={getSettingValue('image_full_height') || 2000}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_full_height', value.toString())}
                                           placeHolder='Укажите ширину полного изображения'
                                />
                            </Field>
                        </GridColumn>
                    </Grid>
                </BlockingElement>
            </div>
        )
    }

    const tabs: ITab = useMemo(() => {
        return {
            common: {title: 'Общие настройки', render: renderCommonTab()},
            notification: {title: 'Уведомления', render: renderNotificationTab()},
            functional: {title: 'Функционал', render: renderFunctionalTab()},
            media: {title: 'Медиа', render: renderMediaTab()}
        }
    }, [settings, settingsUpdate, fetching])

    return (
        <PanelView pageTitle='Администрирование'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Администрирование</Title>

                <div className={classes.tabs}>
                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>

                {Object.keys(settingsUpdate).length ?
                    <div className={classes.footer}>
                        <Button type='save'
                                icon='check'
                                onClick={onSaveHandler.bind(this)}
                                disabled={fetching}
                        >Сохранить</Button>

                        <Button type='regular'
                                icon='arrow-rotate-left'
                                onClick={onCancelHandler.bind(this)}
                                className='marginLeft'
                        >Отменить</Button>
                    </div>
                    : null
                }
            </Wrapper>
        </PanelView>
    )
}

AdministrationPagePanel.displayName = 'AdministrationPagePanel'

export default React.memo(AdministrationPagePanel)