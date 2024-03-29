<?php

namespace App;

/**
 * ArticleModel - Модель управления статьями.
 */
class ArticleModel extends Model
{
    /**
     * Вернет статью по id
     *
     * @param int $id Идентификатор статьи
     * @return array
     */
    public static function fetchItemById(int $id): array
    {
        $sql = "
            SELECT *,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_building`))
                       FROM `sdi_building_article` AS ba
                       WHERE ba.`id_article` = `id`
                   ) AS buildings,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(i.`id_attachment`) ORDER BY i.`ordering` ASC, i.`id_attachment` ASC)
                       FROM `sdi_images` AS i
                       WHERE i.`id_object` = `id` AND `type_object` = 'article'
                   ) AS images,
                   (
                       SELECT v.`views`
                       FROM `sdi_views` AS v
                       WHERE v.`id_object` = `id` AND v.`type_object` = 'article'
                   ) AS views,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName
            FROM `sdi_article`
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $item = parent::fetch();

        if (!empty($item)) {
            return ArticleModel::formatDataToJson($item);
        }

        return [];
    }

    /**
     * Вернет список статей
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
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_building`))
                       FROM `sdi_building_article` AS ba
                       WHERE ba.`id_article` = sdi.`id`
                   ) AS buildings,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(i.`id_attachment`) ORDER BY i.`ordering` ASC, i.`id_attachment` ASC)
                       FROM `sdi_images` AS i
                       WHERE i.`id_object` = sdi.`id` AND `type_object` = 'article'
                   ) AS images,
                   (
                       SELECT v.`views`
                       FROM `sdi_views` AS v
                       WHERE v.`id_object` = sdi.`id` AND v.`type_object` = 'article'
                   ) AS views,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = sdi.`author` AND u.`active` IN (0, 1)
                   ) AS authorName
            FROM `sdi_article` sdi
            $sqlWhere
            ORDER BY sdi.`id` DESC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, ArticleModel::formatDataToJson($item));
            }
        }

        return $resultList;
    }

    /**
     * Создание статьи
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createItem(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_article`
                (`name`, `description`, `author`, `type`, `date_created`, `date_update`, `active`, `publish`,
                 `meta_title`, `meta_description`, `id_avatar`, `avatar`)
            VALUES
                (:name, :description, :author, :type, :dateCreated, :dateUpdate, :active, :publish,
                 :metaTitle, :metaDescription, :avatarId, :avatar)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('publish', $payload['publish']);
        parent::bindParams('metaTitle', $payload['metaTitle']);
        parent::bindParams('metaDescription', $payload['metaDescription']);
        parent::bindParams('avatarId', $payload['avatarId']);
        parent::bindParams('avatar', $payload['avatar']);

        $item = parent::execute();

        if ($item) {
            $payload['id'] = parent::lastInsertedId();

            ArticleModel::updateRelationsBuildings($payload['id'], $payload['buildings']);

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
     * Обновляет статью по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateItem(array $payload): array
    {
        $sql = "
            UPDATE `sdi_article`
            SET
                `name` = :name,
                `description` = :description,
                `type` = :type,
                `date_update` = :dateUpdate,
                `active` = :active,
                `publish` = :publish,
                `meta_title` = :metaTitle,
                `meta_description` = :metaDescription,
                `id_avatar` = :avatarId,
                `avatar` = :avatar
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('publish', $payload['publish']);
        parent::bindParams('metaTitle', $payload['metaTitle']);
        parent::bindParams('metaDescription', $payload['metaDescription']);
        parent::bindParams('avatarId', $payload['avatarId']);
        parent::bindParams('avatar', $payload['avatar']);

        if (parent::execute()) {
            ArticleModel::updateRelationsBuildings($payload['id'], $payload['buildings']);
            parent::updateRelationsImages($payload['images'], $payload['id'], 'article');

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
     * Удаляет статью по id (меняет статус активности)
     *
     * @param int $id Идентификатор статьи
     * @return bool
     */
    public static function deleteItem(int $id): bool
    {
        $sql = "UPDATE `sdi_article` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    /**
     * Обновление связей между статьей и объектами недвижимости
     *
     * @param int $articleId Идентификатор статьи
     * @param array $buildings Массив идентификаторов объектов недвижимости
     */
    private static function updateRelationsBuildings(int $articleId, array $buildings)
    {
        $sql = "DELETE FROM `sdi_building_article` WHERE `id_article` = :id";

        parent::query($sql);
        parent::bindParams('id', $articleId);
        parent::execute();

        if (count($buildings)) {
            $insertSql = [];

            foreach ($buildings as $building) {
                array_push($insertSql, "($building, $articleId)");
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
            'author' => (int)$data['author'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'publish' => (int)$data['publish'],
            'metaTitle' => html_entity_decode($data['meta_title']),
            'metaDescription' => html_entity_decode($data['meta_description']),
            'buildings' => array_map('intval', $data['buildings'] ? explode(',', $data['buildings']) : []),
            'images' => array_map('intval', $data['images'] ? explode(',', $data['images']) : []),
            'views' => $data['views'] ? (int)$data['views'] : 0,
            'avatarId' => (int)$data['id_avatar'],
            'avatar' => $data['avatar'],
            'authorName' => $data['authorName']
        ];
    }
}