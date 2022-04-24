<?php

namespace App;

/**
 * LogModel - Модель взаимодействия для логирования действий, событий и изменений
 */
class LogModel extends Model
{
    /**
     * Вернет список логов
     *
     * @param array $filter Массив фильтров
     * @return array
     */
    public static function fetchLogs(array $filter): array
    {
        $resultList = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.*
            FROM `sdi_log` sdi
            $sqlWhere
            ORDER BY sdi.`id` DESC
            LIMIT 0, 50
        ";

        parent::query($sql);
        $logList = parent::fetchAll();

        if (!empty($logList)) {
            foreach ($logList as $logData) {
                array_push($resultList, LogModel::formatDataToJson($logData));
            }
        }

        return $resultList;
    }

    /**
     * Создание лога
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return void
     */
    private static function createLog(array $payload)
    {
        $sql = "
            INSERT INTO `sdi_log`
                (id_user, content, type, id_object, type_object, date_created, active)
            VALUES
                (:userId, :content, :type, :objectId, :objectType, :dateCreated, :active)
        ";

        parent::query($sql);
        parent::bindParams('userId', $payload['userId']);
        parent::bindParams('content', $payload['content']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('objectId', $payload['objectId']);
        parent::bindParams('objectType', $payload['objectType']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('active', $payload['active']);
        parent::execute();
    }

    /**
     * Удаляет элемент лога по id (меняет статус активности)
     *
     * @param int $id Идентификатор элемента лога
     * @return bool
     */
    public static function deleteLog(int $id): bool
    {
        $sql = "UPDATE `sdi_log` SET active = -1 WHERE id = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    /**
     * Логирование базовой информации
     *
     * @param string $type Тип лога
     * @param string $typeObject Тип объекта
     * @param int $userId Идентификатор пользователя
     * @param array $payload Содержит все поля объекта для логирования
     * @return void
     */
    public static function log(string $type, string $typeObject, int $userId, array $payload)
    {
        $content = self::generateContentLog($typeObject, $payload);

        $data = [
            'userId' => $userId,
            'content' => $content,
            'type' => $type,
            'objectType' => $typeObject,
            'objectId' => $payload['id'],
            'dateCreated' => date('Y-m-d H:i:s'),
            'active' => 1
        ];

        self::createLog($data);
    }

    /**
     * Логирование ошибок в файл
     *
     * @param string $error Текст ошибки
     * @param array $payload Содержит все поля объекта для логирования
     * @return void
     */
    public static function error(string $error, array $payload = null)
    {
        if (parent::$logLevel === 'error') {
            $dir = $_SERVER['DOCUMENT_ROOT'] . '/logs/';

            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }

            if ($payload) {
                file_put_contents($dir . '/log.txt', date('Y-m-d H:i:s') . ': ' . $error . ' ' . json_encode($payload) . PHP_EOL, FILE_APPEND);
            } else {
                file_put_contents($dir . '/log.txt', date('Y-m-d H:i:s') . ': ' . $error . PHP_EOL, FILE_APPEND);
            }
        }
    }

    /**
     * Генерация содержимого лога на основе объекта данных
     *
     * @param string $type Тип объекта
     * @param array $data Объект данных
     * @return string Строка содержимого лога
     */
    private static function generateContentLog(string $type, array $data): string
    {
        $content = '';

        switch ($type) {
            case 'article':
            case 'building':
            case 'checker':
            case 'developer':
            case 'document':
            case 'tag':
            case 'notify':
            case 'compile':
                $content .= $data['name'];
                break;
            case 'feed':
                $content .= $data['title'];
                break;
            case 'user':
                $content .= $data['firstName'];
                break;
            case 'attachment':
                $content .= $data['name'] && trim($data['name']) !== '' ? $data['name'] : $data['content'];
        }

        return $content;
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     *
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatDataToJson(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'userId' => (int)$data['id_user'],
            'content' => $data['content'],
            'type' => $data['type'],
            'objectId' => $data['id_object'] ? (int)$data['id_object'] : null,
            'objectType' => $data['type_object'],
            'dateCreated' => $data['date_created'],
            'active' => (int)$data['active']
        ];
    }
}