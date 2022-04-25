<?php

namespace App;

/**
 * AdministrationModel - Модель управления администрированием.
 */
class AdministrationModel extends Model
{
    /**
     * Вернет список настроек
     *
     * @return array
     */
    public static function fetchSettings(): array
    {
        $sql = "
            SELECT *
            FROM `sdi_setting`
        ";

        parent::query($sql);

        return parent::fetchAll();
    }

    /**
     * Сохранение настроек
     *
     * @param array $payload Содержит все поля, которые будут сохранены
     * @return array
     */
    public static function saveSettings(array $payload): array
    {
        if ($payload) {
            foreach ($payload as $item) {
                $sql = "
                    INSERT INTO `sdi_setting` (`name`, `value`)
                    VALUES (:name, :value)
                    ON DUPLICATE KEY
                    UPDATE `value` = :value
                ";

                parent::query($sql);
                parent::bindParams('name', $payload['name']);
                parent::bindParams('value', $payload['value']);
                parent::execute();
            }
        }

        return AdministrationModel::fetchSettings();
    }
}