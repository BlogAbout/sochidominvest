<?php

namespace App;

/**
 * AdministrationModel - Модель управления администрированием.
 */
class AdministrationModel extends Model
{
    public static $defaultSettings = [
        'article_show_date' => 'date_created',
        'count_items_admin' => '20',
        'smtp_enable' => '0',
        'smtp_ssl' => '0',
        'smtp_host' => '',
        'smtp_login' => '',
        'smtp_password' => '',
        'smtp_email' => 'info@sochidominvest.ru',
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
        'image_full_height' => '2000',
        'map_api_key' => '',
        'map_icon_color' => 'islands#blueIcon'
    ];

    /**
     * Вернет список настроек
     *
     * @return array
     */
    public static function fetchSettings(): array
    {
        $sql = "SELECT * FROM sdi_setting";

        parent::query($sql);

        $list = parent::fetchAll();

        return AdministrationModel::formatSettingsDataToJson($list);
    }

    /**
     * Сохранение настроек
     *
     * @param \stdClass $payload Содержит все поля, которые будут сохранены
     * @return array
     */
    public static function saveSettings(\stdClass $payload): array
    {
        if ($payload) {
            foreach ($payload as $key => $val) {
                $sql = "
                    INSERT INTO `sdi_setting` (`name`, `value`)
                    VALUES (:name, :value)
                    ON DUPLICATE KEY
                    UPDATE `value` = :value
                ";

                parent::query($sql);
                parent::bindParams('name', $key);
                parent::bindParams('value', $val);
                parent::execute();
            }
        }

        return AdministrationModel::fetchSettings();
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatSettingsDataToJson(array $data): array
    {
        $resultList = AdministrationModel::$defaultSettings;

        if (count($data)) {
            foreach ($data as $item) {
                $resultList[$item['name']] = $item['value'];
            }
        }

        return $resultList;
    }
}