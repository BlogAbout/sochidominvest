<?php

namespace App;

/**
 * DeveloperModel - Эта модель используется в основном DeveloperController, а также другими контроллерами
 */
class DeveloperModel extends Model
{
    /**
     * Вернет застройщика по id
     *
     * @param int $id Идентификатор застройщика
     * @return array
     */
    public static function fetchDeveloperById(int $id): array
    {
        $sql = "
            SELECT sdi.*,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bd.`id_building`))
                       FROM `sdi_building_developer` AS bd
                       WHERE bd.`id_developer` = sdi.`id`
                   ) AS buildings,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar
            FROM `sdi_developer` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $developer = parent::fetch();

        if (!empty($developer)) {
            return DeveloperModel::formatDataToJson($developer);
        }

        return [];
    }

    /**
     * Вернет список застройщиков
     *
     * @param array $params Массив параметров фильтрации
     * @return array
     */
    public static function fetchDevelopers(array $params): array
    {
        $resultList = [];
        $where = [];

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bd.`id_building`))
                       FROM `sdi_building_developer` AS bd
                       WHERE bd.`id_developer` = sdi.`id`
                   ) AS buildings,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar
            FROM `sdi_developer` sdi
        ";

        if (!empty($params['active'])) {
            array_push($where, 'sdi.`active` IN (' . implode(',', $params['active']) . ')');
        }

        if (!empty($params['text'])) {
            array_push($where, '(sdi.`name` LIKE "%' . $params['text'] . '%")');
        }

        if (count($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }

        parent::query($sql);
        $developerList = parent::fetchAll();

        if (!empty($developerList)) {
            foreach ($developerList as $developerData) {
                array_push($resultList, DeveloperModel::formatDataToJson($developerData));
            }
        }

        return $resultList;
    }

    /**
     * Создание застройщика
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createDeveloper(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_developer`
                (name, description, address, phone, author, type, date_created, date_update, active, id_avatar)
            VALUES
                (:name, :description, :address, :phone, :author, :type, :dateCreated, :dateUpdate, :active, :avatarId)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('avatarId', $payload['avatarId']);

        $developer = parent::execute();

        if ($developer) {
            $payload['id'] = parent::lastInsertedId();

            return array(
                'status' => true,
                'data' => $payload
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Обновляет застройщика по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateDeveloper(array $payload): array
    {
        $sql = "
            UPDATE `sdi_developer`
            SET
                name = :name,
                description = :description,
                address = :address,
                phone = :phone,
                type = :type,
                date_update = :dateUpdate,
                active = :active,
                id_avatar = :avatarId
            WHERE id = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('avatarId', $payload['avatarId']);

        if (parent::execute()) {
            return array(
                'status' => true,
                'data' => $payload
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Удаляет застройщика по id (меняет статус активности)
     *
     * @param int $id Идентификатор застройщика
     * @return bool
     */
    public static function deleteDeveloper(int $id): bool
    {
        $sql = "UPDATE `sdi_developer` SET active = -1 WHERE id = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    /**
     * Отключение всех застройщиков для указанного пользователя
     *
     * @param int $userId Идентификатор пользователя
     */
    public static function disableAllDevelopersForUser(int $userId): void
    {
        $sql = "
            UPDATE `sdi_developer`
            SET `active` = 0
            WHERE `author` = :author AND `active` = 1
        ";

        parent::query($sql);
        parent::bindParams('author', $userId);

        parent::execute();
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatDataToJson(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'name' => html_entity_decode($data['name']),
            'description' => html_entity_decode($data['description']),
            'address' => $data['address'],
            'phone' => $data['phone'],
            'author' => (int)$data['author'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'avatarId' => (int)$data['id_avatar'],
            'avatar' => $data['avatar'],
            'buildings' => array_map('intval', $data['buildings'] ? explode(',', $data['buildings']) : [])
        ];
    }
}