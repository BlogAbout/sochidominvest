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
            self::$dbConn->exec('set names utf8');
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
     * Загрузка файла на сервер
     *
     * @param string $file
     * @param string $objectType
     * @param int $objectId
     * @param string $fileType
     * @return string|null
     */
    protected static function uploadFile(string $file, string $objectType, int $objectId, $fileType = 'image')
    {
        $dir = $_SERVER['DOCUMENT_ROOT'] . "/uploads/$objectType/$objectId/";

        if ($file) {
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }

            if (preg_match('/^data:image\/(\w+);base64,/', $file, $type)) {
                $content = substr($file, strpos($file, ',') + 1);
                $type = strtolower($type[1]);

                if ($fileType == 'image' && !in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                    return null;
                }

                $content = str_replace(' ', '+', $content);
                $content = base64_decode($content);

                if ($content === false) {
                    return null;
                }

                $fileName = base64_encode(microtime()) . '.' . $type;

                if (!file_put_contents($dir . $fileName, $content)) {
                    return null;
                }

                return $fileName;
            }
        }

        return null;
    }

    /**
     * Загрузка изображений на сервер и сохранение в базу данных
     *
     * @param int $objectId Идентификатор объекта
     * @param string $objectType Тип объекта
     * @param array $images Массив изображений
     */
    protected static function uploadImages(int $objectId, string $objectType, array $images)
    {
        if (count($images)) {
            foreach ($images as $image) {
                $fileName = self::uploadFile($image->value, $objectType, $objectId);

                if ($fileName) {
                    $sql = "
                        INSERT INTO `sdi_images` (`id_object`, `type_object`, `name`, `active`, `avatar`)
                        VALUES (:objectId, :objectType, :name, 1, :avatar)
                    ";

                    self::query($sql);
                    self::bindParams('objectId', $objectId);
                    self::bindParams('objectType', $objectType);
                    self::bindParams('name', $fileName);
                    self::bindParams('avatar', $image->avatar);
                    self::execute();
                }
            }
        }
    }

    /**
     * Обновление данных изображений в базе данных
     *
     * @param array $images Массив изображений
     */
    protected static function updateImages(array $images)
    {
        if (count($images)) {
            foreach ($images as $image) {
                $sql = "
                    UPDATE `sdi_images`
                    SET
                        active = :active,
                        avatar = :avatar
                    WHERE id = :id
                ";

                self::query($sql);
                self::bindParams('id', $image->id);
                self::bindParams('active', $image->active);
                self::bindParams('avatar', $image->avatar);
                self::execute();
            }
        }
    }

    /**
     * Получение данных изображений к соответствующим объектам
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    protected static function fetchImages(array $filter): array
    {
        $resultList = [];
        $sqlWhere = self::generateFilterQuery($filter);

        $sql = "
            SELECT *
            FROM `sdi_images`
            $sqlWhere
            ORDER BY `avatar` DESC, `id` ASC
        ";

        self::query($sql);
        $list = self::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, self::formatImagesToJson($item));
            }
        }

        return $resultList;
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

        if (!empty($filter['active'])) {
            array_push($where, '`active` IN (' . implode(',', $filter['active']) . ')');
        }

        if (!empty($filter['buildingId'])) {
            array_push($where, "`id_building` IN (" . implode(',', $filter['buildingId']) . ")");
        }

        if (!empty($filter['userId'])) {
            array_push($where, "`id_user` = " . $filter['userId']);
        }

        if (!empty($filter['type'])) {
            array_push($where, "`type` = '" . $filter['type'] . "'");
        }

        if (!empty($filter['objectId'])) {
            array_push($where, "`id_object` IN (" . implode(',', $filter['objectId']) . ")");
        }

        if (!empty($filter['objectType'])) {
            array_push($where, "`type_object` = '" . $filter['objectType'] . "'");
        }

        if (count($where)) {
            $sqlWhere = " WHERE " . implode(' AND ', $where);
        }

        return $sqlWhere;
    }

    /**
     * Преобразование выходящих данных изображений в формат для frontend
     *
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatImagesToJson(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'objectId' => (int)$data['id_object'],
            'objectType' => $data['type_object'],
            'name' => $data['name'],
            'active' => (int)$data['active'],
            'avatar' => (int)$data['avatar'],
            'value' => '/uploads/' . $data['type_object'] . '/' . $data['id_object'] . '/' . $data['name']
        ];
    }
}