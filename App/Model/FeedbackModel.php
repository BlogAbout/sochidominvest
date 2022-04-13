<?php

namespace App;

/**
 * FeedbackModel - Эта модель используется в основном FeedbackController, а также другими контроллерами
 */
class FeedbackModel extends Model
{
    /**
     * Вернет заявку по id
     *
     * @param int $id Идентификатор заявки
     * @return array
     */
    public static function fetchFeedById(int $id): array
    {
        $sql = "
            SELECT *
            FROM `sdi_feedback`
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $feed = parent::fetch();

        if (!empty($feed)) {
            return FeedbackModel::formatDataToJson($feed);
        }

        return [];
    }

    /**
     * Вернет список заявок
     *
     * @param array $filter Массив фильтров
     * @return array
     */
    public static function fetchFeeds(array $filter): array
    {
        $resultList = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.*
            FROM `sdi_feedback` sdi
            $sqlWhere
            ORDER BY sdi.`id` DESC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, FeedbackModel::formatDataToJson($item));
            }
        }

        return $resultList;
    }

    /**
     * Создание заявки
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createFeed(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_feedback`
                (id_user, author, phone, name, title, type, id_object, type_object, date_created, date_update, active, status)
            VALUES
                (:userId, :author, :phone, :name, :title, :type, :objectId, :objectType, :dateCreated, :dateUpdate, :active, :status)
        ";

        parent::query($sql);
        parent::bindParams('userId', $payload['userId']);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('title', $payload['title']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('objectId', $payload['objectId']);
        parent::bindParams('objectType', $payload['objectType']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('status', $payload['status']);

        $feed = parent::execute();

        if ($feed) {
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
     * Обновляет заявку по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateFeed(array $payload): array
    {
        $sql = "
            UPDATE `sdi_feedback`
            SET
                id_user = :userId,
                phone = :phone,
                name = :name,
                title = :title,
                type = :type,
                id_object = :objectId,
                type_object = :objectType,
                date_update = :dateUpdate,
                active = :active,
                status = :status
            WHERE id = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('userId', $payload['userId']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('title', $payload['title']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('objectId', $payload['objectId']);
        parent::bindParams('objectType', $payload['objectType']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('status', $payload['status']);

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
     * Удаляет заявку по id (меняет статус активности)
     *
     * @param int $id Идентификатор заявки
     * @return bool
     */
    public static function deleteFeed(int $id): bool
    {
        $sql = "UPDATE `sdi_feedback` SET active = -1 WHERE id = :id";

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
            'userId' => $data['id_user'] ? (int)$data['id_user'] : null,
            'author' => $data['author'] ? (int)$data['author'] : null,
            'phone' => $data['phone'],
            'name' => $data['name'],
            'title' => $data['title'],
            'type' => $data['type'],
            'objectId' => $data['id_object'] ? (int)$data['id_object'] : null,
            'objectType' => $data['type_object'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'status' => $data['status']
        ];
    }
}