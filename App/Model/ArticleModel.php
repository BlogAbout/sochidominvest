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
                       FROM sdi_building_article AS ba
                       WHERE ba.`id_article` = `id`
                   ) AS buildings,
                   (
                       SELECT v.`views`
                       FROM `sdi_views` AS v
                       WHERE v.`id_object` = `id` AND v.`type_object` = 'article'
                   ) AS views
            FROM `sdi_article`
            WHERE sdi_article.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $item = parent::fetch();

        if (!empty($item)) {
            $item = ArticleModel::formatDataToJson($item);
            $images = parent::fetchImages([
                'objectId' => [$item['id']],
                'objectType' => 'article',
                'active' => [1]
            ]);

            if (count($images)) {
                $item['images'] = $images;
            }

            return $item;
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
            SELECT *,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_building`))
                       FROM sdi_building_article AS ba
                       WHERE ba.`id_article` = `id`
                   ) AS buildings,
                   (
                       SELECT v.`views`
                       FROM `sdi_views` AS v
                       WHERE v.`id_object` = `id` AND v.`type_object` = 'article'
                   ) AS views
            FROM `sdi_article`
            $sqlWhere
            ORDER BY `id` DESC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            $ids = [];

            foreach ($list as $item) {
                array_push($resultList, ArticleModel::formatDataToJson($item));
                array_push($ids, (int)$item['id']);
            }

            $images = parent::fetchImages([
                'objectId' => $ids,
                'objectType' => 'article',
                'active' => [1]
            ]);

            if (count($images)) {
                foreach ($resultList as &$item) {
                    foreach ($images as $image) {
                        if ($image['objectId'] == $item['id']) {
                            array_push($item['images'], $image);
                        }
                    }
                }
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
                (name, description, author, type, date_created, date_update, active, publish, meta_title, meta_description)
            VALUES
                (:name, :description, :author, :type, :dateCreated, :dateUpdate, :active, :publish, :metaTitle, :metaDescription)
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

        $item = parent::execute();

        if ($item) {
            $payload['id'] = parent::lastInsertedId();

            ArticleModel::updateRelationsBuildings($payload['id'], $payload['buildings']);
            parent::uploadImages($payload['id'], 'article', $payload['newImages']);

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
                name = :name,
                description = :description,
                type = :type,
                date_update = :dateUpdate,
                active = :active,
                publish = :publish,
                meta_title = :metaTitle,
                meta_description = :metaDescription
            WHERE id = :id
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

        if (parent::execute()) {
            ArticleModel::updateRelationsBuildings($payload['id'], $payload['buildings']);
            parent::updateImages($payload['images']);
            parent::uploadImages($payload['id'], 'article', $payload['newImages']);

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
        $sql = "UPDATE `sdi_article` SET active = -1 WHERE id = :id";

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
            " . implode(",", $insertSql);

            parent::query($sql);
            parent::execute();
        }
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
            'author' => (int)$data['author'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'publish' => (int)$data['publish'],
            'metaTitle' => $data['meta_title'],
            'metaDescription' => $data['meta_description'],
            'buildings' => array_map('intval', $data['buildings'] ? explode(',', $data['buildings']) : []),
            'images' => [],
            'newImages' => [],
            'views' => $data['views'] ? (int)$data['views'] : 0
        ];
    }
}