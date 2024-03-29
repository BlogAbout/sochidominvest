<?php

namespace App;

use DateTime;

/**
 * BuildingModel - Эта модель используется в основном BuildingController, а также другими контроллерами
 */
class BuildingModel extends Model
{
    /**
     * BuildingModel constructor.
     */
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

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
                       FROM `sdi_building_tag` AS bt
                       WHERE bt.`id_building` = bu.`id`
                   ) AS tags,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bc.`id_user`))
                       FROM `sdi_building_contact` AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`type_contact` = 'user'
                   ) AS contactUsers,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bc.`id_user`))
                       FROM `sdi_building_contact` AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`type_contact` = 'contact'
                   ) AS contactContacts,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bd.`id_developer`))
                       FROM `sdi_building_developer` AS bd
                       WHERE bd.`id_building` = bu.`id`
                   ) AS developers,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_agent`))
                       FROM `sdi_building_agent` AS ba
                       WHERE ba.`id_building` = bu.`id`
                   ) AS agents,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_article`))
                       FROM `sdi_building_article` AS ba
                       WHERE ba.`id_building` = bu.`id`
                   ) AS articles,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bi.`id_attachment`) ORDER BY bi.`ordering` ASC, bi.`id_attachment` ASC)
                       FROM `sdi_images` AS bi
                       WHERE bi.`id_object` = bu.`id` AND `type_object` = 'building'
                   ) AS images,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bv.`id_attachment`) ORDER BY bv.`ordering` ASC, bv.`id_attachment` ASC)
                       FROM `sdi_videos` AS bv
                       WHERE bv.`id_object` = bu.`id` AND `type_object` = 'building'
                   ) AS videos,
                   (
                       SELECT COUNT(bc.`id`)
                       FROM sdi_building_checker AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`active` = 1
                   ) AS countCheckers,
                   (
                       SELECT v.`views`
                       FROM `sdi_views` AS v
                       WHERE v.`id_object` = bu.`id` AND v.`type_object` = 'building'
                   ) AS views,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = bu.`author` AND u.`active` IN (0, 1)
                   ) AS authorName,
                   (
                       SELECT sbp.`cost`
                       FROM `sdi_building_price` AS sbp
                       WHERE sbp.`id_object` = bu.`id` AND sbp.`type_object` = 'building'
                       ORDER BY sbp.`date_update` DESC
                       LIMIT 1
                       OFFSET 1
                   ) AS costOld
            FROM `sdi_building` AS bu
            LEFT JOIN `sdi_building_data` bd on bu.`id` = bd.`id`
            WHERE bu.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $building = parent::fetch();

        if (!empty($building)) {
            $building['rentData'] = BuildingModel::fetchRentData($building['id']);

            return BuildingModel::formatDataToJson($building);
        }

        return [];
    }

    /**
     * Вернет график цен объекта недвижимости по id
     *
     * @param int $id Идентификатор недвижимости
     * @return array
     */
    public static function fetchBuildingPricesById(int $id): array
    {
        $sql = "
            SELECT sbp.`date_update`, sbp.`cost`
            FROM `sdi_building_price` AS sbp
            WHERE sbp.`id_object` = :buildingId AND sbp.`type_object` = 'building'
            ORDER BY sbp.`date_update` DESC
            LIMIT 10
        ";

        parent::query($sql);
        parent::bindParams('buildingId', $id);

        $list = parent::fetchAll();
        $prices = [];

        if (!empty($list)) {
            foreach($list as $item) {
                $prices[$item['date_update']] = $item['cost'];
            }
        }

        return $prices;
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
                       FROM `sdi_building_tag` AS bt
                       WHERE bt.`id_building` = bu.`id`
                   ) AS tags,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bc.`id_user`))
                       FROM `sdi_building_contact` AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`type_contact` = 'user'
                   ) AS contactUsers,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bc.`id_user`))
                       FROM `sdi_building_contact` AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`type_contact` = 'contact'
                   ) AS contactContacts,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bd.`id_developer`))
                       FROM `sdi_building_developer` AS bd
                       WHERE bd.`id_building` = bu.`id`
                   ) AS developers,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_agent`))
                       FROM `sdi_building_agent` AS ba
                       WHERE ba.`id_building` = bu.`id`
                   ) AS agents,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_article`))
                       FROM `sdi_building_article` AS ba
                       WHERE ba.`id_building` = bu.`id`
                   ) AS articles,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(i.`id_attachment`) ORDER BY i.`ordering` ASC, i.`id_attachment` ASC)
                       FROM `sdi_images` AS i
                       WHERE i.`id_object` = bu.`id` AND `type_object` = 'building'
                   ) AS images,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(v.`id_attachment`) ORDER BY v.`ordering` ASC, v.`id_attachment` ASC)
                       FROM `sdi_videos` AS v
                       WHERE v.`id_object` = bu.`id` AND `type_object` = 'building'
                   ) AS videos,
                   (
                       SELECT COUNT(bc.`id`)
                       FROM `sdi_building_checker` AS bc
                       WHERE bc.`id_building` = bu.`id` AND bc.`active` = 1
                   ) AS countCheckers,
                   (
                       SELECT v.`views`
                       FROM `sdi_views` AS v
                       WHERE v.`id_object` = bu.`id` AND v.`type_object` = 'building'
                   ) AS views,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = bu.`author` AND u.`active` IN (0, 1)
                   ) AS authorName,
                   (
                       SELECT sbp.`cost`
                       FROM `sdi_building_price` AS sbp
                       WHERE sbp.`id_object` = bu.`id` AND sbp.`type_object` = 'building'
                       ORDER BY sbp.`date_update` DESC
                       LIMIT 1
                       OFFSET 1
                   ) AS costOld
            FROM `sdi_building` AS bu
            LEFT JOIN `sdi_building_data` bd on bu.`id` = bd.`id`
        ";

        if (!empty($params['id'])) {
            array_push($where, 'bu.`id` IN (' . implode(',', $params['id']) . ')');
        }

        if (!empty($params['active'])) {
            array_push($where, 'bu.`active` IN (' . implode(',', $params['active']) . ')');
        }

        if (!empty($params['publish'])) {
            array_push($where, 'bu.`publish` = ' . $params['publish']);
        }

        if (!empty($params['rent'])) {
            array_push($where, 'bu.`rent` IN (' . implode(',', $params['rent']) . ')');
        }

        if (!empty($params['text'])) {
            array_push($where, '(bu.`name` LIKE "%' . $params['text'] . '%")');
        }

        if (count($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }

        parent::query($sql);
        $buildingList = parent::fetchAll();

        if (!empty($buildingList)) {
            $ids = [];

            foreach ($buildingList as $buildingData) {
                $buildingData['rentData'] = BuildingModel::fetchRentData($buildingData['id']);

                array_push($resultList, BuildingModel::formatDataToJson($buildingData));
                array_push($ids, (int)$buildingData['id']);
            }
        }

        return $resultList;
    }

    /**
     * Получение данных об аренде
     *
     * @param int $buildingId
     * @return array
     */
    private static function fetchRentData(int $buildingId): array
    {
        $sql = "SELECT * FROM `sdi_building_rent` WHERE `id_building` = :buildingId";

        parent::query($sql);
        parent::bindParams('buildingId', $buildingId);

        $rentData = parent::fetch();

        if (!empty($rentData)) {
            return BuildingModel::formatDataRentToJson($rentData);
        }

        return $rentData;
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
                (`name`, `description`, `address`, `coordinates`, `author`, `date_created`, `date_update`, `active`, `publish`,
                 `rent`, `status`, `type`, `area`, `cost`, `meta_title`, `meta_description`)
            VALUES
                (:name, :description, :address, :coordinates, :author, :dateCreated, :dateUpdate, :active, :publish,
                 :rent, :status, :type, :area, :cost, :metaTitle, :metaDescription)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('coordinates', $payload['coordinates']);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('publish', $payload['publish']);
        parent::bindParams('rent', $payload['rent']);
        parent::bindParams('status', $payload['status']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('area', $payload['area']);
        parent::bindParams('cost', $payload['cost']);
        parent::bindParams('metaTitle', $payload['metaTitle']);
        parent::bindParams('metaDescription', $payload['metaDescription']);

        $building = parent::execute();

        if ($building) {
            $payload['id'] = parent::lastInsertedId();

            BuildingModel::updateBuildingData($payload, false);

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
                `name` = :name,
                `description` = :description,
                `address` = :address,
                `coordinates` = :coordinates,
                `date_update` = :dateUpdate,
                `active` = :active,
                `publish` = :publish,
                `rent` = :rent,
                `status` = :status,
                `type` = :type,
                `area` = :area,
                `cost` = :cost,
                `meta_title` = :metaTitle,
                `meta_description` = :metaDescription
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('address', $payload['address']);
        parent::bindParams('coordinates', $payload['coordinates']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('publish', $payload['publish']);
        parent::bindParams('rent', $payload['rent']);
        parent::bindParams('status', $payload['status']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('area', $payload['area']);
        parent::bindParams('cost', $payload['cost']);
        parent::bindParams('metaTitle', $payload['metaTitle']);
        parent::bindParams('metaDescription', $payload['metaDescription']);

        if (parent::execute()) {
            BuildingModel::updateBuildingData($payload, true);

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
        $sql = "UPDATE `sdi_building` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    /**
     * Обновляет значения площади и цены на основе шахматки
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     */
    public static function updateValuesBuilding(int $buildingId)
    {
        $sql = "
            SELECT MIN(`area`) as areaMin, MAX(`area`) as areaMax, MIN(`cost`) as costMin, MAX(`cost`) as costMax, MIN(`cost` / `area`) as costMinUnit
            FROM `sdi_building_checker`
            WHERE `id_building` = :buildingId
        ";

        parent::query($sql);
        parent::bindParams('buildingId', $buildingId);
        $values = parent::fetch();

        $sql = "
            UPDATE `sdi_building`
            SET
                `area_min` = :areaMin,
                `area_max` = :areaMax,
                `cost_min` = :costMin,
                `cost_max` = :costMax,
                `cost_min_unit` = :costMinUnit
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $buildingId);
        parent::bindParams('areaMin', $values['areaMin']);
        parent::bindParams('areaMax', $values['areaMax']);
        parent::bindParams('costMin', $values['costMin']);
        parent::bindParams('costMax', $values['costMax']);
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
                    `district` = :district,
                    `district_zone` = :districtZone,
                    `house_class` = :houseClass,
                    `material` = :material,
                    `house_type` = :houseType,
                    `entrance_house` = :entranceHouse,
                    `parking` = :parking,
                    `territory` = :territory, 
                    `ceiling_height` = :ceilingHeight,
                    `maintenance_cost` = :maintenanceCost,
                    `distance_sea` = :distanceSea,
                    `gas` = :gas,
                    `heating` = :heating,
                    `electricity` = :electricity,
                    `sewerage` = :sewerage,
                    `water_supply` = :waterSupply,
                    `advantages` = :advantages,
                    `payments` = :payments,
                    `formalization` = :formalization,
                    `amount_contract` = :amountContract,
                    `surcharge_doc` = :surchargeDoc,
                    `surcharge_gas` = :surchargeGas,
                    `sale_no_resident` = :saleNoResident,
                    `passed` = :passed,
                    `id_avatar` = :avatarId,
                    `avatar` = :avatar,
                    `cadastr_number` = :cadastrNumber,
                    `cadastr_cost` = :cadastrCost
                WHERE `id` = :id
            ";
        } else {
            $sql = "
                INSERT INTO `sdi_building_data`
                    (`id`, `district`, `district_zone`, `house_class`, `material`, `house_type`, `entrance_house`,
                     `parking`, `territory`, `ceiling_height`, `maintenance_cost`, `distance_sea`, `gas`, `heating`,
                     `electricity`, `sewerage`, `water_supply`, `advantages`, `payments`, `formalization`,
                     `amount_contract`, `surcharge_doc`, `surcharge_gas`, `sale_no_resident`, `passed`, `id_avatar`,
                     `avatar`, `cadastr_number`, `cadastr_cost`)
                VALUES
                    (:id, :district, :districtZone, :houseClass, :material, :houseType, :entranceHouse,
                     :parking, :territory, :ceilingHeight, :maintenanceCost, :distanceSea, :gas, :heating,
                     :electricity, :sewerage, :waterSupply, :advantages, :payments, :formalization,
                     :amountContract, :surchargeDoc, :surchargeGas, :saleNoResident, :passed, :avatarId,
                     :avatar, :cadastrNumber, :cadastrCost)
            ";
        }

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('district', $payload['district']);
        parent::bindParams('districtZone', $payload['districtZone']);
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
        parent::bindParams('passed', $payload['passed'] ? json_encode($payload['passed']) : '');
        parent::bindParams('avatarId', $payload['avatarId']);
        parent::bindParams('avatar', $payload['avatar']);
        parent::bindParams('cadastrNumber', $payload['cadastrNumber']);
        parent::bindParams('cadastrCost', $payload['cadastrCost']);
        parent::execute();

        BuildingModel::updatePrices($payload['id'], 'building', $payload['cost']);
        BuildingModel::updateRent($payload);
        BuildingModel::updateRelationsTags($payload['id'], $payload['tags']);
        BuildingModel::updateRelationsDevelopers($payload['id'], $payload['developers']);
        BuildingModel::updateRelationsAgents($payload['id'], $payload['agents']);
        BuildingModel::updateRelationsContacts($payload['id'], $payload['contactUsers'], 'user');
        BuildingModel::updateRelationsContacts($payload['id'], $payload['contactContacts'], 'contact');
        BuildingModel::updateRelationsArticles($payload['id'], $payload['articles']);
        parent::updateRelationsImages($payload['images'], $payload['id'], 'building');
        parent::updateRelationsVideos($payload['videos'], $payload['id'], 'building');
    }

    /**
     * Сохранение изменения цены
     *
     * @param int $objectId Идентификатор объекта
     * @param string $objectType Тип объекта
     * @param float $cost Цена
     */
    public static function updatePrices(int $objectId, string $objectType, float $cost)
    {
        if (!$objectId || !$objectType || !$cost) {
            return;
        }

        $sql = "
            SELECT `cost`
            FROM `sdi_building_price`
            WHERE `id_object` = :objectId AND `type_object` = :objectType
            ORDER BY `date_update` DESC
            LIMIT 1
        ";

        parent::query($sql);
        parent::bindParams('objectId', $objectId);
        parent::bindParams('objectType', $objectType);

        $result = parent::fetch();

        if (!empty($result) && (float)$result['cost'] === $cost) {
            return;
        }

        $dateUpdate = new DateTime();
        $dateUpdate->setTime(0, 0);

        $sql = "
            INSERT INTO `sdi_building_price` (`id_object`, `type_object`, `date_update`, `cost`)
            VALUES (:objectId, :objectType, :dateUpdate, :cost)
            ON DUPLICATE KEY
            UPDATE `cost` = :cost
        ";

        self::query($sql);
        self::bindParams('objectId', $objectId);
        self::bindParams('objectType', $objectType);
        self::bindParams('dateUpdate', $dateUpdate->format('Y-m-d H:i:s'));
        self::bindParams('cost', $cost);
        self::execute();
    }

    /**
     * Обновление информации об аренде
     *
     * @param array $payload Массив данных объекта недвижимости
     */
    private static function updateRent(array $payload)
    {
        $sql = "DELETE FROM `sdi_building_rent` WHERE `id_building` = :buildingId";

        parent::query($sql);
        parent::bindParams('buildingId', $payload['id']);
        parent::execute();

        if ($payload['rent'] === 1 && $payload['rentData']) {
            $rentData = $payload['rentData'];

            $sql = "
                INSERT INTO `sdi_building_rent`
                    (`id_building`, `description`, `type`, `deposit`, `commission`, `cost`, `cost_deposit`, `cost_comission`)
                VALUES
                    (:buildingId, :description, :type, :deposit, :commission, :cost, :costDeposit, :costCommission)
            ";

            parent::query($sql);
            parent::bindParams('buildingId', $payload['id']);
            parent::bindParams('description', $rentData->description);
            parent::bindParams('type', $rentData->type);
            parent::bindParams('deposit', $rentData->deposit);
            parent::bindParams('commission', $rentData->commission);
            parent::bindParams('cost', $rentData->cost);
            parent::bindParams('costDeposit', $rentData->costDeposit);
            parent::bindParams('costCommission', $rentData->costCommission);
            parent::execute();
        }
    }

    /**
     * Обновление связей между объектами недвижимости и метками
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $tags Массив идентификаторов меток
     */
    private static function updateRelationsTags(int $buildingId, array $tags = array())
    {
        $sql = "DELETE FROM `sdi_building_tag` WHERE `id_building` = :id";

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
            " . implode(',', $tagsSql);

            parent::query($sql);
            parent::execute();
        }
    }

    /**
     * Обновление связей между объектами недвижимости и пользователями (контактами)
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $users Массив идентификаторов пользователей
     * @param string $type Тип контакта
     */
    private static function updateRelationsContacts(int $buildingId, array $users = array(), string $type)
    {
        $sql = "DELETE FROM `sdi_building_contact` WHERE `id_building` = :id AND `type_contact` = :type";

        parent::query($sql);
        parent::bindParams('id', $buildingId);
        parent::bindParams('type', $type);
        parent::execute();

        if (count($users)) {
            $usersSql = [];

            foreach ($users as $user) {
                array_push($usersSql, "($buildingId, $user, '$type')");
            }

            $sql = "
                INSERT INTO `sdi_building_contact`
                    (`id_building`, `id_user`, `type_contact`)
                VALUES
            " . implode(',', $usersSql);

            parent::query($sql);
            parent::execute();
        }
    }

    /**
     * Обновление связей между объектами недвижимости и застройщиками
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $developers Массив идентификаторов застройщиков
     */
    private static function updateRelationsDevelopers(int $buildingId, array $developers = array())
    {
        $sql = "DELETE FROM `sdi_building_developer` WHERE `id_building` = :id";

        parent::query($sql);
        parent::bindParams('id', $buildingId);
        parent::execute();

        if (count($developers)) {
            $developersSql = [];

            foreach ($developers as $developer) {
                array_push($developersSql, "($buildingId, $developer)");
            }

            $sql = "
                INSERT INTO `sdi_building_developer`
                    (`id_building`, `id_developer`)
                VALUES
            " . implode(',', $developersSql);

            parent::query($sql);
            parent::execute();
        }
    }

    /**
     * Обновление связей между объектами недвижимости и агентствами
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $agents Массив идентификаторов агентств
     */
    private static function updateRelationsAgents(int $buildingId, array $agents = array())
    {
        $sql = "DELETE FROM `sdi_building_agent` WHERE `id_building` = :id";

        parent::query($sql);
        parent::bindParams('id', $buildingId);
        parent::execute();

        if (count($agents)) {
            $agentsSql = [];

            foreach ($agents as $agent) {
                array_push($agentsSql, "($buildingId, $agent)");
            }

            $sql = "
                INSERT INTO `sdi_building_agent`
                    (`id_building`, `id_agent`)
                VALUES
            " . implode(',', $agentsSql);

            parent::query($sql);
            parent::execute();
        }
    }

    /**
     * Обновление связей между недвижимостью и статьями
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param array $articles Массив идентификаторов статей
     */
    private static function updateRelationsArticles(int $buildingId, array $articles = array())
    {
        $sql = "DELETE FROM `sdi_building_article` WHERE `id_building` = :id";

        parent::query($sql);
        parent::bindParams('id', $buildingId);
        parent::execute();

        if (count($articles)) {
            $insertSql = [];

            foreach ($articles as $article) {
                array_push($insertSql, "($buildingId, $article)");
            }

            $sql = "
                INSERT INTO `sdi_building_article`
                    (`id_building`, `id_article`)
                VALUES
            " . implode(',', $insertSql);

            parent::query($sql);
            parent::execute();
        }
    }

    /**
     * Отключение всех объектов недвижимости для указанного пользователя
     *
     * @param int $userId Идентификатор пользователя
     */
    public static function disableAllBuildingsForUser(int $userId): void
    {
        $sql = "
            UPDATE `sdi_building`
            SET `active` = 0
            WHERE `author` = :author AND `active` = 1
        ";

        parent::query($sql);
        parent::bindParams('author', $userId);

        parent::execute();
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
            'name' => html_entity_decode($data['name']),
            'description' => html_entity_decode($data['description']),
            'address' => html_entity_decode($data['address']),
            'coordinates' => html_entity_decode($data['coordinates']),
            'active' => (int)$data['active'],
            'publish' => (int)$data['publish'],
            'rent' => (int)$data['rent'],
            'status' => $data['status'],
            'author' => (int)$data['author'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'areaMin' => $data['area_min'],
            'areaMax' => $data['area_max'],
            'costMin' => $data['cost_min'],
            'costMax' => $data['cost_max'],
            'costMinUnit' => $data['cost_min_unit'],
            'countCheckers' => $data['countCheckers'],
            'district' => $data['district'],
            'districtZone' => $data['district_zone'],
            'houseClass' => $data['house_class'],
            'material' => $data['material'],
            'houseType' => $data['house_type'],
            'entranceHouse' => $data['entrance_house'],
            'parking' => $data['parking'],
            'territory' => $data['territory'],
            'ceilingHeight' => (float)$data['ceiling_height'],
            'maintenanceCost' => (float)$data['maintenance_cost'],
            'distanceSea' => (int)$data['distance_sea'],
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
            'contactUsers' => array_map('intval', $data['contactUsers'] ? explode(',', $data['contactUsers']) : []),
            'contactContacts' => array_map('intval', $data['contactContacts'] ? explode(',', $data['contactContacts']) : []),
            'developers' => array_map('intval', $data['developers'] ? explode(',', $data['developers']) : []),
            'agents' => array_map('intval', $data['agents'] ? explode(',', $data['agents']) : []),
            'articles' => array_map('intval', $data['articles'] ? explode(',', $data['articles']) : []),
            'images' => array_map('intval', $data['images'] ? explode(',', $data['images']) : []),
            'videos' => array_map('intval', $data['videos'] ? explode(',', $data['videos']) : []),
            'area' => (float)$data['area'],
            'cost' => (float)$data['cost'],
            'costOld' => (float)$data['costOld'],
            'metaTitle' => html_entity_decode($data['meta_title']),
            'metaDescription' => html_entity_decode($data['meta_description']),
            'passed' => $data['passed'] ? json_decode($data['passed']) : null,
            'views' => $data['views'] ? (int)$data['views'] : 0,
            'avatarId' => (int)$data['id_avatar'],
            'avatar' => $data['avatar'],
            'authorName' => $data['authorName'],
            'rentData' => $data['rentData'] ?: null,
            'cadastrNumber' => $data['cadastr_number'] ?: null,
            'cadastrCost' => $data['cadastr_cost'] ?: null
        ];
    }

    /**
     * Преобразование выходящих данных аренды в формат для frontend
     *
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatDataRentToJson(array $data): array
    {
        return [
            'description' => html_entity_decode($data['description']),
            'type' => $data['type'],
            'deposit' => (int)$data['deposit'],
            'commission' => (int)$data['commission'],
            'cost' => (float)$data['cost'],
            'costDeposit' => (float)$data['cost_deposit'],
            'costCommission' => (float)$data['cost_comission'],
        ];
    }
}