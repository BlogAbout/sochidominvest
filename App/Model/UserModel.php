<?php

namespace App;

/**
 * UserModel. Эта модель используется в основном UserController, а также другими контроллерами и промежуточными программами
 */
class UserModel extends Model
{
    /**
     * UserModel constructor.
     */
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Извлекает пользователя по Email
     *
     * @param string $email Email пользователя
     * @return array
     */
    public static function checkEmail(string $email): array
    {
        $sql = "SELECT * FROM `sdi_user` WHERE email = :email";

        parent::query($sql);

        parent::bindParams('email', $email);

        $emailData = parent::fetch();

        if (empty($emailData)) {
            return array(
                'status' => false,
                'data' => []
            );
        }

        return array(
            'status' => true,
            'data' => UserModel::formatDataToJson($emailData)
        );
    }

    public function forgotPassword($email): string
    {
        $code = rand(11111, 99999);

        $sql = "UPDATE `sdi_user` SET `forgot` = :forgot WHERE `email` = :email";

        parent::query($sql);
        parent::bindParams('email', $email);
        parent::bindParams('forgot', $code);
        parent::execute();

        $mailModel = new MailModel($this->settings, $email, 'forgot', ['code' => $code]);
        $mailModel->send();

        return $code;
    }

    /**
     * Смена пароля пользователя
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return bool
     */
    public static function resetPassword(array $payload): bool
    {
        $sql = "
            UPDATE `sdi_user`
            SET
                password = :password,
                forgot = null
            WHERE email = :email
        ";

        parent::query($sql);

        parent::bindParams('password', $payload['password']);
        parent::bindParams('email', $payload['email']);

        return parent::execute();
    }

    /**
     * Извлекает пользователя по его идентификатору
     *
     * @param int $id Идентификатор пользователя
     * @return array
     */
    public static function fetchUserById(int $id): array
    {
        $sql = "
            SELECT sdi.*,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT p.`name`
                       FROM `sdi_post` AS p
                       WHERE p.`id` = sdi.`post` AND p.`active` IN (0, 1)
                   ) AS postName
            FROM `sdi_user` sdi
            WHERE sdi.id = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return UserModel::formatDataToJson($data);
        }

        return [];
    }

    /**
     * Извлекает список пользователей
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchUsers(array $filter): array
    {
        $resultList = [];
        $sqlWhere = [];

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT p.`name`
                       FROM `sdi_post` AS p
                       WHERE p.`id` = sdi.`post` AND p.`active` IN (0, 1)
                   ) AS postName
            FROM `sdi_user` sdi
        ";

        if (!empty($filter['active'])) {
            array_push($sqlWhere, 'sdi.`active` IN (' . implode(',', $filter['active']) . ')');
        }

        if (!empty($filter['text'])) {
            array_push($sqlWhere, '(sdi.`first_name` LIKE "%' . $filter['text'] . '%")');
        }

        if (count($sqlWhere)) {
            $sql .= " WHERE " . implode(' AND ', $sqlWhere);
        }

        parent::query($sql);
        $userList = parent::fetchAll();

        if (!empty($userList)) {
            foreach ($userList as $userData) {
                $user = UserModel::formatDataToJson($userData);
                unset($user['password']);

                array_push($resultList, $user);
            }
        }

        return $resultList;
    }

    /**
     * Извлекает список идентификаторов пользователей
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchUsersIds(array $filter): array
    {
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.`id`
            FROM `sdi_user` sdi
            $sqlWhere
        ";

        parent::query($sql);

        return parent::fetchColumn();
    }

    /**
     * Создает нового пользователя
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public function createUser(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_user`
                (first_name, email, phone, password, date_created, date_update, last_active, active, role, id_avatar,
                    settings, post, tariff, tariff_expired)
            VALUES
                (:firstName, :email, :phone, :password, :dateCreated, :dateUpdate, :lastActive, :active, :role, :avatarId,
                    :settings, :post, :tariff, :tariffExpired)
        ";

        parent::query($sql);

        parent::bindParams('firstName', $payload['firstName']);
        parent::bindParams('email', $payload['email']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('password', $payload['password']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('lastActive', $payload['lastActive']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('role', $payload['role']);
        parent::bindParams('avatarId', $payload['avatarId']);
        parent::bindParams('settings', $payload['settings']);
        parent::bindParams('post', $payload['post']);
        parent::bindParams('tariff', $payload['tariff']);
        parent::bindParams('tariffExpired', $payload['tariffExpired']);

        $user = parent::execute();

        if ($user) {
            $payload['id'] = (int)parent::lastInsertedId();

            $params = [
                'login' => $payload['email'],
                'password' => $payload['passwordDefault']
            ];
            $mailModel = new MailModel($this->settings, $payload['email'], 'registration', $params);
            $mailModel->send();

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
     * Обновляет пользователя по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateUser(array $payload): array
    {
        if ($payload['password'] && $payload['password'] !== '') {
            $sql = "
                UPDATE `sdi_user`
                SET
                    first_name = :firstName,
                    email = :email,
                    phone = :phone,
                    password = :password,
                    date_update = :dateUpdate,
                    active = :active,
                    block = :block,
                    role = :role,
                    id_avatar = :avatarId,
                    settings = :settings,
                    post = :post,
                    tariff = :tariff,
                    tariff_expired = :tariffExpired
                WHERE id = :id
            ";
        } else {
            $sql = "
                UPDATE `sdi_user`
                SET
                    first_name = :firstName,
                    email = :email,
                    phone = :phone,
                    date_update = :dateUpdate,
                    active = :active,
                    block = :block,
                    role = :role,
                    id_avatar = :avatarId,
                    settings = :settings,
                    post = :post,
                    tariff = :tariff,
                    tariff_expired = :tariffExpired
                WHERE id = :id
            ";
        }

        parent::query($sql);

        parent::bindParams('id', $payload['id']);
        parent::bindParams('firstName', $payload['firstName']);
        parent::bindParams('email', $payload['email']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('block', $payload['block']);
        parent::bindParams('role', $payload['role']);
        parent::bindParams('avatarId', $payload['avatarId']);
        parent::bindParams('settings', $payload['settings']);
        parent::bindParams('post', $payload['post']);
        parent::bindParams('tariff', $payload['tariff']);
        parent::bindParams('tariffExpired', $payload['tariff'] === 'free' ? UtilModel::getDateNow() : $payload['tariffExpired']);

        if ($payload['password'] && $payload['password'] !== '') {
            parent::bindParams('password', $payload['password']);
        }

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
     * Обновление времени последнего пребывания на сайте
     *
     * @param int $userId Идентификатор пользователя
     */
    public static function updateLastActive(int $userId)
    {
        $sql = "
            UPDATE `sdi_user`
            SET last_active = :lastActive
            WHERE id = :id
        ";

        parent::query($sql);

        parent::bindParams('id', $userId);
        parent::bindParams('lastActive', UtilModel::getDateNow());

        parent::execute();
    }

    /**
     * Удаляет пользователя по id (меняет статус активности)
     *
     * @param int $id Идентификатор пользователя
     * @return bool
     */
    public static function deleteUser(int $id): bool
    {
        $sql = "UPDATE `sdi_user` SET active = -1 WHERE id = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    /**
     * Смена тарифа для пользователя
     *
     * @param int $userId Идентификатор пользователя
     * @param string $tariff Выбранный тариф
     * @param string $dateExpired Дата окончания выбранного тарифа
     */
    public static function changeTariffForUser(int $userId, string $tariff, string $dateExpired): void
    {
        $sql = "
            UPDATE `sdi_user`
            SET
                `tariff` = :tariff,
                `tariff_expired` = :tariffExpired
            WHERE `id` = :userId
        ";

        parent::query($sql);
        parent::bindParams('tariff', $tariff);
        parent::bindParams('tariffExpired', $dateExpired);
        parent::bindParams('userId', $userId);

        parent::execute();
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
            'firstName' => html_entity_decode($data['first_name']),
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $data['password'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'lastActive' => $data['last_active'],
            'active' => (int)$data['active'],
            'block' => (int)$data['block'],
            'role' => $data['role'],
            'avatarId' => (int)$data['id_avatar'],
            'avatar' => $data['avatar'],
            'settings' => $data['settings'] ? json_decode($data['settings']) : null,
            'post' => (int)$data['post'],
            'postName' => $data['postName'],
            'tariff' => $data['tariff'],
            'tariffExpired' => $data['tariff_expired']
        ];
    }
}