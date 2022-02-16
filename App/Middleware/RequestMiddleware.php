<?php

namespace App;

/**
 * RequestMiddleware. Контроллер использует несколько моделей, классов и пакетов для аутентификации запросов
 */
class RequestMiddleware
{
    protected static $Request;

    /**
     * Инициализация middleware
     *
     * @param void
     * @return void
     */
    public function __construct()
    {
        self::$Request = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    }

    /**
     * Определяет, относится ли запрос к типу содержимого JSON
     *
     * @param void
     * @return boolean
     */
    public static function acceptsJson()
    {
        if (strtolower(self::$Request) == 'application/json') {
            return true;
        }

        return false;
    }

    /**
     * Определяет, относится ли запрос к типу содержимого FormData
     *
     * @param void
     * @return boolean
     */
    public static function acceptsFormData()
    {
        self::$Request = explode(';', self::$Request)[0];

        if (strtolower(self::$Request) == 'multipart/form-data') {
            return true;
        }

        return false;
    }
}