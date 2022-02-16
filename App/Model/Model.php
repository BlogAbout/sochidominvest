<?php

namespace App;

use Exception;
use PDO;

/**
 * Model. Базовая модель для всех других моделей. Все остальные модели расширяют эту модель
 */
class Model
{
    protected static $dbHost = '127.0.0.1';
    protected static $dbName = 'api_db';
    protected static $dbUser = 'mysql';
    protected static $dbPass = '';
    protected static $dbConn;
    protected static $stmt;

    /**
     * Создание нового подключения к базе данных
     *
     * @param void
     * @return array
     */
    public function __construct()
    {
        $Dsn = "mysql:host=" . self::$dbHost . ";dbname=" . self::$dbName;
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        );

        try {
            self::$dbConn = new PDO($Dsn, self::$dbUser, self::$dbPass, $options);
        } catch (Exception $e) {
            $Response = array(
                status => 500,
                data => [],
                message => $e->getMessage()
            );

            return $Response;
        }
    }

    /**
     * Использует метод подготовки PDO для создания подготовленного оператора
     *
     * @param string $query Sql запрос из наследуемых моделей
     * @return bool
     */
    protected static function query($query)
    {
        self::$stmt = self::$dbConn->prepare($query);

        return true;
    }

    /**
     * Связывает подготовленный оператор с помощью метода bindValue
     *
     * @param mixed $param Параметр
     * @param mixed $value Значение
     * @param mixed $type Тип данных
     * @return void
     */
    protected static function bindParams($param, $value, $type = null)
    {
        if ($type == null) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
                    break;
            }
        }

        self::$stmt->bindValue($param, $value, $type);
    }

    /**
     * Выполняет инструкцию Sql и возвращает логический статус
     *
     * @param void
     * @return boolean
     */
    protected static function execute()
    {
        self::$stmt->execute();

        return true;
    }

    /**
     * Выполняет инструкцию Sql и возвращает один массив из результирующего запроса Sql
     *
     * @param void
     * @return array
     */
    protected static function fetch()
    {
        self::execute();

        return self::$stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Выполняет инструкцию Sql и возвращает массив из результирующего запроса Sql
     *
     * @param void
     * @return array
     */
    protected static function fetchAll()
    {
        self::execute();

        return self::$stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Использует соединение с базой данных и возвращает последний вставленный идентификатор в базу данных
     *
     * @param void
     * @return string
     */
    protected static function lastInsertedId()
    {
        return self::$dbConn->lastInsertId();
    }
}