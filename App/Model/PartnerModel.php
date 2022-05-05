<?php

namespace App;

/**
 * PartnerModel - Модель управления партнерами.
 */
class PartnerModel extends Model
{
    /**
     * Вернет элемент по id
     *
     * @param int $id Идентификатор элемента
     * @return array
     */
    public static function fetchItemById(int $id): array
    {
        $sql = "
            SELECT *,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = sdi.`author` AND u.`active` IN (0, 1)
                   ) AS authorName
            FROM `sdi_partner` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $item = parent::fetch();

        if (!empty($item)) {
            return self::formatDataToJson($item);
        }

        return [];
    }

    /**
     * Вернет список элементов
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $resultList = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = sdi.`author` AND u.`active` IN (0, 1)
                   ) AS authorName
            FROM `sdi_partner` sdi
            $sqlWhere
            ORDER BY sdi.`id` DESC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, self::formatDataToJson($item));
            }
        }

        return $resultList;
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
            INSERT INTO `sdi_partner`
                (`name`, `description`, `subtitle`, `author`, `type`, `date_created`, `date_update`, `active`,
                 `meta_title`, `meta_description`, `id_avatar`, `info`)
            VALUES
                (:name, :description, :subtitle, :author, :type, :dateCreated, :dateUpdate, :active,
                 :metaTitle, :metaDescription, :avatarId, :info)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('subtitle', $payload['subtitle']);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('metaTitle', $payload['metaTitle']);
        parent::bindParams('metaDescription', $payload['metaDescription']);
        parent::bindParams('avatarId', $payload['avatarId']);
        parent::bindParams('info', $payload['info']);

        $item = parent::execute();

        if ($item) {
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
     * Обновляет элемент по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateItem(array $payload): array
    {
        $sql = "
            UPDATE `sdi_partner`
            SET
                `name` = :name,
                `description` = :description,
                `subtitle` = :subtitle,
                `type` = :type,
                `date_update` = :dateUpdate,
                `active` = :active,
                `meta_title` = :metaTitle,
                `meta_description` = :metaDescription,
                `id_avatar` = :avatarId,
                `info` = :info
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('subtitle', $payload['subtitle']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('metaTitle', $payload['metaTitle']);
        parent::bindParams('metaDescription', $payload['metaDescription']);
        parent::bindParams('avatarId', $payload['avatarId']);
        parent::bindParams('info', $payload['info']);

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
     * Удаляет элемент по id (меняет статус активности)
     *
     * @param int $id Идентификатор элемента
     * @return bool
     */
    public static function deleteItem(int $id): bool
    {
        $sql = "UPDATE `sdi_partner` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
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
            'subtitle' => html_entity_decode($data['subtitle']),
            'author' => (int)$data['author'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'metaTitle' => html_entity_decode($data['meta_title']),
            'metaDescription' => html_entity_decode($data['meta_description']),
            'info' => $data['info'] ? json_decode($data['info']) : null,
            'avatarId' => (int)$data['id_avatar'],
            'avatar' => $data['avatar'],
            'authorName' => $data['authorName']
        ];
    }
}