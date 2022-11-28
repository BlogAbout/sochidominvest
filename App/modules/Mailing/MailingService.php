<?php

namespace App\Mailing;

use App\BuildingModel;
use App\CompilationModel;
use App\MailModel;
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
            SELECT sdi.`id`, sdi.`name`, sdi.`content`, sdi.`content_html`, sdi.`type`, sdi.`author`, sdi.`date_created`, sdi.`active`,
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
            SELECT sdi.`id`, sdi.`name`, sdi.`content`, sdi.`content_html`, sdi.`type`, sdi.`author`, sdi.`date_created`, sdi.`active`,
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
        $mailing->setContentHtml(self::createHtmlContent($mailing));

        $sql = "
            INSERT INTO `sdi_mailing`
                (`name`, `content`, `content_html`, `type`, `author`, `date_created`, `active`, `status`)
            VALUES
                (:name, :content, :contentHtml, :type, :author, :dateCreated, :active, :status)
        ";

        parent::query($sql);
        parent::bindParams('name', $mailing->getName());
        parent::bindParams('content', $mailing->getContent());
        parent::bindParams('contentHtml', $mailing->getContentHtml());
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

            // Todo: ???
//            if ($usersExternal && count($usersExternal)) {
//                foreach ($usersExternal as $user) {
//                    if ($user->getEmail()) {
//                        $isExists = false;
//
//                        if (count($recipientsList)) {
//                            foreach ($recipientsList as $recipient) {
//                                if ($recipient->getEmail() === $user->getEmail()) {
//                                    $isExists = true;
//                                    break;
//                                }
//                            }
//                        }
//
//                        if (!$isExists) {
//                            array_push($recipientsList, Recipient::initFromData([
//                                'mailingId' => $mailing->getId(),
//                                'userId' => $user->getId(),
//                                'userType' => 'external',
//                                'email' => $user->getEmail()
//                            ]));
//                        }
//                    }
//                }
//            }

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
        $mailing->setContentHtml(self::createHtmlContent($mailing));

        $sql = "
            UPDATE `sdi_mailing`
            SET
                `name` = :name,
                `content` = :content,
                `content_html` = :contentHtml,
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
        parent::bindParams('contentHtml', $mailing->getContentHtml());
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

    /**
     * Получение идентификаторов рассылок
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchIdsMailing(array $filter): array
    {
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "SELECT sdi.`id` FROM `sdi_mailing` sdi $sqlWhere ORDER BY sdi.`id` ASC";

        parent::query($sql);
        return parent::fetchColumn();
    }

    /**
     * Запуск рассылки
     */
    public function runSendMailing(): void
    {
        $idsRemove = MailingService::fetchIdsMailing(['active' => [-1]]);
        RecipientService::deleteItemsByMailingFromDb($idsRemove);

        $sql = "
            SELECT sdi.`id_mailing`, sdi.`id_user`, sdi.`type_user`, m.`name`, m.`content`, m.`content_html`, m.`type`,
                   IF(
                       sdi.`type_user` = 'subscriber',
                       (SELECT u.`email` FROM `sdi_user` u WHERE u.`id` = sdi.`id_user`),
                       (SELECT ue.`email` FROM `sdi_user_external` ue WHERE ue.`id` = sdi.`id_user`)
                   ) AS email
            FROM `sdi_mailing_recipients` sdi
            LEFT JOIN `sdi_mailing` m ON sdi.`id_mailing` = m.`id`
            WHERE m.`active` = 1 AND m.`status` = 1
            ORDER BY sdi.`id_user`
            LIMIT 1
        ";

        parent::query($sql);
        $recipient = parent::fetch();

        if ($recipient) {
            // Todo: Проверка, если пользователь отписался от рассылок
            $user = UserModel::fetchUserById($recipient['id_user']);

            if ($user['settings'] && $user['settings']['sendEmail']) {
                $mailModel = new MailModel($this->settings, $recipient['email'], 'mailing', [
                    'name' => $recipient['name'],
                    'content' => $recipient['content_html']
                ]);
                $mailModel->send();
            }

            RecipientService::deleteItemFromDb($recipient['id_mailing'], $recipient['id_user'], $recipient['type_user']);
            $count = RecipientService::fetchCountRecipientsByMailingFromDb($recipient['id_mailing']);

            if ($count === 0 || trim($recipient['content_html']) === '') {
                $sql = "UPDATE `sdi_mailing` SET `status` = :status WHERE `id` = :id";

                parent::query($sql);
                parent::bindParams('id', $recipient['id_mailing']);
                parent::bindParams('status', trim($recipient['content_html']) === '' ? -1 : 2);
                parent::execute();
            }
        }
    }

    /**
     * Создание HTML контента рассылки на основе типа рассылки
     *
     * @param \App\Mailing\Mailing $mailing Объект рассылки
     * @return string
     */
    private static function createHtmlContent(Mailing $mailing): string
    {
        switch ($mailing->getType()) {
            case 'mail':
                return $mailing->getContentHtml();
            case 'compilation':
                $compilation = CompilationModel::fetchItemById($mailing->getContent());
                if (!$compilation['buildings'] || !count($compilation['buildings'])) {
                    return '';
                }

                $buildings = BuildingModel::fetchBuildings(['id' => $compilation['buildings'], 'active' => [1]]);
                if (!$buildings || !count($buildings)) {
                    return '';
                }

                $content = '';
                foreach ($buildings as $building) {
                    $district = [];
                    if ($building['district']) {
                        array_push($district, $building['district']);
                    }
                    if ($building['districtZone']) {
                        array_push($district, $building['districtZone']);
                    }
                    $content .= '
                        <div class="item" style="width: 100%; background-color: #fff; margin-bottom: 15px; padding: 8px 10px; position: relative; border: 1px solid #075ea5; box-sizing: border-box;">
                            <div class="image" style="width: 200px; height: 200px; float: left; background-color: #ccc; overflow: hidden; position: relative; box-sizing: border-box;">
                                <a href="https://sochidominvest.ru/building/' . $building['id'] . '" style="display: block;">
                                    <img src="https://api.sochidominvest.ru/uploads/image/thumb/' . $building['avatar'] . '" alt="' . $building['name'] . '" style="height: 100%; object-fit: cover; width: 100%;"/>
                                </a>
                            </div>
                            <div class="content" style="padding: 0 20px; float: left; width: calc(100% - 200px); box-sizing: border-box;">
                                <h2 style="font-size: 22px; line-height: 24px; margin-bottom: 40px; position: relative;">
                                    <a href="https://sochidominvest.ru/building/' . $building['id'] . '">' . $building['name'] . '</a>
                                </h2>
                                <div class="address" style="box-sizing: border-box;">
                                    <span style="display: block; font-size: 15px;">' . implode(', ', $district) . '</span>
                                    <span style="display: block; font-size: 15px;">' . $building['address'] . '</span>
                                </div>
                                <div class="cost" style="font-size: 20px; font-weight: 700; margin-bottom: 5px; box-sizing: border-box;">
                                    ' . (
                        $building['type'] === 'building' ? 'от ' . number_format($building['costMin'], 0, '.', ' ')
                            : number_format($building['cost'], 0, '.', ' ')
                        ) . ' руб.
                                </div>
                                <div class="area">Площадь: 
                                    ' . (
                        $building['type'] === 'building' ? 'от ' . $building['areaMin']
                            : $building['area']
                        ) . ' м<sup>2</sup>
                                </div>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                    ';
                }

                return '<div class="list" style="display: block;">' . $content . '</div>';
            case 'notification':
                // Todo: Доделать рассылку для уведомлений
                return '';
        }

        return '';
    }
}