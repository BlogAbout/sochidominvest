<?php

namespace App;

/**
 * AttachmentModel - Модель управления вложениями.
 */
class AttachmentModel extends Model
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
            SELECT *
            FROM `sdi_attachment`
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $item = parent::fetch();

        if (!empty($item)) {
            return AttachmentModel::formatDataToJson($item);
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
            SELECT sdi.*
            FROM `sdi_attachment` sdi
            $sqlWhere
            ORDER BY sdi.`id` DESC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, AttachmentModel::formatDataToJson($item));
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
            INSERT INTO `sdi_attachment`
                (`author`, `content`, `type`, `extension`, `date_created`, `date_update`, `active`)
            VALUES
                (:author, :content, :type, :extension, :dateCreated, :dateUpdate, :active)
        ";

        parent::query($sql);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('content', $payload['content']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('extension', $payload['extension']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);

        $item = parent::execute();

        if ($item) {
            $payload['id'] = (int)parent::lastInsertedId();

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
            UPDATE `sdi_attachment`
            SET
                `name` = :name,
                `description` = :description,
                `date_update` = :dateUpdate,
                `active` = :active
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
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
     * Удаляет элемент по id (меняет статус активности)
     *
     * @param int $id Идентификатор элемента
     * @return bool
     */
    public static function deleteItem(int $id): bool
    {
        $sql = "UPDATE `sdi_attachment` SET `active` = -1 WHERE `id` = :id";

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
            'author' => (int)$data['author'],
            'name' => $data['name'],
            'description' => $data['description'],
            'content' => $data['content'],
            'type' => $data['type'],
            'extension' => $data['extension'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active']
        ];
    }
}