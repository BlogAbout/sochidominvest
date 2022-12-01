<?php

namespace App\Agent;

use App\Model;
use App\UtilModel;

class AgentService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Получение агентства по его идентификатору
     *
     * @param int $id Идентификатор агентства
     * @return Agent
     */
    public static function fetchItemById(int $id): Agent
    {
        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`description`, sdi.`address`, sdi.`phone`, sdi.`author`, sdi.`type`,
                   sdi.`date_created`, sdi.`date_update`, sdi.`active`, sdi.`id_avatar`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName,(
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bd.`id_building`))
                       FROM `sdi_building_agent` AS bd
                       WHERE bd.`id_agent` = sdi.`id`
                   ) AS buildings
            FROM `sdi_agent` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return Agent::initFromDB($data);
        }

        return Agent::initFromData();
    }

    /**
     * Извлекает список агентств
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $listResult = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`description`, sdi.`address`, sdi.`phone`, sdi.`author`, sdi.`type`,
                   sdi.`date_created`, sdi.`date_update`, sdi.`active`, sdi.`id_avatar`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName,(
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bd.`id_building`))
                       FROM `sdi_building_agent` AS bd
                       WHERE bd.`id_agent` = sdi.`id`
                   ) AS buildings
            FROM `sdi_agent` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($listResult, Agent::initFromDB($data));
            }
        }

        return $listResult;
    }

    /**
     * Добавление данных о новом агентстве в базу данных
     *
     * @param \App\Agent\Agent $agent
     */
    public static function insertItemToDb(Agent $agent): void
    {
        $dateNow = UtilModel::getDateNow();
        $agent->setDateCreated($dateNow);
        $agent->setDateUpdate($dateNow);

        $sql = "
            INSERT INTO `sdi_agent`
                (`name`, `description`, `address`, `phone`, `author`, `type`, `date_created`, `date_update`, `active`, `id_avatar`)
            VALUES
                (:name, :description, :address, :phone, :author, :type, :dateCreated, :dateUpdate, :active, :avatarId)
        ";

        parent::query($sql);
        parent::bindParams('name', $agent->getName());
        parent::bindParams('description', $agent->getDescription());
        parent::bindParams('address', $agent->getAddress());
        parent::bindParams('phone', $agent->getPhone());
        parent::bindParams('author', $agent->getAuthor());
        parent::bindParams('type', $agent->getType());
        parent::bindParams('dateCreated', $agent->getDateCreated());
        parent::bindParams('dateUpdate', $agent->getDateUpdate());
        parent::bindParams('active', $agent->getActive());
        parent::bindParams('avatarId', $agent->getAvatarId());

        $result = parent::execute();

        if ($result) {
            $agent->setId(parent::lastInsertedId());
        }
    }

    /**
     * Обновление данных об агентстве в базе данных
     *
     * @param \App\Agent\Agent $agent
     */
    public static function updateItemToDb(Agent $agent): void
    {
        $agent->setDateUpdate(UtilModel::getDateNow());

        $sql = "
            UPDATE `sdi_agent`
            SET
                `name` = :name,
                `description` = :description,
                `address` = :address,
                `phone` = :phone,
                `author` = :author,
                `type` = :type,
                `date_created` = :dateCreated,
                `date_update` = :dateUpdate,
                `active` = :active,
                `id_avatar` = :avatarId
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $agent->getId());
        parent::bindParams('name', $agent->getName());
        parent::bindParams('description', $agent->getDescription());
        parent::bindParams('address', $agent->getAddress());
        parent::bindParams('phone', $agent->getPhone());
        parent::bindParams('author', $agent->getAuthor());
        parent::bindParams('type', $agent->getType());
        parent::bindParams('dateCreated', $agent->getDateCreated());
        parent::bindParams('dateUpdate', $agent->getDateUpdate());
        parent::bindParams('active', $agent->getActive());
        parent::bindParams('avatarId', $agent->getAvatarId());

        parent::execute();
    }

    /**
     * Удаляет агентство по id (меняет статус активности)
     *
     * @param int $id Идентификатор агентства
     * @return bool
     */
    public static function deleteItemFromDb(int $id): bool
    {
        $sql = "UPDATE `sdi_agent` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }
}