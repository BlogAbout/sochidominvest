<?php

namespace App;

use Exception;
use Firebase\JWT\JWT;

/**
 * JwtMiddleware. Контроллер использует несколько моделей, классов и пакетов для аутентификации запросов
 */
class JwtMiddleware
{
    protected static $user;
    protected static $token;
    protected static $user_id;

    /**
     * Возвращает JWT Secret
     *
     * @param void
     * @return string
     */
    private static function JWTSecret()
    {
        return 'K-lyniEXe8Gm-WOA7IhUd5xMrqCBSPzZFpv02Q6sJcVtaYD41wfHRL3';
    }

    /**
     * Извлекает и возвращает JWT-токен из заголовка запроса
     *
     * @param void
     * @return string
     */
    protected static function getToken()
    {
        self::$token = $_SERVER['HTTP_AUTHORIZATION'];

        return $_SERVER['HTTP_AUTHORIZATION'];
    }

    /**
     * Проверяет JWT-токен и возвращает логическое значение true
     *
     * @param void
     * @return boolean
     */
    protected static function validateToken()
    {
        self::getToken();

        if (self::$token == '' || self::$token == null) {
            return false;
        }

        try {
            $Token = explode('Bearer ', self::$token);

            if (isset($Token[1]) && $Token == '') {
                return false;
            }

            return $Token[1];
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Декодирует и возвращает логическое значение true или user_id
     *
     * @param void
     * @return mixed
     */
    public function getAndDecodeToken()
    {
        $token = self::validateToken();

        try {
            if ($token !== false) {
                // Запрос токена из базы данных и декодирование
                $TokenModel = new TokenModel();

                // Проверка базы данных на наличие запроса перед декодированием
                $tokenDB = $TokenModel->fetchToken($token);

                if ($tokenDB['status']) {
                    // Декодирование токена и передача результата в контроллер
                    $decodedToken = (array)JWT::decode($token, self::JWTSecret(), array('HS256'));
                    if (isset($decodedToken['user_id'])) {
                        self::$user_id = $decodedToken['user_id'];

                        return $decodedToken['user_id'];
                    }

                    return false;
                }

                return false;
            }

            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Извлекает идентификатор пользователя из JWT-токена и возвращает массив пользователей
     *
     * @param void
     * @return array
     */
    public function getUser()
    {
        try {
            $UserModel = new UserModel();
            $user = $UserModel::fetchUserById(self::$user_id);

            if ($user['status']) {
                return $user['data'];
            }

            return [];
        } catch (Exception $e) {
            return [];
        }
    }
}