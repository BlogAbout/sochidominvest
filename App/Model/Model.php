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
//    protected static $dbName = 'gennad0e_sochidi';
    protected static $dbName = 'sochidominvest';
//    protected static $dbUser = 'gennad0e_sochidi';
    protected static $dbUser = 'mysql';
//    protected static $dbPass = 'Uf91*9vo';
    protected static $dbPass = '';
    protected static $dbConn;
    protected static $stmt;
    protected static $logLevel = 'error';

    protected $settings;

    /**
     * Создание нового подключения к базе данных
     *
     * @param void
     * @return array
     */
    public function __construct($settings = null)
    {
        $Dsn = "mysql:host=" . self::$dbHost . ";dbname=" . self::$dbName;
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        );

        try {
            self::$dbConn = new PDO($Dsn, self::$dbUser, self::$dbPass, $options);
            self::$dbConn->exec('set names utf8');
            self::$dbConn->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

            $this->settings = $settings;
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
    protected static function query(string $query): bool
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
     * @return boolean
     */
    protected static function execute(): bool
    {
        self::$stmt->execute();

        return true;
    }

    /**
     * Выполняет инструкцию Sql и возвращает один массив из результирующего запроса Sql
     *
     * @return array
     */
    protected static function fetch(): array
    {
        self::execute();

        $result = self::$stmt->fetch(PDO::FETCH_ASSOC);

        return $result !== false ? $result : [];
    }

    /**
     * Выполняет инструкцию Sql и возвращает массив из результирующего запроса Sql
     *
     * @return array
     */
    protected static function fetchAll(): array
    {
        self::execute();

        return self::$stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Выполняет инструкцию Sql и возвращает массив значений колонки из результирующего запроса Sql
     *
     * @return array
     */
    protected static function fetchColumn(): array
    {
        self::execute();

        return self::$stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    /**
     * Использует соединение с базой данных и возвращает последний вставленный идентификатор в базу данных
     *
     * @param void
     * @return string
     */
    protected static function lastInsertedId(): string
    {
        return self::$dbConn->lastInsertId();
    }

    /**
     * Проверка существования элемента в базе данных
     *
     * @param string $table
     * @param int $id
     * @return bool
     */
    public static function isExistsItem(string $table, int $id): bool
    {
        $sql = "SELECT EXISTS(SELECT `id` FROM :table WHERE `id` = :id)";

        self::query($sql);
        self::bindParams('table', $table);
        self::bindParams('id', $id);

        return self::execute();
    }

    /**
     * Обновление данных изображений в базе данных
     *
     * @param array $images Массив изображений
     * @param int $objectId Идентификатор объекта
     * @param string $objectType Тип объекта
     */
    protected static function updateRelationsImages(array $images, int $objectId, string $objectType)
    {
        $sql = "DELETE FROM `sdi_images` WHERE `id_object` = :objectId AND `type_object` = :objectType";

        self::query($sql);
        self::bindParams('objectId', $objectId);
        self::bindParams('objectType', $objectType);
        self::execute();

        if (count($images)) {
            $imagesSql = [];
            $ordering = 0;

            foreach ($images as $image) {
                $ordering++;
                array_push($imagesSql, "($image, $objectId, '$objectType', $ordering)");
            }

            $sql = "
                INSERT INTO `sdi_images`
                    (`id_attachment`, `id_object`, `type_object`, `ordering`)
                VALUES
            " . implode(",", $imagesSql);

            self::query($sql);
            self::execute();
        }
    }

    /**
     * Обновление данных видео в базе данных
     *
     * @param array $videos Массив видео
     * @param int $objectId Идентификатор объекта
     * @param string $objectType Тип объекта
     */
    protected static function updateRelationsVideos(array $videos, int $objectId, string $objectType)
    {
        $sql = "DELETE FROM `sdi_videos` WHERE `id_object` = :objectId AND `type_object` = :objectType";

        self::query($sql);
        self::bindParams('objectId', $objectId);
        self::bindParams('objectType', $objectType);
        self::execute();

        if (count($videos)) {
            $videosSql = [];
            $ordering = 0;

            foreach ($videos as $video) {
                $ordering++;
                array_push($videosSql, "($video, $objectId, '$objectType', $ordering)");
            }

            $sql = "
                INSERT INTO `sdi_videos`
                    (`id_attachment`, `id_object`, `type_object`, `ordering`)
                VALUES
            " . implode(",", $videosSql);

            self::query($sql);
            self::execute();
        }
    }

    /**
     * Формирует строку запроса where для фильтрации по обобщенным параметрам
     *
     * @param array $filter Массив параметров фильтрации
     * @return string
     */
    protected static function generateFilterQuery(array $filter): string
    {
        $sqlWhere = '';
        $where = [];

        if (!empty($filter['id'])) {
            array_push($where, "sdi.`id` IN (" . implode(',', $filter['id']) . ")");
        }

        if (!empty($filter['role'])) {
            array_push($where, "sdi.`role` IN ('" . implode("','", $filter['role']) . "')");
        }

        if (!empty($filter['active'])) {
            array_push($where, 'sdi.`active` IN (' . implode(',', $filter['active']) . ')');
        }

        if (!empty($filter['rent'])) {
            array_push($where, 'sdi.`rent` IN (' . implode(',', $filter['rent']) . ')');
        }

        if (!empty($filter['buildingId'])) {
            array_push($where, "sdi.`id_building` IN (" . implode(',', $filter['buildingId']) . ")");
        }

        if (!empty($filter['userId'])) {
            array_push($where, "sdi.`id_user` IN (" . implode(',', $filter['userId']) . ")");
        }

        if (!empty($filter['author'])) {
            array_push($where, "sdi.`author` IN (" . implode(',', $filter['author']) . ")");
        }

        if (!empty($filter['type'])) {
            array_push($where, "sdi.`type` = '" . $filter['type'] . "'");
        }

        if (!empty($filter['objectId'])) {
            array_push($where, "sdi.`id_object` IN (" . implode(',', $filter['objectId']) . ")");
        }

        if (!empty($filter['objectType'])) {
            array_push($where, "sdi.`type_object` = '" . $filter['objectType'] . "'");
        }

        if (!empty($filter['status'])) {
            array_push($where, "sdi.`status` IN ('" . implode("','", $filter['status']) . "')");
        }

        if (!empty($filter['text'])) {
            array_push($where, "(sdi.`name` LIKE '%" . $filter['text'] . "%')");
        }

        if (!empty($filter['agentId'])) {
            array_push($where, "sdi.`id_agent` IN (" . implode(',', $filter['agentId']) . ")");
        }

//        if (!empty($filter['dateStart'])) {
//            array_push($where, "sdi.`date_start` >= '" . $filter['dateStart'] . "'");
//        }
//
//        if (!empty($filter['dateFinish'])) {
//            array_push($where, "sdi.`date_finish` <= '" . $filter['dateFinish'] . "'");
//        }

        if (count($where)) {
            $sqlWhere = " WHERE " . implode(' AND ', $where);
        }

        return $sqlWhere;
    }
}