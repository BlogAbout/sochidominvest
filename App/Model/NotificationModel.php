<?php

namespace App;

/**
 * NotificationModel - Модель управления уведомлениями.
 */
class NotificationModel extends Model
{
    /**
     * Вернет элемент по id
     *
     * @param int $notificationId Идентификатор элемента
     * @param int $userId Идентификатор пользователя
     * @return array
     */
    public static function fetchItemById(int $notificationId, int $userId): array
    {
        $sql = "
            SELECT sdi.*, n.*
            FROM `sdi_user_notification` sdi
            LEFT JOIN `sdi_notification` n ON sdi.`id_notification` = n.`id`
            WHERE sdi.`id_notification` = :notificationId AND sdi.`id_user` = :userId
        ";

        parent::query($sql);
        parent::bindParams('notificationId', $notificationId);
        parent::bindParams('userId', $userId);

        $item = parent::fetch();

        if (!empty($item)) {
            return self::formatDataToJson($item);
        }

        return [];
    }

    /**
     * Вернет список элементов
     *
     * @param int $userId Идентификатор пользователя
     * @return array
     */
    public static function fetchList(int $userId): array
    {
        $resultList = [];

        $sql = "
            SELECT sdi.*, n.*
            FROM `sdi_user_notification` sdi
            LEFT JOIN `sdi_notification` n ON sdi.`id_notification` = n.`id`
            WHERE sdi.`id_user` = :userId
            ORDER BY sdi.`id_notification` DESC
        ";

        parent::query($sql);
        parent::bindParams('userId', $userId);

        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, self::formatDataToJson($item));
            }
        }

        return $resultList;
    }

    /**
     * Получение количества новых уведомлений
     *
     * @param int $userId Идентификатор пользователя
     * @return int
     */
    public static function fetchCountNewNotifications(int $userId): int
    {
        $sql = "
            SELECT COUNT(`id_notification`) AS count
            FROM `sdi_user_notification`
            WHERE `id_user` = :userId AND `status` = 'new'
        ";

        parent::query($sql);
        parent::bindParams('userId', $userId);

        $count = parent::fetch();

        return (int)$count['count'];
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
            INSERT INTO `sdi_notification`
                (`author`, `name`, `description`, `type`, `id_object`, `type_object`, `date_created`, `active`)
            VALUES
                (:author, :name, :description, :type, :objectId, :objectType, :dateCreated, :active)
        ";

        parent::query($sql);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('objectId', $payload['objectId']);
        parent::bindParams('objectType', $payload['objectType']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('active', $payload['active']);

        $item = parent::execute();

        if ($item) {
            $payload['id'] = parent::lastInsertedId();

            self::setNotificationForUsers($payload, []);

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
     * @param int $notificationId Идентификатор элемента
     * @param int $userId Идентификатор пользователя
     * @return array
     */
    public static function deleteItem(int $notificationId, int $userId): array
    {
        $sql = "
            DELETE FROM `sdi_user_notification`
            WHERE `id_notification` = :notificationId AND `id_user` = :userId
        ";

        parent::query($sql);
        parent::bindParams('notificationId', $notificationId);
        parent::bindParams('userId', $userId);
        parent::execute();

        return self::fetchList($userId);
    }

    /**
     * Изменение статуса уведомления
     *
     * @param int $notificationId Идентификатор уведомления
     * @param int $userId Идентификатор пользователя
     * @return array
     */
    public static function readNotification(int $notificationId, int $userId): array
    {
        $sql = "
            UPDATE `sdi_user_notification`
            SET `status` = 'read'
            WHERE `id_notification` = :notificationId AND `id_user` = :userId
        ";

        parent::query($sql);
        parent::bindParams('notificationId', $notificationId);
        parent::bindParams('userId', $userId);
        parent::execute();

        return self::fetchList($userId);
    }

    /**
     * Изменение статуса всех уведомлений
     *
     * @param int $userId Идентификатор пользователя
     * @return array
     */
    public static function readNotificationsAll(int $userId): array
    {
        $sql = "
            UPDATE `sdi_user_notification`
            SET `status` = 'read'
            WHERE `id_user` = :userId AND `status` = 'new'
        ";

        parent::query($sql);
        parent::bindParams('userId', $userId);
        parent::execute();

        return self::fetchList($userId);
    }

    /**
     * Присваивает уведомление соответствующим пользователям
     *
     * @param array $payload Массив данных уведомления
     * @param array $usersIds Массив идентификаторов пользователей
     */
    private static function setNotificationForUsers(array $payload, array $usersIds)
    {
        switch ($payload['type']) {
            case 'system':
                $filter = [
                    'active' => [0, 1]
                ];
                $usersIds = UserModel::fetchUsersIds($filter);
                // Todo
                break;
            case 'update':
                // Todo
                break;
            case 'feed':
                // Todo
                break;
            default:
                // Todo
                break;
        }

        if (count($usersIds)) {
            $usersSql = [];
            $notificationId = $payload['id'];

            foreach ($usersIds as $id) {
                array_push($usersSql, "($notificationId, $id, 'new')");
            }

            $sql = "
                INSERT INTO `sdi_user_notification`
                    (`id_notification`, `id_user`, `status`)
                VALUES
            " . implode(",", $usersSql);

            self::query($sql);
            self::execute();
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
            'author' => (int)$data['author'],
            'name' => html_entity_decode($data['name']),
            'description' => html_entity_decode($data['description']),
            'type' => $data['type'],
            'objectId' => $data['id_object'] ? (int)$data['id_object'] : null,
            'objectType' => $data['type_object'],
            'dateCreated' => $data['date_created'],
            'active' => (int)$data['active'],
            'status' => $data['status']
        ];
    }
}