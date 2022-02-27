<?php

namespace App;

/**
 * UserModel. Эта модель используется в основном UserController, а также другими контроллерами и промежуточными программами
 */
class UserModel extends Model
{
    /**
     * Извлекает пользователя по Email
     *
     * @param string $email Email пользователя
     * @return array
     */
    public static function checkEmail($email)
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

    /**
     * Извлекает пользователя по его идентификатору
     *
     * @param int $id Идентификатор пользователя
     * @return array
     */
    public static function fetchUserById($id)
    {
        $sql = "SELECT id, first_name, email, created_at, updated_at FROM `sdi_user` WHERE id = :id";

        parent::query($sql);

        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return array(
                'status' => true,
                'data' => UserModel::formatDataToJson($data)
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Извлекает список пользователей
     *
     * @return array
     */
    public static function fetchUsers()
    {
        $sql = "
            SELECT *
            FROM `sdi_user`
        ";

        parent::query($sql);

        $userList = parent::fetchAll();

        if (!empty($userList)) {
            $resultList = [];

            foreach($userList as $userData) {
                array_push($resultList, UserModel::formatDataToJson($userData));
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
     * Создает нового пользователя
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createUser($payload)
    {
        $sql = "
            INSERT INTO `sdi_user`
                (first_name, email, phone, password, created_at, updated_at, last_active, active, role, settings)
            VALUES
                (:firstName, :email, :phone, :password, :createdAt, :updatedAt, :lastActive, :active, :role, :settings)
        ";

        parent::query($sql);

        parent::bindParams('firstName', $payload['firstName']);
        parent::bindParams('email', $payload['email']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('password', $payload['password']);
        parent::bindParams('createdAt', $payload['createdAt']);
        parent::bindParams('updatedAt', $payload['updatedAt']);
        parent::bindParams('lastActive', $payload['lastActive']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('role', $payload['role']);
        parent::bindParams('settings', $payload['settings']);

        $user = parent::execute();

        if ($user) {
            $userId = parent::lastInsertedId();
            $payload['userId'] = $userId;

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
    public static function updateUser($payload)
    {
        if ($payload['password'] && $payload['password'] !== '') {
            $sql = "
                UPDATE `sdi_user`
                SET
                    first_name = :firstName,
                    email = :email,
                    phone = :phone,
                    password = :password,
                    updated_at = :updatedAt,
                    active = :active,
                    role = :role
                WHERE id = :id
            ";
        } else {
            $sql = "
                UPDATE `sdi_user`
                SET
                    first_name = :firstName,
                    email = :email,
                    phone = :phone,
                    updated_at = :updatedAt,
                    active = :active,
                    role = :role
                WHERE id = :id
            ";
        }

        parent::query($sql);

        parent::bindParams('id', $payload['id']);
        parent::bindParams('firstName', $payload['firstName']);
        parent::bindParams('email', $payload['email']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('updatedAt', $payload['updatedAt']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('role', $payload['role']);

        if ($payload['password'] && $payload['password'] !== '') {
            parent::bindParams('password', $payload['password']);
        }

        $user = parent::execute();

        if ($user) {
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
     * Удаляет пользователя по id (меняет статус активности)
     *
     * @param int $id Идентификатор пользователя
     * @return array
     */
    public static function deleteUser($id)
    {
        $sql = "UPDATE `sdi_user` SET active = 0 WHERE id = :id";

        parent::query($sql);

        parent::bindParams('id', $id);

        $user = parent::execute();

        if ($user) {
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
            'firstName' => $data['first_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'createdAt' => $data['created_at'],
            'updateAt' => $data['updated_at'],
            'lastActive' => $data['last_active'],
            'active' => $data['active'],
            'role' => $data['role'],
            'settings' => $data['settings'],
        ];
    }
}