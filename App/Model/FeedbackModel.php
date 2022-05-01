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
            $feed['messages'] = FeedbackModel::fetchMessages($id);

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
                (author, phone, name, title, type, id_object, type_object, date_created, date_update, active, status)
            VALUES
                (:author, :phone, :name, :title, :type, :objectId, :objectType, :dateCreated, :dateUpdate, :active, :status)
        ";

        parent::query($sql);
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

            if ($payload['messages']) {
                FeedbackModel::saveMessages($payload['messages'], $payload['author'], $payload['id']);
                NotificationModel::createItem([
                    'author' => null,
                    'name' => 'Новая заявка в технической поддержке',
                    'description' => $payload['title'],
                    'type' => 'feed',
                    'objectId' => $payload['id'],
                    'objectType' => 'feed',
                    'dateCreated' => date('Y-m-d H:i:s'),
                    'active' => 1
                ]);
            }

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
            if ($payload['messages']) {
                FeedbackModel::saveMessages($payload['messages'], $payload['author'], $payload['id'], $payload['authorFeed']);
            }

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
     * Вернет список сообщений заявки
     *
     * @param int $feedId Идентификатор заявки
     * @return array
     */
    private static function fetchMessages(int $feedId): array
    {
        $resultList = [];

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = sdi.`author` AND u.`active` IN (0, 1)
                   ) AS authorName
            FROM `sdi_feedback_message` sdi
            WHERE sdi.`id_feed` = :feedId AND sdi.`active` = 1
            ORDER BY sdi.`id`
        ";

        parent::query($sql);
        parent::bindParams('feedId', $feedId);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, FeedbackModel::formatMessagesDataToJson($item));
            }
        }

        return $resultList;
    }

    /**
     * Сохранение данных сообщений в заявке
     *
     * @param array $messages Массив сообщений
     * @param int $authorId Идентификатор автора сообщения
     * @param int $feedId Идентификатор заявки
     * @param int $authorIdFeed Идентификатор автора заявки
     */
    private static function saveMessages(array $messages, int $authorId, int $feedId, int $authorIdFeed = null)
    {
        $messagesNew = [];
        $messagesUpdate = [];

        foreach ($messages as $item) {
            if (!$item->id) {
                array_push($messagesNew, $item);
            } else {
                array_push($messagesUpdate, $item);
            }
        }

        if (count($messagesNew)) {
            $messagesSql = [];
            $dateCreated = date('Y-m-d H:i:s');

            foreach ($messagesNew as $item) {
                array_push($messagesSql, "($feedId, $authorId, {$item->active}, '{$item->status}', '{$item->content}', '$dateCreated')");
            }

            $sql = "
                INSERT INTO `sdi_feedback_message`
                    (`id_feed`, `author`, `active`, `status`, `content`, `date_created`)
                VALUES
            " . implode(',', $messagesSql);

            self::query($sql);
            self::execute();
        }

        if (count($messagesUpdate)) {
            foreach ($messagesUpdate as $item) {
                $sql = "
                    UPDATE `sdi_feedback_message`
                    SET
                        `active` = :active,
                        `status` = :status,
                        `content` = :content
                    WHERE `id` = :id
                ";

                parent::query($sql);
                parent::bindParams('id', $item->id);
                parent::bindParams('active', $item->active);
                parent::bindParams('status', $item->status);
                parent::bindParams('content', $item->content);
                parent::execute();
            }
        }

        NotificationModel::createItem([
            'author' => null,
            'name' => 'Техническая поддержка',
            'description' => 'Новый ответ к заявке #' . $feedId,
            'type' => 'feed',
            'objectId' => $feedId,
            'objectType' => 'feed',
            'dateCreated' => date('Y-m-d H:i:s'),
            'active' => 1
        ], !$authorIdFeed || $authorIdFeed === $authorId ? [] : [$authorIdFeed]);
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
            'name' => html_entity_decode($data['name']),
            'title' => html_entity_decode($data['title']),
            'type' => $data['type'],
            'objectId' => $data['id_object'] ? (int)$data['id_object'] : null,
            'objectType' => $data['type_object'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'status' => $data['status'],
            'messages' => $data['messages'] ?? null
        ];
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatMessagesDataToJson(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'feedId' => $data['id_feed'] ? (int)$data['id_feed'] : null,
            'author' => $data['author'] ? (int)$data['author'] : null,
            'active' => (int)$data['active'],
            'status' => $data['status'],
            'content' => html_entity_decode($data['content']),
            'dateCreated' => $data['date_created'],
            'authorName' => $data['authorName']
        ];
    }
}