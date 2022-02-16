<?php

namespace App;

/**
 * TokenModel. Эта модель используется в основном UserController, а также другими контроллерами и промежуточными программами
 */
class TokenModel extends Model
{
    /**
     * Создает новый токен
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public function createToken($payload)
    {
        $sql = "INSERT INTO db_token (user_id, jwt_token) VALUES (:user_id, :jwt_token)";

        parent::query($sql);

        parent::bindParams('user_id', $payload['user_id']);
        parent::bindParams('jwt_token', $payload['jwt_token']);

        $token = parent::execute();

        if ($token) {
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
     * Извлекает существующий токен, используя $token
     *
     * @param string $token Токен, который будет использоваться для сопоставления с ближайшим токеном из базы данных
     * @return array
     */
    public function fetchToken($token)
    {
        $sql = "SELECT * FROM `db_token` WHERE jwt_token = :jwt_token";

        parent::query($sql);

        parent::bindParams('jwt_token', $token);

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
}