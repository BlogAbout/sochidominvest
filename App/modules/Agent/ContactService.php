<?php

namespace App\Agent;

use App\Model;
use App\UtilModel;

class ContactService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Получение контакта по его идентификатору
     *
     * @param int $id Идентификатор контакта
     * @return Contact
     */
    public static function fetchItemById(int $id): Contact
    {
        $sql = "
            SELECT sdi.`id`, sdi.`id_agent`, sdi.`name`, sdi.`post`, sdi.`phone`, sdi.`author`,
                   sdi.`date_created`, sdi.`date_update`, sdi.`active`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName
            FROM `sdi_agent_contact` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return Contact::initFromDB($data);
        }

        return Contact::initFromData();
    }

    /**
     * Извлекает список контактов
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $listResult = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.`id`, sdi.`id_agent`, sdi.`name`, sdi.`post`, sdi.`phone`, sdi.`author`,
                   sdi.`date_created`, sdi.`date_update`, sdi.`active`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName
            FROM `sdi_agent_contact` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($listResult, Contact::initFromDB($data));
            }
        }

        return $listResult;
    }

    /**
     * Добавление данных о новом контакте в базу данных
     *
     * @param \App\Agent\Contact $contact
     */
    public static function insertItemToDb(Contact $contact): void
    {
        $dateNow = UtilModel::getDateNow();
        $contact->setDateCreated($dateNow);
        $contact->setDateUpdate($dateNow);

        $sql = "
            INSERT INTO `sdi_agent_contact`
                (`id_agent`, `name`, `post`, `phone`, `author`, `date_created`, `date_update`, `active`)
            VALUES
                (:agentId, :name, :post, :phone, :author, :dateCreated, :dateUpdate, :active)
        ";

        parent::query($sql);
        parent::bindParams('agentId', $contact->getAgentId());
        parent::bindParams('name', $contact->getName());
        parent::bindParams('description', $contact->getPost());
        parent::bindParams('phone', $contact->getPhone());
        parent::bindParams('author', $contact->getAuthor());
        parent::bindParams('dateCreated', $contact->getDateCreated());
        parent::bindParams('dateUpdate', $contact->getDateUpdate());
        parent::bindParams('active', $contact->getActive());

        $result = parent::execute();

        if ($result) {
            $contact->setId(parent::lastInsertedId());
        }
    }

    /**
     * Обновление данных о контакте в базе данных
     *
     * @param \App\Agent\Contact $contact
     */
    public static function updateItemToDb(Contact $contact): void
    {
        $contact->setDateUpdate(UtilModel::getDateNow());

        $sql = "
            UPDATE `sdi_agent_contact`
            SET
                `id_agent` = :agentId,
                `name` = :name,
                `post` = :post,
                `phone` = :phone,
                `author` = :author,
                `date_created` = :dateCreated,
                `date_update` = :dateUpdate,
                `active` = :active
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $contact->getId());
        parent::bindParams('agentId', $contact->getAgentId());
        parent::bindParams('name', $contact->getName());
        parent::bindParams('description', $contact->getPost());
        parent::bindParams('phone', $contact->getPhone());
        parent::bindParams('author', $contact->getAuthor());
        parent::bindParams('dateCreated', $contact->getDateCreated());
        parent::bindParams('dateUpdate', $contact->getDateUpdate());
        parent::bindParams('active', $contact->getActive());

        parent::execute();
    }

    /**
     * Удаляет контакт по id (меняет статус активности)
     *
     * @param int $id Идентификатор контакта
     * @return bool
     */
    public static function deleteItemFromDb(int $id): bool
    {
        $sql = "UPDATE `sdi_agent_contact` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }
}