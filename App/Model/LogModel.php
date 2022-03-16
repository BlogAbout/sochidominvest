<?php

namespace App;

/**
 * LogModel - Эта модель используется другими контроллерами и моделями
 */
class LogModel extends Model
{
    /**
     * Вернет элемент лога по id
     *
     * @param int $id Идентификатор элемента лога
     * @return array
     */
    public static function fetchLogById(int $id): array
    {
        $sql = "
            SELECT *
            FROM `sdi_log`
            WHERE sdi_log.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $log = parent::fetch();

        if (!empty($log)) {
            return LogModel::formatDataToJson($log);
        }

        return [];
    }

    /**
     * Вернет список логов
     *
     * @param array $filter Массив фильтров
     * @return array
     */
    public static function fetchLogs(array $filter): array
    {
        $resultList = [];
        $where = [];

        $sql = "
            SELECT *
            FROM `sdi_log`
        ";

        if (!empty($params['active'])) {
            array_push($where, '`active` IN (' . implode(',', $params['active']) . ')');
        }

        if (!empty($params['type'])) {
            array_push($where, '`type` = ' . $params['type']);
        }

        if (!empty($params['typeObject'])) {
            array_push($where, '`type_object` = ' . $params['typeObject']);
        }

        if (!empty($params['userId'])) {
            array_push($where, '`id_user` = ' . $params['userId']);
        }

        if (count($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }

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
     * @return array
     */
    public static function createLog(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_log`
                (id_user, content, type, id_object, type_object, date_created, active)
            VALUES
                (:userId, :content, :type, :objectId, :typeObject, :dateCreated, :active)
        ";

        parent::query($sql);
        parent::bindParams('userId', $payload['userId']);
        parent::bindParams('content', $payload['content']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('objectId', $payload['objectId']);
        parent::bindParams('objectType', $payload['objectType']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('active', $payload['active']);

        $log = parent::execute();

        if ($log) {
            $payload['id'] = parent::lastInsertedId();

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
     * Преобразование выходящих данных в формат для frontend
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