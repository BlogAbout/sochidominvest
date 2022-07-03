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

    /**
     * Инициализация SettingMiddleware
     */
    private function __construct()
    {
        $this->load();
    }

    public static function init(): SettingMiddleware
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
            } else if (AdministrationModel::$defaultSettings[$settingName]) {
                return AdministrationModel::$defaultSettings[$settingName];
            } else {
                return '';
            }
        } else {
            if (self::$settings[$settingName]) {
                return self::$settings[$settingName];
            } else if ($defaultValue) {
                return $defaultValue;
            } else if (AdministrationModel::$defaultSettings[$settingName]) {
                return AdministrationModel::$defaultSettings[$settingName];
            } else {
                return '';
            }
        }
    }
}