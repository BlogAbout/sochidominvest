<?php

namespace App;

/**
 * SettingMiddleware. Контроллер управления настройками
 */
class SettingMiddleware
{
    protected static $instance;
    protected static $administrationModel;
    protected static $settings;
    protected static $defaultSettings = [
        'article_show_date' => 'date_created',
        'smtp_enable' => '0',
        'smtp_ssl' => '0',
        'smtp_host' => '',
        'smtp_login' => '',
        'smtp_password' => '',
        'smtp_email' => '',
        'sms_enable' => '0',
        'sms_address' => '',
        'sms_api_key' => '',
        'telegram_enable' => '0',
        'telegram_bot_id' => '',
        'telegram_bot_api_key' => '',
        'mail_enable' => '0',
        'websocket_messenger' => '0',
        'websocket_notification' => '0',
        'image_thumb_width' => '400',
        'image_thumb_height' => '400',
        'image_full_width' => '2000',
        'image_full_height' => '2000'
    ];

    /**
     * Инициализация SettingMiddleware
     */
    private function __construct()
    {
        $this->load();
    }

    public static function create(): SettingMiddleware
    {
        if (!self::$instance) {
            self::$instance = new SettingMiddleware();
        }

        return self::$instance;
    }

    /**
     * Загрузка перечня настроек
     */
    public function load()
    {
        self::$administrationModel = new AdministrationModel();
        self::$settings = self::$administrationModel->fetchSettings();
    }

    /**
     * Вернет значение настройки по имени
     *
     * @param string $settingName Наименование настройки
     * @param string|null $defaultValue Значение по умолчанию
     * @return string
     */
    public function get(string $settingName, string $defaultValue = null): string
    {
        if (!self::$settings) {
            if ($defaultValue) {
                return $defaultValue;
            } else if (self::$defaultSettings[$settingName]) {
                return self::$defaultSettings[$settingName];
            } else {
                return '';
            }
        } else {
            if (self::$settings[$settingName]) {
                return self::$settings[$settingName];
            } else if ($defaultValue) {
                return $defaultValue;
            } else if (self::$defaultSettings[$settingName]) {
                return self::$defaultSettings[$settingName];
            } else {
                return '';
            }
        }
    }
}