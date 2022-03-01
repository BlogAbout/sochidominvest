<?php

namespace App;

/**
 * RequestMiddleware. Контроллер использует несколько моделей, классов и пакетов для аутентификации запросов
 */
class RequestMiddleware
{
    protected static $request;

    /**
     * Инициализация middleware
     */
    public function __construct()
    {
        self::$request = $_SERVER['CONTENT_TYPE'] ?? '';
    }

    /**
     * Определяет, относится ли запрос к типу содержимого JSON
     *
     * @return boolean
     */
    public static function acceptsJson(): bool
    {
        return strtolower(self::$request) == 'application/json';
    }

    /**
     * Определяет, относится ли запрос к типу содержимого FormData
     *
     * @return boolean
     */
    public static function acceptsFormData(): bool
    {
        self::$request = explode(';', self::$request)[0];

        return strtolower(self::$request) == 'multipart/form-data';
    }
}