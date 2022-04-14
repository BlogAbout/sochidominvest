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
     * @param int $id Идентификатор метки
     * @return array
     */
    public static function fetchTagById(int $id): array
    {
        $sql = "
            SELECT *
            FROM `sdi_tag`
            WHERE sdi_tag.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $tag = parent::fetch();

        if (!empty($tag)) {
            return TagModel::formatDataToJson($tag);
        }

        return [];
    }

    /**
     * Вернет список меток
     *
     * @return array
     */
    public static function fetchTags(): array
    {
        $resultList = [];

        $sql = "
            SELECT *
            FROM `sdi_tag`
            WHERE `active` != -1
        ";

        parent::query($sql);
        $tagList = parent::fetchAll();

        if (!empty($tagList)) {
            foreach ($tagList as $tagData) {
                array_push($resultList, TagModel::formatDataToJson($tagData));
            }
        }

        return $resultList;
    }

    /**
     * Создание метку
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createTag(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_tag`
                (name, active, author)
            VALUES
                (:name, :active, :author)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('author', $payload['author']);

        $tag = parent::execute();

        if ($tag) {
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
     * Обновляет метку по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateTag(array $payload): array
    {
        $sql = "
            UPDATE `sdi_tag`
            SET
                name = :name,
                active = :active
            WHERE id = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
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
     * Удаляет метку по id (меняет статус активности)
     *
     * @param int $id Идентификатор метки
     * @return bool
     */
    public static function deleteTag(int $id): bool
    {
        $sql = "UPDATE `sdi_tag` SET active = -1 WHERE id = :id";

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
            'name' => html_entity_decode($data['name']),
            'active' => (int)$data['active'],
            'author' => (int)$data['author']
        ];
    }
}