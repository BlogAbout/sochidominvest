<?php

namespace App;

/**
 * UtilModel. Содержит методы взаимодействия для служебных функций
 */
class UtilModel extends Model
{
    /**
     * Обновление счетчика просмотра объекта
     *
     * @param int $objectId Идентификатор объекта
     * @param string $objectType Тип объекта
     * @return void
     */
    public static function updateCountViews(int $objectId, string $objectType)
    {
        $sql = "
            INSERT INTO `sdi_views` (`id_object`, `type_object`, `views`)
            VALUES (:objectId, :objectType, 1)
            ON DUPLICATE KEY
            UPDATE `views` = (`views` + 1)
        ";

        self::query($sql);
        self::bindParams('objectId', $objectId);
        self::bindParams('objectType', $objectType);
        self::execute();
    }
}