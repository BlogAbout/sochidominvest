<?php

namespace App;

/**
 * UserModel. Эта модель используется в основном UserController, а также другими контроллерами и промежуточными программами
 */
class UserModel extends Model
{
    /**
     * Создает нового пользователя
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createUser($payload)
    {
        $sql = "
            INSERT INTO `db_users`
                (first_name, last_name, email, phone, password, created_at, updated_at, last_active, active, role, settings)
            VALUES
                (:firstName, :lastName, :email, :phone, :password, :createdAt, :updatedAt, :lastActive, :active, :role, :settings)
        ";

        parent::query($sql);

        parent::bindParams('firstName', $payload['firstName']);
        parent::bindParams('lastName', $payload['lastName']);
        parent::bindParams('email', $payload['email']);
        parent::bindParams('phone', $payload['phone']);
        parent::bindParams('password', $payload['password']);
        parent::bindParams('createdAt', $payload['createdAt']);
        parent::bindParams('updatedAt', $payload['updatedAt']);
        parent::bindParams('lastActive', $payload['lastActive']);
        parent::bindParams('active', $payload['active']);
        parent::bindParams('role', $payload['role']);
        parent::bindParams('settings', $payload['settings']);

        $newUser = parent::execute();

        if ($newUser) {
            $user_id = parent::lastInsertedId();
            $payload['userId'] = $user_id;

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
     * Извлекает пользователя по его идентификатору
     *
     * @param int $id Идентификатор пользователя
     * @return array
     */
    public static function fetchUserById($id)
    {
        $sql = "SELECT id, first_name, last_name, email, created_at, updated_at FROM `db_users` WHERE id = :id";

        parent::query($sql);

        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return array(
                'status' => true,
                'data' => $data
            );
        }

        return array(
            'status' => false,
            'data' => []
        );
    }

    /**
     * Извлекает пользователя по Email
     *
     * @param string $email Email пользователя
     * @return array
     */
    public static function checkEmail($email)
    {
        $sql = "SELECT * FROM `db_users` WHERE email = :email";

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
            'data' => $emailData
        );
    }
}