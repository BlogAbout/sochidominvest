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
            SELECT *
            FROM `sdi_developer`
            WHERE sdi_developer.`id` = :id
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
            SELECT *
            FROM `sdi_developer`
        ";

        if (!empty($params['active'])) {
            array_push($where, '`active` IN (' . implode(',', $params['active']) . ')');
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
                (name, description, address, phone, author, type, date_created, date_update, active)
            VALUES
                (:name, :description, :address, :phone, :author, :type, :dateCreated, :dateUpdate, :active)
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
                active = :active
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
     * Преобразование выходящих данных в формат для frontend
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatDataToJson(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'name' => $data['name'],
            'description' => $data['description'],
            'address' => $data['address'],
            'phone' => $data['phone'],
            'author' => (int)$data['author'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active']
        ];
    }
}