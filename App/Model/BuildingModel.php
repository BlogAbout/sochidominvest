<?php

namespace App;

/**
 * BuildingModel - Эта модель используется в основном BuildingController, а также другими контроллерами
 */
class BuildingModel extends Model
{
    /**
     * Вернет объект недвижимости по id
     *
     * @param int $id Идентификатор недвижимости
     * @return array
     */
    public static function fetchBuildingById($id)
    {
        $sql = "
            SELECT *,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bt.`id_tag`))
                       FROM sdi_building_tag AS bt
                       WHERE bt.`id_building` = bu.`id`
                   ) AS tags
            FROM `sdi_building` AS bu
            LEFT JOIN sdi_building_data bd on bu.`id` = bd.`id`
            WHERE bu.`id` = :id
        ";

        parent::query($sql);

        parent::bindParams('id', $id);

        $building = parent::fetch();

        if (!empty($building)) {
            return array(
                'status' => true,
                'data' => $building
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Вернет список объектов недвижимости
     *
     * @return array
     */
    public static function fetchBuildings()
    {
        $sql = "
            SELECT *,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bt.`id_tag`))
                       FROM sdi_building_tag AS bt
                       WHERE bt.`id_building` = bu.`id`
                   ) AS tags
            FROM `sdi_building` AS bu
            LEFT JOIN sdi_building_data bd on bu.`id` = bd.`id`
        ";

        parent::query($sql);

        $buildingList = parent::fetchAll();

        if (!empty($buildingList)) {
            foreach($buildingList as &$building) {
                $building['tags'] = array_map('intval', $building['tags'] ? explode(',', $building['tags']) : []);
            }

            return array(
                'status' => true,
                'data' => $buildingList
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Создание объект недвижимости
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createBuilding($payload)
    {
        $sql = "
            INSERT INTO `sdi_building`
                (name, description, address, created_at, updated_at, active, status)
            VALUES
                (:name, :description, :address, :createdAt, :updatedAt, :active, :status)
        ";

        parent::query($sql);

        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('createdAt', $payload['createdAt']);
        parent::bindParams('updatedAt', $payload['updatedAt']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('status', $payload['status']);

        $building = parent::execute();

        if ($building) {
            $buildingId = parent::lastInsertedId();
            $payload['id'] = $buildingId;

            BuildingModel::updateBuildingData($payload, false);
            BuildingModel::updateRelationsTags($payload['id'], $payload['tags']);

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
     * Обновляет объект недвижимости по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateBuilding($payload)
    {
        $sql = "
            UPDATE `sdi_building`
            SET
                name = :name,
                description = :description,
                address = :address,
                updated_at = :updatedAt,
                active = :active,
                status = :status
            WHERE id = :id
        ";

        parent::query($sql);

        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('updated_at', $payload['updatedAt']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('status', $payload['status']);

        $building = parent::execute();

        if ($building) {
            BuildingModel::updateBuildingData($payload, true);
            BuildingModel::updateRelationsTags($payload['id'], $payload['tags']);

            return array(
                'status' => true,
                'data' => $payload,
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Добавление/обновление информации об объекте недвижимости
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @param boolean $update Добавление данных или обновление
     */
    private static function updateBuildingData($payload, $update)
    {
        if (!$update) {
            $sql = "
                INSERT INTO `sdi_building_data`
                    (id, house_class, material, house_type, entrance_house, parking, territory, ceiling_height,
                     maintenance_cost, distance_sea, gas, heating, electricity, sewerage, water_supply)
                VALUES
                    (:id, :houseClass, :material, :houseType, :entranceHouse, :parking, :territory, :ceilingHeight,
                     :maintenanceCost, :distanceSea, :gas, :heating, :electricity, :sewerage, :waterSupply)
            ";
        } else {
            $sql = "
                UPDATE `sdi_building_data`
                SET
                    house_class = :houseClass,
                    material = :material,
                    house_type = :houseType,
                    entrance_house = :entranceHouse,
                    parking = :parking,
                    territory = :territory, 
                    ceiling_height = :ceilingHeight,
                    maintenance_cost = :maintenanceCost,
                    distance_sea = :distanceSea,
                    gas = :gas,
                    heating = :heating,
                    electricity = :electricity,
                    sewerage = :sewerage,
                    water_supply = :waterSupply
                WHERE id = :id
            ";
        }

        parent::query($sql);

        parent::bindParams('id', $payload['id']);
        parent::bindParams('houseClass', $payload['houseClass']);
        parent::bindParams('material', $payload['material']);
        parent::bindParams('houseType', $payload['houseType']);
        parent::bindParams('entranceHouse', $payload['entranceHouse']);
        parent::bindParams('territory', $payload['territory']);
        parent::bindParams('ceilingHeight', $payload['ceilingHeight']);
        parent::bindParams('maintenanceCost', $payload['maintenanceCost']);
        parent::bindParams('distanceSea', $payload['distanceSea']);
        parent::bindParams('gas', $payload['gas']);
        parent::bindParams('heating', $payload['heating']);
        parent::bindParams('electricity', $payload['electricity']);
        parent::bindParams('sewerage', $payload['sewerage']);
        parent::bindParams('waterSupply', $payload['waterSupply']);

        parent::execute();
    }

    /**
     * Удаляет объект недвижимости по id (меняет статус активности)
     *
     * @param int $id Идентификатор объекта недвижимости
     * @return array
     */
    public static function deleteBuilding($id)
    {
        $sql = "UPDATE `sdi_building` SET active = 0 WHERE id = :id";

        parent::query($sql);

        parent::bindParams('id', $id);

        $building = parent::execute();

        if ($building) {
            return array(
                'status' => true,
                'data' => []
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Обновление связей между объектами недвижимости и метками
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $tags Массив идентификаторов меток
     */
    private static function updateRelationsTags($buildingId, $tags) {
        $sql = "DELETE FROM `sdi_building_tag` WHERE id_building = :id";

        parent::query($sql);
        parent::bindParams('id', $buildingId);
        parent::execute();

        if (count($tags)) {
            $tagsSql = [];

            foreach ($tags as $tag) {
                array_push($tagsSql, "($buildingId, $tag)");
            }
            $sql = "
                INSERT INTO `sdi_building_tag`
                    (`id_building`, `id_tag`)
                VALUES
            " . implode(",", $tagsSql);

            parent::query($sql);
            parent::bindParams('id', $buildingId);
            parent::execute();
        }
    }
}