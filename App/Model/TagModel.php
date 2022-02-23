<?php

namespace App;

/**
 * TagModel - Эта модель используется в основном TagController, а также другими контроллерами
 */
class TagModel extends Model
{
    /**
     * Вернет метку по id
     *
     * @param int $id Идентификатор недвижимости
     * @return array
     */
    public static function findTagById($id)
    {
//        $sql = "
//            SELECT *
//            FROM `sdi_building`
//            LEFT JOIN sdi_building_data sbd on sdi_building.`id` = sbd.`id`
//            WHERE sdi_building.`id` = :id
//        ";
//
//        parent::query($sql);
//
//        parent::bindParams('id', $id);
//
//        $building = parent::fetch();
//
//        if (!empty($building)) {
//            return array(
//                'status' => true,
//                'data' => $building
//            );
//        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Вернет список меток
     *
     * @return array
     */
    public static function fetchTags()
    {
//        $sql = "
//            SELECT *
//            FROM `sdi_building`
//            LEFT JOIN sdi_building_data sbd on sdi_building.`id` = sbd.`id`
//        ";
//
//        parent::query($sql);
//
//        $buildings = parent::fetchAll();
//
//        if (!empty($buildings)) {
//            return array(
//                'status' => true,
//                'data' => $buildings
//            );
//        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Создание метку
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createTag($payload)
    {
//        $sql = "
//            INSERT INTO `sdi_building`
//                (name, description, address, created_at, updated_at, active, status)
//            VALUES
//                (:name, :description, :address, :createdAt, :updatedAt, :active, :status)
//        ";
//
//        parent::query($sql);
//
//        parent::bindParams('name', $payload['name']);
//        parent::bindParams('description', $payload['description']);
//        parent::bindParams('address', $payload['address']);
//        parent::bindParams('createdAt', $payload['createdAt']);
//        parent::bindParams('updatedAt', $payload['updatedAt']);
//        parent::bindParams('active', $payload['active']);
//        parent::bindParams('status', $payload['status']);
//
//        $building = parent::execute();
//
//        if ($building) {
//            $productId = parent::lastInsertedId();
//            $payload['id'] = $productId;
//
//            TagModel::updateTagData($payload, false);
//
//            return array(
//                'status' => true,
//                'data' => $payload
//            );
//        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Обновляет метку по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateTag($payload)
    {
//        $sql = "
//            UPDATE `sdi_building`
//            SET
//                name = :name,
//                description = :description,
//                address = :address,
//                updated_at = :updatedAt,
//                active = :active,
//                status = :status
//            WHERE id = :id
//        ";
//
//        parent::query($sql);
//
//        parent::bindParams('id', $payload['id']);
//        parent::bindParams('name', $payload['name']);
//        parent::bindParams('description', $payload['description']);
//        parent::bindParams('address', $payload['address']);
//        parent::bindParams('updated_at', $payload['updatedAt']);
//        parent::bindParams('active', $payload['active']);
//        parent::bindParams('status', $payload['status']);
//
//        $product = parent::execute();
//
//        if ($product) {
//            TagModel::updateTagData($payload, true);
//
//            return array(
//                'status' => true,
//                'data' => $payload,
//            );
//        }

        return array(
            'status' => false,
            'data' => []
        );
    }
    
    /**
     * Удаляет метку по id (меняет статус активности)
     *
     * @param int $id Идентификатор метки
     * @return array
     */
    public static function deleteTag($id)
    {
//        $sql = "UPDATE `sdi_building` SET active = 0 WHERE id = :id";
//
//        parent::query($sql);
//
//        parent::bindParams('id', $id);
//
//        $building = parent::execute();
//
//        if ($building) {
//            return array(
//                'status' => true,
//                'data' => []
//            );
//        }

        return array(
            'status' => false,
            'data' => []
        );
    }
}