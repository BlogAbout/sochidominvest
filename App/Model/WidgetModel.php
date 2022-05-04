<?php

namespace App;

/**
 * WidgetModel - Модель управления виджетами.
 */
class WidgetModel extends Model
{
    /**
     * Вернет элемент по id
     *
     * @param int $id Идентификатор элемента
     * @return array
     */
    public static function fetchItemById(int $id): array
    {
        $sql = "
            SELECT sdi.*
            FROM `sdi_widget` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $item = parent::fetch();

        if (!empty($item)) {
            $item['data'] = self::fetchItemData($id);

            return self::formatDataToJson($item);
        }

        return [];
    }

    /**
     * Вернет список элементов
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $resultList = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.*
            FROM `sdi_widget` sdi
            $sqlWhere
            ORDER BY sdi.`ordering` DESC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                $item['data'] = self::fetchItemData($item['id']);

                array_push($resultList, self::formatDataToJson($item));
            }
        }

        return $resultList;
    }

    /**
     * Создание элемента
     *
     * @param array $payload Содержит все поля, которые будут созданы
     * @return array
     */
    public static function createItem(array $payload): array
    {
        $sql = "
            INSERT INTO `sdi_widget`
                (`name`, `type`, `style`, `page`, `ordering`, `active`)
            VALUES
                (:name, :type, :style, :page, :ordering, :active)
        ";

        parent::query($sql);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('style', $payload['style']);
        parent::bindParams('page', $payload['page']);
        parent::bindParams('ordering', $payload['ordering']);
        parent::bindParams('active', $payload['active']);

        $item = parent::execute();

        if ($item) {
            $payload['id'] = parent::lastInsertedId();

            self::updateWidgetData($payload);

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
     * Обновляет элемент по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateItem(array $payload): array
    {
        $sql = "
            UPDATE `sdi_widget`
            SET
                `name` = :name,
                `type` = :type,
                `style` = :style,
                `page` = :page,
                `ordering` = :ordering,
                `active` = :active
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('type', $payload['type']);
        parent::bindParams('style', $payload['style']);
        parent::bindParams('page', $payload['page']);
        parent::bindParams('ordering', $payload['ordering']);
        parent::bindParams('active', $payload['active']);

        if (parent::execute()) {
            self::updateWidgetData($payload);

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
     * Обновление порядка виджетов
     *
     * @param array $ids Массив идентификаторов виджетов
     */
    public static function updateWidgetOrdering(array $ids)
    {
        $ordering = 0;

        foreach($ids as $id) {
            $ordering++;

            $sql = "
                UPDATE `sdi_widget`
                SET `ordering` = :ordering
                WHERE `id` = :id
            ";

            parent::query($sql);
            parent::bindParams('id', $id);
            parent::bindParams('ordering', $ordering);

            parent::execute();
        }
    }

    /**
     * Обновление содержимого виджета
     *
     * @param array $payload
     * @return void
     */
    private static function updateWidgetData(array $payload)
    {
        $sql = "DELETE FROM `sdi_widget_item` WHERE `id_widget` = :id";

        self::query($sql);
        self::bindParams('id', $payload['id']);
        self::execute();

        if (count($payload['data'])) {
            $dataSql = [];
            $ordering = 0;

            foreach ($payload['data'] as $item) {
                $ordering++;
                array_push($dataSql, "(" . $payload['id'] . ", " . $item['objectId'] . ", '" . $item['objectType'] . "', " . $ordering . ")");
            }

            $sql = "
                INSERT INTO `sdi_widget_item`
                    (`id_widget`, `id_object`, `type_object`, `ordering`)
                VALUES
            " . implode(",", $dataSql);

            self::query($sql);
            self::execute();
        }
    }

    /**
     * Удаляет элемент по id (меняет статус активности)
     *
     * @param int $id Идентификатор элемента
     * @return bool
     */
    public static function deleteItem(int $id): bool
    {
        $sql = "UPDATE `sdi_widget` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    /**
     * Получение содержимого виджета
     *
     * @param int $id Идентификатор элемента
     * @return array
     */
    private static function fetchItemData(int $id): array
    {
        $sql = "
            SELECT sdi.*
            FROM `sdi_widget_item` sdi
            WHERE sdi.`id_widget` = :id
            ORDER BY sdi.`ordering` DESC
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::fetchAll();
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
            'name' => html_entity_decode($data['name']),
            'type' => $data['type'],
            'style' => $data['style'],
            'page' => $data['page'],
            'ordering' => (int)$data['ordering'],
            'active' => (int)$data['active'],
            'data' => self::formatItemDataToJson($data['data'])
        ];
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     *
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatItemDataToJson(array $data): array
    {
        return [
            'widgetId' => (int)$data['id_widget'],
            'objectId' => (int)$data['id_object'],
            'objectType' => $data['type_object'],
            'ordering' => (int)$data['ordering']
        ];
    }
}