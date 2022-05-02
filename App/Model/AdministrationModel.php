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
        $resultList = [];

        if (count($data)) {
            foreach ($data as $item) {
                $resultList[$item['name']] = $item['value'];
            }
        }

        return $resultList;
    }
}