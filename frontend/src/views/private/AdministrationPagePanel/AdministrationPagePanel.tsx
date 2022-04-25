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
import classes from './AdministrationPagePanel.module.scss'

const AdministrationPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [updateSettings, setUpdateSettings] = useState<ISetting[]>([])

    const {settings, fetching} = useTypedSelector(state => state.administrationReducer)
    const {fetchSettings} = useActions()

    useEffect(() => {
        if (isUpdate || !settings.length) {
            fetchSettings()

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Обработчик отмены
    const onCancel = () => {

    }

    const getSettingValue = (key: string) => {
        // Todo
        return ''
    }

    const setSettingValue = (key: string, value: string) => {
        // Todo
    }

    const renderCommonTab = () => {
        return (
            <div key='common' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <div className={classes.cols}>
                        <div className={classes.col}>
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

    const renderSmtpTab = () => {
        return (
            <div key='smtp' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <div className={classes.cols}>
                        <div className={classes.col}>
                            <div className={classes.field}>
                                <CheckBox label='Использовать SMTP'
                                          type='modern'
                                          checked={!!getSettingValue('smtp_enable') || false}
                                          onChange={(e: React.MouseEvent, value: boolean) => setSettingValue('smtp_enable', value ? '1' : '0')}
                                />
                            </div>

                            <div className={classes.field}>
                                <CheckBox label='Использовать SSL'
                                          type='modern'
                                          checked={!!getSettingValue('smtp_ssl') || false}
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

                </BlockingElement>
            </div>
        )
    }

    const renderMediaTab = () => {
        return (
            <div key='media' className={classes.tabContent}>
                <BlockingElement fetching={fetching} className={classes.container}>

                </BlockingElement>
            </div>
        )
    }

    const tabs: ITab = {
        common: {title: 'Общие настройки', render: renderCommonTab()},
        smtp: {title: 'SMTP', render: renderSmtpTab()},
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

                {!updateSettings.length ?
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