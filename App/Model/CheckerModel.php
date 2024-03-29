<?php

namespace App;

use DateTime;

/**
 * CheckerModel - Эта модель используется в основном CheckerController, а также другими контроллерами
 */
class CheckerModel extends Model
{
    /**
     * Вернет квартиру по id
     *
     * @param int $id Идентификатор квартиры
     * @return array
     */
    public static function fetchCheckerById(int $id): array
    {
        $sql = "
            SELECT sdi.*,
                   (
                       SELECT sbp.`cost`
                       FROM `sdi_building_price` AS sbp
                       WHERE sbp.`id_object` = sdi.`id` AND sbp.`type_object` = 'checker'
                       ORDER BY sbp.`date_update` DESC
                       LIMIT 1
                       OFFSET 1
                   ) AS costOld
            FROM `sdi_building_checker` AS sdi
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $checker = parent::fetch();

        if (!empty($checker)) {
            return CheckerModel::formatDataToJson($checker);
        }

        return [];
    }

    /**
     * Вернет список квартир
     *
     * @param array $filter Массив данных для фильтрации
     * @return array
     */
    public static function fetchCheckers($filter = [], $buildingId = 0): array
    {
        $resultList = [];

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT sbp.`cost`
                       FROM `sdi_building_price` AS sbp
                       WHERE sbp.`id_object` = sdi.`id` AND sbp.`type_object` = 'checker'
                       ORDER BY sbp.`date_update` DESC
                       LIMIT 1
                       OFFSET 1
                   ) AS costOld
            FROM `sdi_building_checker` AS sdi
        ";

        $where = [];
        if ($filter['active'] && count($filter['active'])) {
            array_push($where, "`active` IN (" . implode(',', $filter['active']) . ")");
        }

        if ($buildingId) {
            array_push($where, "`id_building` = " . $buildingId);
        }

        if (count($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }

        parent::query($sql);
        $checkersList = parent::fetchAll();

        if (!empty($checkersList)) {
            foreach ($checkersList as $checkerData) {
                array_push($resultList, CheckerModel::formatDataToJson($checkerData));
            }
        }

        return $resultList;
    }

    /**
     * Создание квартиры
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createChecker(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_building_checker`
                (id_building, name, author, area, cost, furnish, housing, stage,
                 rooms, date_created, date_update, active, status)
            VALUES
                (:buildingId, :name, :author, :area, :cost, :furnish, :housing, :stage,
                 :rooms, :dateCreated, :dateUpdate, :active, :status)
        ";

        parent::query($sql);
        parent::bindParams('buildingId', $payload['buildingId']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('area', $payload['area']);
        parent::bindParams('cost', $payload['cost']);
        parent::bindParams('furnish', $payload['furnish']);
        parent::bindParams('housing', $payload['housing']);
        parent::bindParams('stage', $payload['stage']);
        parent::bindParams('rooms', $payload['rooms']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('status', $payload['status']);

        $checker = parent::execute();

        if ($checker) {
            $payload['id'] = parent::lastInsertedId();

            BuildingModel::updateValuesBuilding($payload['buildingId']);
            BuildingModel::updatePrices($payload['id'], 'checker', $payload['cost']);

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
     * Обновляет квартиру по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateChecker(array $payload): array
    {
        $sql = "
            UPDATE `sdi_building_checker`
            SET
                id_building = :buildingId,
                name = :name,
                area = :area,
                cost = :cost,
                furnish = :furnish,
                housing = :housing,
                stage = :stage,
                rooms = :rooms,
                date_created = :dateCreated,
                date_update = :dateUpdate,
                active = :active,
                status = :status
            WHERE id = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('buildingId', $payload['buildingId']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('area', $payload['area']);
        parent::bindParams('cost', $payload['cost']);
        parent::bindParams('furnish', $payload['furnish']);
        parent::bindParams('housing', $payload['housing']);
        parent::bindParams('stage', $payload['stage']);
        parent::bindParams('rooms', $payload['rooms']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('status', $payload['status']);

        if (parent::execute()) {
            BuildingModel::updateValuesBuilding($payload['buildingId']);
            BuildingModel::updatePrices($payload['id'], 'checker', $payload['cost']);

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
     * Удаляет квартиру по id (меняет статус активности)
     *
     * @param int $id Идентификатор квартиры
     * @return bool
     */
    public static function deleteChecker(int $id): bool
    {
        $sql = "UPDATE `sdi_building_checker` SET active = -1 WHERE id = :id";

        parent::query($sql);
        parent::bindParams('id', $id);
        $status = parent::execute();

        $checker = CheckerModel::fetchCheckerById($id);

        BuildingModel::updateValuesBuilding($checker['id_building']);

        return $status;
    }

    /**
     * Отключение всех шахмоток для указанного пользователя
     *
     * @param int $userId Идентификатор пользователя
     */
    public static function disableAllCheckersForUser(int $userId): void
    {
        $sql = "
            UPDATE `sdi_building_checker`
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
            'buildingId' => (int)$data['id_building'],
            'author' => (int)$data['author'],
            'name' => html_entity_decode($data['name']),
            'area' => (float)$data['area'],
            'cost' => (float)$data['cost'],
            'costOld' => (float)$data['costOld'],
            'furnish' => $data['furnish'],
            'housing' => (int)$data['housing'],
            'stage' => $data['stage'],
            'rooms' => (int)$data['rooms'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'status' => $data['status']
        ];
    }
}