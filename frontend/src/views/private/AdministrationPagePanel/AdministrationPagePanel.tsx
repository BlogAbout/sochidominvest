import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {ITab} from '../../../@types/ITab'
import {ISetting} from '../../../@types/ISetting'
import {ISelector} from '../../../@types/ISelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Tabs from '../../../components/Tabs/Tabs'
import Button from '../../../components/Button/Button'
import TextBox from '../../../components/TextBox/TextBox'
import CheckBox from '../../../components/CheckBox/CheckBox'
import ComboBox from '../../../components/ComboBox/ComboBox'
import NumberBox from '../../../components/NumberBox/NumberBox'
import classes from './AdministrationPagePanel.module.scss'

const AdministrationPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [updateSettings, setUpdateSettings] = useState<ISetting>({} as ISetting)

    const {settings, fetching} = useTypedSelector(state => state.administrationReducer)
    const {fetchSettings, saveSetting} = useActions()

    useEffect(() => {
        if (isUpdate || !settings.length) {
            fetchSettings()

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        saveSetting(updateSettings)
    }

    // Обработчик отмены
    const onCancel = () => {
        setUpdateSettings({})
    }

    // Получение значение из объекта
    const getSettingValue = (key: string): string | null => {
        if (updateSettings && key in updateSettings) {
            return updateSettings[key]
        }

        if (settings && key in settings) {
            return settings[key]
        }

        return null
    }

    // Установка значения в объекте
    const setSettingValue = (key: string, value: string) => {
        setUpdateSettings({...updateSettings, [`${key}`]: value})
    }

    const renderCommonTab = () => {
        return (
            <div key='common' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <div className={classes.cols}>
                        <div className={classes.col}>
                            <h2>Отображение</h2>

                            <div className={classes.field}>
                                <div className={classes.field_label}>Отображать дату статей</div>

                                <ComboBox selected={getSettingValue('article_show_date') || 'date_created'}
                                          items={Object.values([
                                              {key: 'date_created', text: 'Дата создания'},
                                              {key: 'date_update', text: 'Дата обновления'}
                                          ] as ISelector[])}
                                          onSelect={(value: string) => setSettingValue('article_show_date', value)}
                                          placeHolder='Выберите дату для отображения'
                                          styleType='standard'
                                />
                            </div>
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const renderNotificationTab = () => {
        return (
            <div key='notification' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <div className={classes.cols}>
                        <div className={classes.col}>
                            <h2>SMTP</h2>

                            <div className={classes.field}>
                                <CheckBox label='Включить SMTP'
                                          type='modern'
                                          checked={(getSettingValue('smtp_enable') && getSettingValue('smtp_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('smtp_enable', value ? '1' : '0')}
                                />
                            </div>

                            <div className={classes.field}>
                                <CheckBox label='Использовать SSL'
                                          type='modern'
                                          checked={(getSettingValue('smtp_ssl') && getSettingValue('smtp_ssl') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('smtp_ssl', value ? '1' : '0')}
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>SMTP хост</div>

                                <TextBox value={getSettingValue('smtp_host') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('smtp_host', value)}
                                         placeHolder='Укажите SMTP хост'
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>SMTP логин</div>

                                <TextBox value={getSettingValue('smtp_login') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('smtp_login', value)}
                                         placeHolder='Укажите SMTP логин'
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>SMTP пароль</div>

                                <TextBox value={getSettingValue('smtp_password') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('smtp_password', value)}
                                         placeHolder='Укажите SMTP пароль'
                                         password={true}
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>E-mail отправителя</div>

                                <TextBox value={getSettingValue('smtp_email') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('smtp_email', value)}
                                         placeHolder='Укажите E-mail отправителя'
                                />
                            </div>
                        </div>

                        <div className={classes.col}>
                            <h2>SMS</h2>

                            <div className={classes.field}>
                                <CheckBox label='Включить SMS уведомления'
                                          type='modern'
                                          checked={(getSettingValue('sms_enable') && getSettingValue('sms_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('sms_enable', value ? '1' : '0')}
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>Адрес сервиса</div>

                                <TextBox value={getSettingValue('sms_address') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('sms_address', value)}
                                         placeHolder='Укажите адрес сервиса'
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>API ключ</div>

                                <TextBox value={getSettingValue('sms_api_key') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('sms_api_key', value)}
                                         placeHolder='Укажите API ключ'
                                />
                            </div>
                        </div>

                        <div className={classes.col}>
                            <h2>Telegram</h2>

                            <div className={classes.field}>
                                <CheckBox label='Включить Push уведомления в Telegram'
                                          type='modern'
                                          checked={(getSettingValue('telegram_enable') && getSettingValue('telegram_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('telegram_enable', value ? '1' : '0')}
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>Идентификатор бота</div>

                                <TextBox value={getSettingValue('telegram_bot_id') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('telegram_bot_id', value)}
                                         placeHolder='Укажите идентификатор бота'
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>API ключ бота</div>

                                <TextBox value={getSettingValue('telegram_bot_api_key') || ''}
                                         onChange={(e: React.MouseEvent, value: string) => setSettingValue('telegram_bot_api_key', value)}
                                         placeHolder='Укажите API ключ бота'
                                />
                            </div>
                        </div>

                        <div className={classes.col}>
                            <h2>Рассылка</h2>

                            <div className={classes.field}>
                                <CheckBox label='Включить E-mail рассылку'
                                          type='modern'
                                          checked={(getSettingValue('mail_enable') && getSettingValue('mail_enable') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('mail_enable', value ? '1' : '0')}
                                />
                            </div>
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const renderFunctionalTab = () => {
        return (
            <div key='functional' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <div className={classes.cols}>
                        <div className={classes.col}>
                            <h2>Функциональные части</h2>

                            <div className={classes.field}>
                                <CheckBox label='Вебсокет для мессенджера'
                                          type='modern'
                                          checked={(getSettingValue('websocket_messenger') && getSettingValue('websocket_messenger') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('websocket_messenger', value ? '1' : '0')}
                                />
                            </div>

                            <div className={classes.field}>
                                <CheckBox label='Вебсокет для уведомлений'
                                          type='modern'
                                          checked={(getSettingValue('websocket_notification') && getSettingValue('websocket_notification') === '1') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('websocket_notification', value ? '1' : '0')}
                                />
                            </div>
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const renderMediaTab = () => {
        return (
            <div key='media' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <div className={classes.cols}>
                        <div className={classes.col}>
                            <h2>Изображения</h2>

                            <div className={classes.field}>
                                <div className={classes.field_label}>Ширина миниатюры изображения</div>

                                <NumberBox value={getSettingValue('image_thumb_width') || 400}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_thumb_width', value.toString())}
                                           placeHolder='Укажите ширину миниатюры изображения'
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>Высота миниатюры изображения</div>

                                <NumberBox value={getSettingValue('image_thumb_height') || 400}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_thumb_height', value.toString())}
                                           placeHolder='Укажите ширину миниатюры изображения'
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>Ширина полного изображения</div>

                                <NumberBox value={getSettingValue('image_full_width') || 2000}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_full_width', value.toString())}
                                           placeHolder='Укажите ширину полного изображения'
                                />
                            </div>

                            <div className={classes.field}>
                                <div className={classes.field_label}>Высота полного изображения</div>

                                <NumberBox value={getSettingValue('image_full_height') || 2000}
                                           min={0}
                                           step={1}
                                           max={9999}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => setSettingValue('image_full_height', value.toString())}
                                           placeHolder='Укажите ширину полного изображения'
                                />
                            </div>
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const tabs: ITab = {
        common: {title: 'Общие настройки', render: renderCommonTab()},
        notification: {title: 'Уведомления', render: renderNotificationTab()},
        functional: {title: 'Функционал', render: renderFunctionalTab()},
        media: {title: 'Медиа', render: renderMediaTab()}
    }

    return (
        <main className={classes.AdministrationPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Пользователи - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1><span>Администрирование</span></h1>

                <div className={classes.tabs}>
                    <Tabs tabs={tabs} paddingFirstTab='popup'/>
                </div>

                {Object.keys(updateSettings).length ?
                    <div className={classes.footer}>
                        <Button type='save'
                                icon='check'
                                onClick={onSave.bind(this)}
                                disabled={fetching}
                        >Сохранить</Button>

                        <Button type='regular'
                                icon='arrow-rotate-left'
                                onClick={onCancel.bind(this)}
                                className='marginLeft'
                        >Отменить</Button>
                    </div>
                    : null
                }
            </div>
        </main>
    )
}

AdministrationPagePanel.displayName = 'AdministrationPagePanel'

export default AdministrationPagePanel