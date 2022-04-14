<?php

namespace App;

/**
 * FavoriteModel - Модель управления избранным.
 */
class FavoriteModel extends Model
{
    /**
     * Вернет список элементов
     *
     * @param int $userId Идентификатор пользователя
     * @return array
     */
    public static function fetchList(int $userId): array
    {
        $sql = "
            SELECT `id_building`
            FROM `sdi_favorite`
            WHERE `id_user` = :userId
        ";

        parent::query($sql);
        parent::bindParams('userId', $userId);

        $list = parent::fetchColumn();

        return array_map('intval', $list ?? []);
    }

    /**
     * Создание элемента
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createItem(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_favorite` (`id_user`, `id_building`)
            VALUES (:userId, :buildingId)
        ";

        parent::query($sql);
        parent::bindParams('userId', $payload['userId']);
        parent::bindParams('buildingId', $payload['buildingId']);
        parent::execute();

        return self::fetchList($payload['userId']);
    }

    /**
     * Удаляет элемент по id
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param int $userId Идентификатор пользователя
     * @return array
     */
    public static function deleteItem(int $buildingId, int $userId): array
    {
        $sql = "DELETE FROM `sdi_favorite` WHERE `id_user` = :userId AND `id_building` = :buildingId";

        parent::query($sql);
        parent::bindParams('buildingId', $buildingId);
        parent::bindParams('userId', $userId);
        parent::execute();

        return self::fetchList($userId);
    }
}