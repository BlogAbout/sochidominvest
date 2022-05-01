<?php

namespace App;

/**
 * UtilModel. Содержит методы взаимодействия для служебных функций
 */
class UtilModel extends Model
{
    /**
     * Обновление счетчика просмотра объекта
     *
     * @param int $objectId Идентификатор объекта
     * @param string $objectType Тип объекта
     * @return void
     */
    public static function updateCountViews(int $objectId, string $objectType)
    {
        $sql = "
            INSERT INTO `sdi_views` (`id_object`, `type_object`, `views`)
            VALUES (:objectId, :objectType, 1)
            ON DUPLICATE KEY
            UPDATE `views` = (`views` + 1)
        ";

        self::query($sql);
        self::bindParams('objectId', $objectId);
        self::bindParams('objectType', $objectType);
        self::execute();
    }

    /**
     * Вернет список результатов глобального поиска
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchSearchGlobal(array $filter): array
    {
        if (trim($filter['text']) === '') {
            return [];
        }

        return [
            'users' => UserModel::fetchUsers($filter),
            'buildings' => BuildingModel::fetchBuildings($filter),
            'articles' => ArticleModel::fetchList($filter),
            'documents' => DocumentModel::fetchDocuments($filter),
            'developers' => DeveloperModel::fetchDevelopers($filter),
            'attachments' => AttachmentModel::fetchList($filter)
        ];
    }
}