<?php

namespace App\Mailing;

use App\Model;
use App\User\UserExternalService;
use App\UserModel;
use App\UtilModel;

class MailingService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Получение рассылки по её идентификатору
     *
     * @param int $id Идентификатор рассылки
     * @return Mailing
     */
    public static function fetchItemById(int $id): Mailing
    {
        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`content`, sdi.`type`, sdi.`author`, sdi.`date_created`, sdi.`active`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName,
                   sdi.`status`, (
                       SELECT COUNT(r.`id_mailing`) FROM `sdi_mailing_recipients` r WHERE r.id_mailing = sdi.`id`
                   ) as countRecipients
            FROM `sdi_mailing` sdi
            WHERE sdi.`id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $id);

        $data = parent::fetch();

        if (!empty($data)) {
            return Mailing::initFromDB($data);
        }

        return Mailing::initFromData();
    }

    /**
     * Извлекает список рассылок
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $listResult = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.`id`, sdi.`name`, sdi.`content`, sdi.`type`, sdi.`author`, sdi.`date_created`, sdi.`active`,
                   (
                       SELECT u.`first_name`
                       FROM `sdi_user` AS u
                       WHERE u.`id` = `author` AND u.`active` IN (0, 1)
                   ) AS authorName,
                   sdi.`status`, (
                       SELECT COUNT(r.`id_mailing`) FROM `sdi_mailing_recipients` r WHERE r.id_mailing = sdi.`id`
                   ) as countRecipients
            FROM `sdi_mailing` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($listResult, Mailing::initFromDB($data));
            }
        }

        return $listResult;
    }

    /**
     * Добавление данных о новой рассылке в базу данных
     *
     * @param \App\Mailing\Mailing $mailing
     */
    public static function insertItemToDb(Mailing $mailing): void
    {
        $dateNow = UtilModel::getDateNow();
        $mailing->setDateCreated($dateNow);

        $sql = "
            INSERT INTO `sdi_mailing`
                (`name`, `content`, `type`, `author`, `date_created`, `active`, `status`)
            VALUES
                (:name, :content, :type, :author, :dateCreated, :active, :status)
        ";

        parent::query($sql);
        parent::bindParams('name', $mailing->getName());
        parent::bindParams('content', $mailing->getContent());
        parent::bindParams('type', $mailing->getType());
        parent::bindParams('author', $mailing->getAuthor());
        parent::bindParams('dateCreated', $mailing->getDateCreated());
        parent::bindParams('active', $mailing->getActive());
        parent::bindParams('status', $mailing->getStatus());

        $result = parent::execute();

        if ($result) {
            $mailing->setId(parent::lastInsertedId());

            $users = UserModel::fetchUsers(['active' => [0, 1]]);
            $usersExternal = UserExternalService::fetchList(['active' => [0, 1]]);

            $recipientsList = [];

            if ($users && count($users)) {
                foreach ($users as $user) {
                    if ($user['email']) {
                        array_push($recipientsList, Recipient::initFromData([
                            'mailingId' => $mailing->getId(),
                            'userId' => $user['id'],
                            'userType' => 'subscriber',
                            'email' => $user['email']
                        ]));
                    }
                }
            }

            if ($usersExternal && count($usersExternal)) {
                foreach ($usersExternal as $user) {
                    if ($user->getEmail()) {
                        $isExists = false;

                        if (count($recipientsList)) {
                            foreach ($recipientsList as $recipient) {
                                if ($recipient->getEmail() === $user->getEmail()) {
                                    $isExists = true;
                                    break;
                                }
                            }
                        }

                        if (!$isExists) {
                            array_push($recipientsList, Recipient::initFromData([
                                'mailingId' => $mailing->getId(),
                                'userId' => $user->getId(),
                                'userType' => 'external',
                                'email' => $user->getEmail()
                            ]));
                        }
                    }
                }
            }

            if (count($recipientsList)) {
                RecipientService::insertListItemsToDb($recipientsList);
            }
        }
    }

    /**
     * Обновление данных о рассылке в базе данных
     *
     * @param \App\Mailing\Mailing $mailing
     */
    public static function updateItemToDb(Mailing $mailing): void
    {
        $sql = "
            UPDATE `sdi_mailing`
            SET
                `name` = :name,
                `content` = :content,
                `type` = :type,
                `author` = :author,
                `date_created` = :dateCreated,
                `active` = :active,
                `status` = :status
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $mailing->getId());
        parent::bindParams('name', $mailing->getName());
        parent::bindParams('content', $mailing->getContent());
        parent::bindParams('type', $mailing->getType());
        parent::bindParams('author', $mailing->getAuthor());
        parent::bindParams('dateCreated', $mailing->getDateCreated());
        parent::bindParams('active', $mailing->getActive());
        parent::bindParams('status', $mailing->getStatus());

        parent::execute();
    }

    /**
     * Удаляет рассылку по id (меняет статус активности)
     *
     * @param int $id Идентификатор рассылки
     * @return bool
     */
    public static function deleteItemFromDb(int $id): bool
    {
        $sql = "UPDATE `sdi_mailing` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }
}