<?php

namespace App\Notification;

use App\LogModel;
use App\Messenger\Message;
use App\Model;
use App\UserModel;
use App\UtilModel;
use App\WebSocket\SocketClient;
use Throwable;

class NotificationService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Вернет элемент по id
     *
     * @param int $notificationId Идентификатор элемента
     * @param int $userId Идентификатор пользователя
     * @return Notification
     */
    public static function fetchItemById(int $notificationId, int $userId): Notification
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

        if (!empty($data)) {
            return Notification::initFromDB($data);
        }

        return Notification::initFromDB();
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

        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($resultList, Notification::initFromDB($data));
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
     * Добавление данных о новом уведомлении в базу данных
     *
     * @param Notification $notification Объект уведомления
     * @param array $notifyUsers Список идентификаторов пользователей для уведомления
     */
    public static function insertItemToDb(Notification $notification, array $notifyUsers = []): void
    {
        $dateNow = UtilModel::getDateNow();
        $notification->setDateCreated($dateNow);

        $sql = "
            INSERT INTO `sdi_notification`
                (`author`, `name`, `description`, `type`, `id_object`, `type_object`, `date_created`, `active`)
            VALUES
                (:author, :name, :description, :type, :objectId, :objectType, :dateCreated, :active)
        ";

        parent::query($sql);
        parent::bindParams('author', $notification->getAuthor());
        parent::bindParams('name', $notification->getName());
        parent::bindParams('description', $notification->getDescription());
        parent::bindParams('type', $notification->getType());
        parent::bindParams('objectId', $notification->getObjectId());
        parent::bindParams('objectType', $notification->getObjectType());
        parent::bindParams('dateCreated', $notification->getDateCreated());
        parent::bindParams('active', $notification->getActive());

        $result = parent::execute();

        if ($result) {
            $notification->setId(parent::lastInsertedId());

            self::setNotificationForUsers($notification, $notifyUsers);
            self::sendNotificationForUsersToWebSocket($notification);
        }
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
     * @param Notification $notification Объект уведомления
     * @param array $usersIds Массив идентификаторов пользователей
     */
    private static function setNotificationForUsers(Notification $notification, array $usersIds)
    {
        switch ($notification->getType()) {
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
            case 'booking':
            case 'feed':
                if (!count($usersIds)) {
                    $filter = [
                        'role' => ['director', 'administrator', 'manager']
                    ];
                    $usersIds = UserModel::fetchUsersIds($filter);
                }
                break;
            default:
                // Todo
                break;
        }

        if (count($usersIds)) {
            $usersSql = [];
            $notificationId = $notification->getId();

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
     * Отправка уведомления для пользователей через сокет
     *
     * @param Notification $notification Объект уведомления
     */
    private static function sendNotificationForUsersToWebSocket(Notification $notification): void
    {
        $sql = "
            SELECT *
            FROM `sdi_user_notification`
            WHERE `id_notification` = :notificationId
        ";

        parent::query($sql);
        parent::bindParams('notificationId', $notification->getId());

        $list = parent::fetchAll();
        $attendees = [];

        if (empty($list)) {
            return;
        }

        foreach ($list as $item) {
            array_push($attendees, $item['id_user']);
        }

        $message = new Message([
            'id' => $notification->getId(),
            'type' => 'notification',
            'text' => $notification->getName(),
            'author' => $notification->getAuthor(),
            'dateCreated' => $notification->getDateCreated(),
            'attendees' => $attendees
        ]);

        try {
            $socketClient = new SocketClient($message);
            $socketClient->send();
        } catch (Throwable $e) {
            LogModel::error($e->getMessage());
        }
    }

    private function send(Notification $notification, int $recipientId): void
    {

    }
}