<?php

namespace App\Store;

use App\Model;
use App\UtilModel;
use DateTime;

class ProductService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Получение товара по его идентификатору
     *
     * @param int $id Идентификатор товара
     * @return Product
     */
    public static function fetchItemById(int $id): Product
    {
        $sql = "
            SELECT sdi.`id`, sdi.`id_category`, sdi.`name`, sdi.`description`, sdi.`cost`, sdi.`cost_old`,
                   sdi.`id_avatar`, sdi.`date_created`, sdi.`date_update`, sdi.`active`, sdi.`author`, sdi.`fields`,
                   sdi.`meta_title`, sdi.`meta_description`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(i.`id_attachment`) ORDER BY i.`ordering` ASC, i.`id_attachment` ASC)
                       FROM `sdi_images` AS i
                       WHERE i.`id_object` = sdi.`id` AND `type_object` = 'product'
                   ) AS images,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(v.`id_attachment`) ORDER BY v.`ordering` ASC, v.`id_attachment` ASC)
                       FROM `sdi_videos` AS v
                       WHERE v.`id_object` = sdi.`id` AND `type_object` = 'product'
                   ) AS videos
            FROM `sdi_store_product` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return Product::initFromDB($data);
        }

        return Product::initFromData();
    }

    /**
     * Извлекает список товаров
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $listResult = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.`id`, sdi.`id_category`, sdi.`name`, sdi.`description`, sdi.`cost`, sdi.`cost_old`,
                   sdi.`id_avatar`, sdi.`date_created`, sdi.`date_update`, sdi.`active`, sdi.`author`, sdi.`fields`,
                   sdi.`meta_title`, sdi.`meta_description`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName,
                   (
                       SELECT a.`content`
                       FROM `sdi_attachment` AS a
                       WHERE a.`id` = sdi.`id_avatar` AND a.`active` IN (0, 1)
                   ) AS avatar,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(i.`id_attachment`) ORDER BY i.`ordering` ASC, i.`id_attachment` ASC)
                       FROM `sdi_images` AS i
                       WHERE i.`id_object` = sdi.`id` AND `type_object` = 'product'
                   ) AS images,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(v.`id_attachment`) ORDER BY v.`ordering` ASC, v.`id_attachment` ASC)
                       FROM `sdi_videos` AS v
                       WHERE v.`id_object` = sdi.`id` AND `type_object` = 'product'
                   ) AS videos
            FROM `sdi_store_product` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($listResult, Product::initFromDB($data));
            }
        }

        return $listResult;
    }

    /**
     * Добавление данных о новом товаре в базу данных
     *
     * @param Product $product
     */
    public static function insertItemToDb(Product $product): void
    {
        $dateNow = UtilModel::getDateNow();
        $product->setDateCreated($dateNow);
        $product->setDateUpdate($dateNow);

        $sql = "
            INSERT INTO `sdi_store_product`
                (`name`, `id_category`, `description`, `cost`, `cost_old`, `id_avatar`, `avatar`, `date_created`, `date_update`, `active`, `author`, `fields`, `meta_title`, `meta_description`)
            VALUES
                (:name, :categoryId, :description, :cost, :costOld, :avatarId, :avatar, :dateCreated, :dateUpdate, :active, :author, :fields, :metaTitle, :metaDescription)
        ";

        parent::query($sql);
        parent::bindParams('categoryId', $product->getCategoryId());
        parent::bindParams('name', $product->getName());
        parent::bindParams('description', $product->getDescription());
        parent::bindParams('cost', $product->getCost());
        parent::bindParams('costOld', $product->getCostOld());
        parent::bindParams('avatarId', $product->getAvatarId());
        parent::bindParams('avatar', $product->getAvatar());
        parent::bindParams('dateCreated', $product->getDateCreated());
        parent::bindParams('dateUpdate', $product->getDateUpdate());
        parent::bindParams('active', $product->getActive());
        parent::bindParams('author', $product->getAuthor());
        parent::bindParams('fields', json_encode($product->getFields()));
        parent::bindParams('metaTitle', $product->getMetaTitle());
        parent::bindParams('metaDescription', $product->getMetaDescription());

        $result = parent::execute();

        if ($result) {
            $product->setId(parent::lastInsertedId());

            ProductService::updatePrices($product);
            parent::updateRelationsImages($product->getImages(), $product->getId(), 'product');
            parent::updateRelationsVideos($product->getVideos(), $product->getId(), 'product');
        }
    }

    /**
     * Обновление данных о товаре в базе данных
     *
     * @param Product $product
     */
    public static function updateItemToDb(Product $product): void
    {
        $product->setDateUpdate(UtilModel::getDateNow());

        $sql = "
            UPDATE `sdi_store_product`
            SET
                `id_category` = :categoryId,
                `name` = :name,
                `description` = :description,
                `cost` = :cost,
                `cost_old` = :costOld,
                `id_avatar` = :avatarId,
                `avatar` = :avatar,
                `date_update` = :dateUpdate,
                `active` = :active,
                `fields` = :fields,
                `meta_title` = :metaTitle,
                `meta_description` = :metaDescription
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $product->getId());
        parent::bindParams('categoryId', $product->getCategoryId());
        parent::bindParams('name', $product->getName());
        parent::bindParams('description', $product->getDescription());
        parent::bindParams('cost', $product->getCost());
        parent::bindParams('costOld', $product->getCostOld());
        parent::bindParams('avatarId', $product->getAvatarId());
        parent::bindParams('avatar', $product->getAvatar());
        parent::bindParams('dateUpdate', $product->getDateUpdate());
        parent::bindParams('active', $product->getActive());
        parent::bindParams('fields', json_encode($product->getFields()));
        parent::bindParams('metaTitle', $product->getMetaTitle());
        parent::bindParams('metaDescription', $product->getMetaDescription());

        parent::execute();
        
        ProductService::updatePrices($product);
        parent::updateRelationsImages($product->getImages(), $product->getId(), 'product');
        parent::updateRelationsVideos($product->getVideos(), $product->getId(), 'product');
    }

    /**
     * Удаляет товар по id (меняет статус активности)
     *
     * @param int $id Идентификатор товара
     * @return bool
     */
    public static function deleteItemFromDb(int $id): bool
    {
        $sql = "UPDATE `sdi_store_product` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    /**
     * Сохранение изменения цены
     *
     * @param Product $product Объект товара
     */
    public static function updatePrices(Product $product)
    {
        if (!$product->getCost()) {
            return;
        }

        $sql = "
            SELECT `cost`
            FROM `sdi_store_product_price`
            WHERE `id` = :productId
            ORDER BY `date_update` DESC
            LIMIT 1
        ";

        parent::query($sql);
        parent::bindParams('productId', $product->getId());

        $result = parent::fetch();

        if (!empty($result) && (float)$result['cost'] === $product->getCost()) {
            return;
        }

        $dateUpdate = new DateTime();
        $dateUpdate->setTime(0, 0);

        $sql = "
            INSERT INTO `sdi_store_product_price` (`id`, `date_update`, `cost`)
            VALUES (:productId, :dateUpdate, :cost)
            ON DUPLICATE KEY
            UPDATE `cost` = :cost
        ";

        self::query($sql);
        self::bindParams('productId', $product->getId());
        self::bindParams('dateUpdate', $dateUpdate->format('Y-m-d H:i:s'));
        self::bindParams('cost', $product->getCost());
        self::execute();
    }
}