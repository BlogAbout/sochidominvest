<?php

namespace App;

/**
 * DocumentModel - Эта модель используется в основном DocumentController, а также другими контроллерами
 */
class DocumentModel extends Model
{
    /**
     * Вернет документ по id
     *
     * @param int $id Идентификатор документа
     * @return array
     */
    public static function fetchDocumentById(int $id): array
    {
        $sql = "
            SELECT *, a.`content` AS url
            FROM `sdi_document`
            LEFT JOIN `sdi_attachment` a ON a.`id` = `id_attachment`
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $document = parent::fetch();

        if (!empty($document)) {
            return DocumentModel::formatDataToJson($document);
        }

        return [];
    }

    /**
     * Вернет список документов
     *
     * @param array $filter Массив фильтров
     * @return array
     */
    public static function fetchDocuments(array $filter): array
    {
        $resultList = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.*, a.`content` AS url
            FROM `sdi_document` sdi
            LEFT JOIN `sdi_attachment` a ON a.`id` = sdi.`id_attachment`
            $sqlWhere
            ORDER BY sdi.`id` DESC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, DocumentModel::formatDataToJson($item));
            }
        }

        return $resultList;
    }

    /**
     * Создание документа
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createDocument(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_document`
                (`name`, `author`, `id_attachment`, `id_object`, `type_object`, `type`, `content`, `date_created`, `date_update`, `active`)
            VALUES
                (:name, :author, :attachmentId, :objectId, :objectType, :type, :content, :dateCreated, :dateUpdate, :active)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('attachmentId', $payload['attachmentId']);
        parent::bindParams('objectId', $payload['objectId']);
        parent::bindParams('objectType', $payload['objectType']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('content', $payload['content']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);

        $document = parent::execute();

        if ($document) {
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
     * Обновляет документ по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateDocument(array $payload): array
    {
        $sql = "
            UPDATE `sdi_document`
            SET
                `name` = :name,
                `id_attachment` = :objectId,
                `id_object` = :objectId,
                `type_object` = :objectType,
                `type` = :type,
                `content` = :content,
                `date_update` = :dateUpdate,
                `active` = :active
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('attachmentId', $payload['attachmentId']);
        parent::bindParams('objectId', $payload['objectId']);
        parent::bindParams('objectType', $payload['objectType']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('content', $payload['content']);
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
     * Удаляет документ по id (меняет статус активности)
     *
     * @param int $id Идентификатор документа
     * @return bool
     */
    public static function deleteDocument(int $id): bool
    {
        $sql = "UPDATE `sdi_document` SET `active` = -1 WHERE `id` = :id";

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
            'name' => html_entity_decode($data['name']),
            'attachmentId' => $data['id_attachment'] ? (int)$data['id_attachment'] : null,
            'objectId' => $data['id_object'] ? (int)$data['id_object'] : null,
            'objectType' => $data['type_object'],
            'type' => $data['type'],
            'content' => $data['content'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'url' => $data['url']
        ];
    }
}