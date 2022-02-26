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
    public static function fetchTagById($id)
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
            return array(
                'status' => true,
                'data' => TagModel::formatDataToJson($tag)
            );
        }

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
        $sql = "
            SELECT *
            FROM `sdi_tag`
        ";

        parent::query($sql);

        $tagList = parent::fetchAll();

        if (!empty($tagList)) {
            $resultList = [];

            foreach($tagList as $tagData) {
                array_push($resultList, TagModel::formatDataToJson($tagData));
            }

            return array(
                'status' => true,
                'data' => $resultList
            );
        }

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
        $sql = "
            INSERT INTO `sdi_tag`
                (name, active)
            VALUES
                (:name, :status)
        ";

        parent::query($sql);

        parent::bindParams('name', $payload['name']);
        parent::bindParams('active', $payload['active']);

        $tag = parent::execute();

        if ($tag) {
            $tagId = parent::lastInsertedId();
            $payload['id'] = $tagId;

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
    public static function updateTag($payload)
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

        $tag = parent::execute();

        if ($tag) {
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
     * Удаляет метку по id (меняет статус активности)
     *
     * @param int $id Идентификатор метки
     * @return array
     */
    public static function deleteTag($id)
    {
        $sql = "UPDATE `sdi_tag` SET active = 0 WHERE id = :id";

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
     * Преобразование выходящих данных в формат для frontend
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatDataToJson($data) {
        return [
            'id' => $data['id'],
            'name' => $data['name'],
            'active' => $data['active']
        ];
    }
}