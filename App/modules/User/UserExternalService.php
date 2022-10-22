<?php

namespace App\User;

use App\Model;
use App\UtilModel;

class UserExternalService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Получение внешнего пользователя по его идентификатору
     *
     * @param int $id Идентификатор пользователя
     * @return UserExternal
     */
    public static function fetchItemById(int $id): UserExternal
    {
        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`email`, sdi.`phone`, sdi.`active`, sdi.`date_created`, sdi.`date_update`
            FROM `sdi_user_external` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return UserExternal::initFromDB($data);
        }

        return UserExternal::initFromData();
    }

    /**
     * Извлекает список внешних пользователей
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $listResult = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`email`, sdi.`phone`, sdi.`active`, sdi.`date_created`, sdi.`date_update`
            FROM `sdi_user_external` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($listResult, UserExternal::initFromDB($data));
            }
        }

        return $listResult;
    }

    /**
     * Добавление данных о новом внешнем пользователе в базу данных
     *
     * @param \App\User\UserExternal $userExternal
     */
    public static function insertItemToDb(UserExternal $userExternal): void
    {
        $dateNow = UtilModel::getDateNow();
        $userExternal->setDateCreated($dateNow);
        $userExternal->setDateUpdate($dateNow);

        $sql = "
            INSERT INTO `sdi_user_external`
                (`name`, `email`, `phone`, `active`, `date_created`, `date_update`)
            VALUES
                (:name, :email, :phone, :active, :dateCreated, :dateUpdate)
        ";

        parent::query($sql);
        parent::bindParams('name', $userExternal->getName());
        parent::bindParams('email', $userExternal->getEmail());
        parent::bindParams('phone', $userExternal->getPhone());
        parent::bindParams('active', $userExternal->getActive());
        parent::bindParams('dateCreated', $userExternal->getDateCreated());
        parent::bindParams('dateUpdate', $userExternal->getDateUpdate());

        $result = parent::execute();

        if ($result) {
            $userExternal->setId(parent::lastInsertedId());
        }
    }

    /**
     * Обновление данных о внешнем пользователе в базе данных
     *
     * @param \App\User\UserExternal $userExternal
     */
    public static function updateItemToDb(UserExternal $userExternal): void
    {
        $dateNow = UtilModel::getDateNow();
        $userExternal->setDateUpdate($dateNow);

        $sql = "
            UPDATE `sdi_user_external`
            SET
                `name` = :name,
                `email` = :email,
                `phone` = :phone,
                `active` = :active,
                `date_created` = :dateCreated,
                `date_update` = :dateUpdate
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $userExternal->getId());
        parent::bindParams('name', $userExternal->getName());
        parent::bindParams('email', $userExternal->getEmail());
        parent::bindParams('phone', $userExternal->getPhone());
        parent::bindParams('active', $userExternal->getActive());
        parent::bindParams('dateCreated', $userExternal->getDateCreated());
        parent::bindParams('dateUpdate', $userExternal->getDateUpdate());

        parent::execute();
    }

    /**
     * Удаляет внешнего пользователя по id (меняет статус активности)
     *
     * @param int $id Идентификатор внешнего пользователя
     * @return bool
     */
    public static function deleteItemFromDb(int $id): bool
    {
        $sql = "UPDATE `sdi_user_external` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }
}