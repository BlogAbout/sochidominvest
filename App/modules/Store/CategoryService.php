<?php

namespace App\Store;

use App\Model;
use App\UtilModel;

class CategoryService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Получение категории товаров по его идентификатору
     *
     * @param int $id Идентификатор категории товаров
     * @return Category
     */
    public static function fetchItemById(int $id): Category
    {
        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`description`, sdi.`date_created`, sdi.`date_update`, sdi.`active`,
                   sdi.`author`, sdi.`fields`, sdi.`meta_title`, sdi.`meta_description`
            FROM `sdi_store_categories` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return Category::initFromDB($data);
        }

        return Category::initFromData();
    }

    /**
     * Извлекает список категорий товаров
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $listResult = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`description`, sdi.`date_created`, sdi.`date_update`, sdi.`active`,
                   sdi.`author`, sdi.`fields`, sdi.`meta_title`, sdi.`meta_description`
            FROM `sdi_store_categories` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($listResult, Category::initFromDB($data));
            }
        }

        return $listResult;
    }

    /**
     * Добавление данных о новой категории товаров в базу данных
     *
     * @param \App\Store\Category $category
     */
    public static function insertItemToDb(Category $category): void
    {
        $dateNow = UtilModel::getDateNow();
        $category->setDateCreated($dateNow);
        $category->setDateUpdate($dateNow);

        $sql = "
            INSERT INTO `sdi_store_categories`
                (`name`, `description`, `date_created`, `date_update`, `active`, `author`, `fields`, `meta_title`, `meta_description`)
            VALUES
                (:name, :description, :dateCreated, :dateUpdate, :active, :author, :fields, :metaTitle, :metaDescription)
        ";

        parent::query($sql);
        parent::bindParams('name', $category->getName());
        parent::bindParams('description', $category->getDescription());
        parent::bindParams('dateCreated', $category->getDateCreated());
        parent::bindParams('dateUpdate', $category->getDateUpdate());
        parent::bindParams('active', $category->getActive());
        parent::bindParams('author', $category->getAuthor());
        parent::bindParams('fields', $category->getFields());
        parent::bindParams('metaTitle', $category->getMetaTitle());
        parent::bindParams('metaDescription', $category->getMetaDescription());

        $result = parent::execute();

        if ($result) {
            $category->setId(parent::lastInsertedId());
        }
    }

    /**
     * Обновление данных о категории товаров в базе данных
     *
     * @param \App\Store\Category $category
     */
    public static function updateItemToDb(Category $category): void
    {
        $category->setDateUpdate(UtilModel::getDateNow());

        $sql = "
            UPDATE `sdi_store_categories`
            SET
                `name` = :name,
                `description` = :description,
                `date_update` = :dateUpdate,
                `active` = :active,
                `fields` = :fields,
                `meta_title` = :metaTitle,
                `meta_description` = :metaDescription
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $category->getId());
        parent::bindParams('name', $category->getName());
        parent::bindParams('description', $category->getDescription());
        parent::bindParams('dateUpdate', $category->getDateUpdate());
        parent::bindParams('active', $category->getActive());
        parent::bindParams('fields', $category->getFields());
        parent::bindParams('metaTitle', $category->getMetaTitle());
        parent::bindParams('metaDescription', $category->getMetaDescription());

        parent::execute();
    }

    /**
     * Удаляет категорию товаров по id (меняет статус активности)
     *
     * @param int $id Идентификатор категории товаров
     * @return bool
     */
    public static function deleteItemFromDb(int $id): bool
    {
        $sql = "UPDATE `sdi_store_categories` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }
}