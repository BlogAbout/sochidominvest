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
    public static function fetchBuildingById(int $id): array
    {
        $sql = "
            SELECT *,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bt.`id_tag`))
                       FROM sdi_building_tag AS bt
                       WHERE bt.`id_building` = bu.`id`
                   ) AS tags,
                   (
                       SELECT COUNT(bc.`id`)
                       FROM sdi_building_checker AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`active` = 1
                   ) AS countCheckers
            FROM `sdi_building` AS bu
            LEFT JOIN sdi_building_data bd on bu.`id` = bd.`id`
            WHERE bu.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $building = parent::fetch();

        if (!empty($building)) {
            $building = BuildingModel::formatDataToJson($building);
            $images = BuildingModel::fetchBuildingImages([$building['id']]);

            if (count($images)) {
                $building['images'] = $images;
            }

            return $building;
        }

        return [];
    }

    /**
     * Вернет список объектов недвижимости
     *
     * @param array $params Массив параметров фильтрации
     * @return array
     */
    public static function fetchBuildings(array $params): array
    {
        $resultList = [];
        $where = [];

        $sql = "
            SELECT *,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bt.`id_tag`))
                       FROM sdi_building_tag AS bt
                       WHERE bt.`id_building` = bu.`id`
                   ) AS tags,
                   (
                       SELECT COUNT(bc.`id`)
                       FROM sdi_building_checker AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`active` = 1
                   ) AS countCheckers
            FROM `sdi_building` AS bu
            LEFT JOIN sdi_building_data bd on bu.`id` = bd.`id`
        ";

        if (!empty($params['active'])) {
            array_push($where, 'bu.`active` IN (' . implode(',', $params['active']) . ')');
        }

        if (!empty($params['publish'])) {
            array_push($where, 'bu.`publish` = ' . $params['publish']);
        }

        if (count($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }

        parent::query($sql);
        $buildingList = parent::fetchAll();

        if (!empty($buildingList)) {
            $ids = [];
            foreach ($buildingList as $buildingData) {
                array_push($resultList, BuildingModel::formatDataToJson($buildingData));
                array_push($ids, (int)$buildingData['id']);
            }

            $images = BuildingModel::fetchBuildingImages($ids);

            if (count($images)) {
                foreach ($resultList as &$building) {
                    foreach ($images as $image) {
                        if ($image['idObject'] == $building['id']) {
                            array_push($building['images'], $image);
                        }
                    }
                }
            }
        }

        return $resultList;
    }

    /**
     * Создание объект недвижимости
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createBuilding(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_building`
                (name, description, address, date_created, date_update, active, publish, status, type)
            VALUES
                (:name, :description, :address, :dateCreated, :dateUpdate, :active, :publish, :status, :type)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('publish', $payload['publish']);
        parent::bindParams('status', $payload['status']);
        parent::bindParams('type', $payload['type']);

        $building = parent::execute();

        if ($building) {
            $payload['id'] = parent::lastInsertedId();

            BuildingModel::updateBuildingData($payload, false);
            BuildingModel::updateRelationsTags($payload['id'], $payload['tags']);
            BuildingModel::uploadImages($payload['id'], $payload['newImages']);

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
    public static function updateBuilding(array $payload): array
    {
        $sql = "
            UPDATE `sdi_building`
            SET
                name = :name,
                description = :description,
                address = :address,
                date_update = :dateUpdate,
                active = :active,
                publish = :publish,
                status = :status,
                type = :type
            WHERE id = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('publish', $payload['publish']);
        parent::bindParams('status', $payload['status']);
        parent::bindParams('type', $payload['type']);

        if (parent::execute()) {
            BuildingModel::updateBuildingData($payload, true);
            BuildingModel::updateRelationsTags($payload['id'], $payload['tags']);
            BuildingModel::updateImages($payload['images']);
            BuildingModel::uploadImages($payload['id'], $payload['newImages']);

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
     * Удаляет объект недвижимости по id (меняет статус активности)
     *
     * @param int $id Идентификатор объекта недвижимости
     * @return bool
     */
    public static function deleteBuilding(int $id): bool
    {
        $sql = "UPDATE `sdi_building` SET active = -1 WHERE id = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    public static function updateValuesBuilding(int $buildingId)
    {
        $sql = "
            SELECT MIN(`area`) as areaMin, MAX(`area`) as areaMax, MIN(`cost`) as costMin, MIN(`cost` / `area`) as costMinUnit
            FROM `sdi_building_checker`
            WHERE `id_building` = :buildingId
        ";

        parent::query($sql);
        parent::bindParams('buildingId', $buildingId);
        $values = parent::fetch();

        $sql = "
            UPDATE `sdi_building`
            SET
                area_min = :areaMin,
                area_max = :areaMax,
                cost_min = :costMin,
                cost_min_unit = :costMinUnit
            WHERE id = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $buildingId);
        parent::bindParams('areaMin', $values['areaMin']);
        parent::bindParams('areaMax', $values['areaMax']);
        parent::bindParams('costMin', $values['costMin']);
        parent::bindParams('costMinUnit', $values['costMinUnit']);
        parent::execute();
    }

    /**
     * Добавление/обновление информации об объекте недвижимости
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @param boolean $update Добавление данных или обновление
     */
    private static function updateBuildingData(array $payload, bool $update)
    {
        if ($update) {
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
                    water_supply = :waterSupply,
                    advantages = :advantages,
                    payments = :payments,
                    formalization = :formalization,
                    amount_contract = :amountContract,
                    surcharge_doc = :surchargeDoc,
                    surcharge_gas = :surchargeGas,
                    sale_no_resident = :saleNoResident
                WHERE id = :id
            ";
        } else {
            $sql = "
                INSERT INTO `sdi_building_data`
                    (id, house_class, material, house_type, entrance_house, parking, territory, ceiling_height,
                     maintenance_cost, distance_sea, gas, heating, electricity, sewerage, water_supply, advantages,
                     payments, formalization, amount_contract, surcharge_doc, surcharge_gas, sale_no_resident)
                VALUES
                    (:id, :houseClass, :material, :houseType, :entranceHouse, :parking, :territory, :ceilingHeight,
                     :maintenanceCost, :distanceSea, :gas, :heating, :electricity, :sewerage, :waterSupply, :advantages,
                     :payments, :formalization, :amountContract, :surchargeDoc, :surchargeGas, :saleNoResident)
            ";
        }

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('houseClass', $payload['houseClass']);
        parent::bindParams('material', $payload['material']);
        parent::bindParams('houseType', $payload['houseType']);
        parent::bindParams('entranceHouse', $payload['entranceHouse']);
        parent::bindParams('parking', $payload['parking']);
        parent::bindParams('territory', $payload['territory']);
        parent::bindParams('ceilingHeight', $payload['ceilingHeight']);
        parent::bindParams('maintenanceCost', $payload['maintenanceCost']);
        parent::bindParams('distanceSea', $payload['distanceSea']);
        parent::bindParams('gas', $payload['gas']);
        parent::bindParams('heating', $payload['heating']);
        parent::bindParams('electricity', $payload['electricity']);
        parent::bindParams('sewerage', $payload['sewerage']);
        parent::bindParams('waterSupply', $payload['waterSupply']);
        parent::bindParams('advantages', $payload['advantages'] ?? null);
        parent::bindParams('payments', $payload['payments'] ?? null);
        parent::bindParams('formalization', $payload['formalization'] ?? null);
        parent::bindParams('amountContract', $payload['amountContract']);
        parent::bindParams('surchargeDoc', $payload['surchargeDoc']);
        parent::bindParams('surchargeGas', $payload['surchargeGas']);
        parent::bindParams('saleNoResident', $payload['saleNoResident']);
        parent::execute();
    }

    /**
     * Обновление связей между объектами недвижимости и метками
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $tags Массив идентификаторов меток
     */
    private static function updateRelationsTags(int $buildingId, array $tags)
    {
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

    /**
     * Загрузка изображений на сервер и сохранение в базу данных
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $images Массив изображений
     */
    private static function uploadImages(int $buildingId, array $images)
    {
        if (count($images)) {
            foreach ($images as $image) {
                $fileName = parent::uploadFile($image->value, 'building', $buildingId);

                if ($fileName) {
                    $sql = "INSERT INTO `sdi_building_images` (`id_building`, `name`, `active`) VALUES (:buildingId, :name, 1)";

                    parent::query($sql);
                    parent::bindParams('buildingId', $buildingId);
                    parent::bindParams('name', $fileName);
                    parent::execute();
                }
            }
        }
    }

    /**
     * Обновление данных изображений в базе данных
     *
     * @param array $images Массив изображений
     */
    private static function updateImages(array $images)
    {
        if (count($images)) {
            foreach ($images as $image) {
                $sql = "
                    UPDATE `sdi_building_images`
                    SET
                        active = :active
                    WHERE id = :id
                ";

                parent::query($sql);
                parent::bindParams('id', $image->id);
                parent::bindParams('active', $image->active);
                parent::execute();
            }
        }
    }

    /**
     * Получение данных изображений к соответствующим объектам недвижимости
     *
     * @param array $buildingIds Массив дентификаторов объектов недвижимости
     * @return array
     */
    private static function fetchBuildingImages(array $buildingIds): array
    {
        $resultList = [];

        $sql = "
            SELECT *
            FROM `sdi_building_images`
            WHERE `id_building` IN (" . implode(',', $buildingIds) . ")
        ";

        parent::query($sql);

        $images = parent::fetchAll();

        if (!empty($images)) {
            foreach ($images as $image) {
                array_push($resultList, BuildingModel::formatImagesToJson($image));
            }
        }

        return $resultList;
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     *
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
            'active' => (int)$data['active'],
            'publish' => (int)$data['publish'],
            'status' => $data['status'],
            'author' => (int)$data['author'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'areaMin' => $data['area_min'],
            'areaMax' => $data['area_max'],
            'costMin' => $data['cost_min'],
            'costMinUnit' => $data['cost_min_unit'],
            'countCheckers' => $data['countCheckers'],
            'houseClass' => $data['house_class'],
            'material' => $data['material'],
            'houseType' => $data['house_type'],
            'entranceHouse' => $data['entrance_house'],
            'parking' => $data['parking'],
            'territory' => $data['territory'],
            'ceilingHeight' => (float)$data['ceiling_height'],
            'maintenanceCost' => (float)$data['maintenance_cost'],
            'distanceSea' => (float)$data['distance_sea'],
            'gas' => $data['gas'],
            'heating' => $data['heating'],
            'electricity' => $data['electricity'],
            'sewerage' => $data['sewerage'],
            'waterSupply' => $data['water_supply'],
            'advantages' => $data['advantages'] ? explode(',', $data['advantages']) : [],
            'payments' => $data['payments'] ? explode(',', $data['payments']) : [],
            'formalization' => $data['formalization'] ? explode(',', $data['formalization']) : [],
            'amountContract' => $data['amount_contract'],
            'surchargeDoc' => (float)$data['surcharge_doc'],
            'surchargeGas' => (float)$data['surcharge_gas'],
            'saleNoResident' => (int)$data['sale_no_resident'],
            'tags' => array_map('intval', $data['tags'] ? explode(',', $data['tags']) : []),
            'images' => [],
            'newImages' => []
        ];
    }

    /**
     * Преобразование выходящих данных изображений в формат для frontend
     *
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatImagesToJson(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'idObject' => (int)$data['id_building'],
            'name' => $data['name'],
            'active' => (int)$data['active'],
            'value' => '/uploads/building/' . $data['id_building'] . '/' . $data['name']
        ];
    }
}