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
     */
    public static function createTokenDb(array $payload)
    {
        $sql = "INSERT INTO sdi_user_token (user_id, jwt_token) VALUES (:user_id, :jwt_token)";

        parent::query($sql);
        parent::bindParams('user_id', $payload['user_id']);
        parent::bindParams('jwt_token', $payload['jwt_token']);
        parent::execute();
    }

    /**
     * Извлекает существующий токен, используя $token
     *
     * @param string $token Токен, который будет использоваться для сопоставления с ближайшим токеном из базы данных
     * @return bool
     */
    public function fetchToken(string $token): bool
    {
        $sql = "SELECT * FROM `sdi_user_token` WHERE jwt_token = :jwt_token";

        parent::query($sql);
        parent::bindParams('jwt_token', $token);

        $data = parent::fetch();

        if (!empty($data)) {
            return true;
        }

        return false;
    }
}