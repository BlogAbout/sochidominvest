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
    protected static $userId;

    /**
     * Возвращает JWT Secret
     *
     * @return string
     */
    private static function JWTSecret(): string
    {
        return 'K-lyniEXe8Gm-WOA7IhUd5xMrqCBSPzZFpv02Q6sJcVtaYD41wfHRL3';
    }

    /**
     * Извлекает и возвращает JWT-токен из заголовка запроса
     *
     * @return string
     */
    protected static function getToken(): string
    {
        $headers = getallheaders();

        $token = '';

        if ($headers['Authorization']) {
            $token = $headers['Authorization'];
        } else if ($headers['authorization']) {
            $token = $headers['authorization'];
        }

        self::$token = $token;

        return $token;
    }

    /**
     * Проверяет JWT-токен и возвращает логическое значение true
     *
     * @return mixed
     */
    protected static function validateToken()
    {
        self::getToken();

        if (self::$token == '' || self::$token == null) {
            return false;
        }

        try {
            $tokenExplode = explode('Bearer ', self::$token);

            if (isset($tokenExplode[1]) && $tokenExplode == '') {
                return false;
            }

            return $tokenExplode[1];
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Декодирует и возвращает логическое значение true или user_id
     *
     * @param void
     * @return bool
     */
    public static function getAndDecodeToken(): bool
    {
        $token = self::validateToken();

        try {
            if (!$token) {
                return false;
            }

            $tokenModel = new TokenModel();
            $tokenStatus = $tokenModel->fetchToken($token); // Проверка базы данных на наличие запроса перед декодированием

            if (!$tokenStatus) {
                return false;
            }

            // Декодирование токена и передача результата в контроллер
            $decodedToken = (array)JWT::decode($token, self::JWTSecret(), array('HS256'));

            if (isset($decodedToken['user_id'])) {
//                self::$userId = $decodedToken['user_id'];
//
//                return $decodedToken['user_id'];
                return true;
            }

            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Извлекает идентификатор пользователя из JWT-токена и возвращает массив пользователей
     *
     * @return array
     */
    public function getUser(): array
    {
        try {
            $userModel = new UserModel();
            return $userModel::fetchUserById(self::$userId);
        } catch (Exception $e) {
            return [];
        }
    }
}