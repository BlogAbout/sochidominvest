<?php

namespace App;

/**
 * CompilationModel - Модель управления подборками.
 */
class CompilationModel extends Model
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
            SELECT *,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_building`))
                       FROM `sdi_compilation_building` AS ba
                       WHERE ba.`id_compilation` = `id`
                   ) AS buildings
            FROM `sdi_compilation`
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $item = parent::fetch();

        if (!empty($item)) {
            return CompilationModel::formatDataToJson($item);
        }

        return [];
    }

    /**
     * Вернет список элементов
     *
     * @param int $authorId Идентификатор автора
     * @return array
     */
    public static function fetchList(int $authorId): array
    {
        $resultList = [];

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(ba.`id_building`))
                       FROM `sdi_compilation_building` AS ba
                       WHERE ba.`id_compilation` = sdi.`id`
                   ) AS buildings
            FROM `sdi_compilation` sdi
            WHERE sdi.`active` = 1 AND sdi.`author` = :authorId
            ORDER BY sdi.`id` DESC
        ";

        parent::query($sql);
        parent::bindParams('authorId', $authorId);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($resultList, CompilationModel::formatDataToJson($item));
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
            INSERT INTO `sdi_compilation`
                (`author`, `name`, `description`, `date_created`, `date_update`, `active`)
            VALUES
                (:author, :name, :description, :dateCreated, :dateUpdate, :active)
        ";

        parent::query($sql);
        parent::bindParams('author', $payload['author']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('dateCreated', $payload['dateCreated']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);

        $item = parent::execute();

        if ($item) {
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
     * Обновляет элемент по id
     *
     * @param array $payload Содержит все поля, которые будут обновлены
     * @return array
     */
    public static function updateItem(array $payload): array
    {
        $sql = "
            UPDATE `sdi_compilation`
            SET
                `name` = :name,
                `description` = :description,
                `date_update` = :dateUpdate,
                `active` = :active
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $payload['id']);
        parent::bindParams('name', $payload['name']);
        parent::bindParams('description', $payload['description']);
        parent::bindParams('dateUpdate', $payload['dateUpdate']);
        parent::bindParams('active', $payload['active']);

        if (parent::execute()) {
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
     * Удаляет элемент по id (меняет статус активности)
     *
     * @param int $id Идентификатор элемента
     * @return bool
     */
    public static function deleteItem(int $id): bool
    {
        $sql = "UPDATE `sdi_compilation` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        if (parent::execute()) {
            $sql = "DELETE FROM `sdi_compilation_building` WHERE `id_compilation` = :id";

            parent::query($sql);
            parent::bindParams('id', $id);

            return parent::execute();
        } else {
            return false;
        }
    }

    /**
     * Добавление/Обновление объекта недвижимости в подоборке
     *
     * @param int $compilationId Идентификатор подборки
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param int $compilationOldId Инентификатор старой подборки (если меняем)
     * @return bool
     */
    public static function addBuildingInCompilation(int $compilationId, int $buildingId, int $compilationOldId = null): bool
    {
        if ($compilationOldId) {
            $sql = "
                UPDATE `sdi_compilation_building`
                SET
                    `id_compilation` = :compilationId
                WHERE `id_compilation` = :compilationOldId AND `id_building` = :buildingId
            ";

            parent::query($sql);
            parent::bindParams('compilationOldId', $compilationOldId);
        } else {
            $sql = "
                INSERT INTO `sdi_compilation_building`
                    (`id_compilation`, `id_building`)
                VALUES
                    (:compilationId, :buildingId)
            ";

            parent::query($sql);
        }

        parent::bindParams('compilationId', $compilationId);
        parent::bindParams('buildingId', $buildingId);

        return parent::execute();
    }

    /**
     * Удаление объекта недвижимости из подборки
     *
     * @param int $compilationId Идентификатор подборки
     * @param int $buildingId Идентификатор объекта недвижимости
     * @return bool
     */
    public static function removeBuildingFromCompilation(int $compilationId, int $buildingId): bool
    {
        $sql = "DELETE FROM `sdi_compilation_building` WHERE `id_compilation` = :compilationId AND `id_building` = :buildingId";

        parent::query($sql);
        parent::bindParams('compilationId', $compilationId);
        parent::bindParams('buildingId', $buildingId);

        return parent::execute();
    }

    /**
     * Проверка на наличие объекта недвижимости в одной из подборок пользователя
     *
     * @param int $buildingId Идентификатор объекта недвижимости
     * @param int $authorId Идентификатор пользователя
     * @return array
     */
    public static function checkExistsBuildingInCompilation(int $buildingId, int $authorId): array
    {
        $sql = "
            SELECT *
            FROM `sdi_compilation` AS sdi
            LEFT JOIN `sdi_compilation_building` cb ON cb.`id_compilation` = sdi.`id`
            WHERE sdi.`author` = :authorId AND cb.`id_building` = :buildingId
        ";

        parent::query($sql);
        parent::bindParams('authorId', $authorId);
        parent::bindParams('buildingId', $buildingId);

        $item = parent::fetch();

        if (!empty($item)) {
            return array(
                'status' => true,
                'data' => $item['name']
            );
        } else {
            return array(
                'status' => false,
                'data' => []
            );
        }
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
            'author' => (int)$data['author'],
            'name' => html_entity_decode($data['name']),
            'description' => html_entity_decode($data['description']),
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'active' => (int)$data['active'],
            'buildings' => array_map('intval', $data['buildings'] ? explode(',', $data['buildings']) : [])
        ];
    }
}