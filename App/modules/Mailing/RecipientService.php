<?php

namespace App\Mailing;

use App\Model;

class RecipientService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Извлекает список получателей
     *
     * @param int $mailingId Идентификатор рассылки
     * @return array
     */
    public static function fetchList(int $mailingId): array
    {
        $listResult = [];

        $sql = "
            SELECT sdi.`id_mailing`, sdi.`id_user`, sdi.`type_user`,
                   IF(
                       sdi.`type_user` = 'subscriber',
                       (SELECT u.`email` FROM `sdi_user` u WHERE u.`id` = sdi.`id_user`),
                       (SELECT ue.`email` FROM `sdi_user_external` ue WHERE ue.`id` = sdi.`id_user`)
                   ) AS email
            FROM `sdi_mailing_recipients` sdi
            WHERE sdi.`id_mailing`
            ORDER BY sdi.`id_user` ASC
        ";

        parent::query($sql);
        parent::bindParams('mailingId', $mailingId);
        $listData = parent::fetchAll();

        if (!empty($listData)) {
            foreach ($listData as $data) {
                array_push($listResult, Recipient::initFromDB($data));
            }
        }

        return $listResult;
    }

    /**
     * Добавление списка получателей в базу данных
     *
     * @param array $recipients
     */
    public static function insertListItemsToDb(array $recipients): void
    {
        if ($recipients && count($recipients)) {
            $recipientsSql = [];

            foreach ($recipients as $recipient) {
                array_push($recipientsSql, "(" . $recipient->getMailingId() . ", " . $recipient->getUserId() . ", '" . $recipient->getUserType() . "')");
            }

            $sql = "
                INSERT INTO `sdi_mailing_recipients`
                    (`id_mailing`, `id_user`, `type_user`)
                VALUES
            " . implode(",", $recipientsSql);

            self::query($sql);
            self::execute();
        }
    }

    /**
     * Удаляет получателя по id из рассылки
     *
     * @param int $mailingId Идентификатор рассылки
     * @param int $userId Идентификатор пользователя
     * @param string $userType Тип пользователя
     * @return bool
     */
    public static function deleteItemFromDb(int $mailingId, int $userId, string $userType): bool
    {
        $sql = "DELETE FROM `sdi_mailing_recipients` WHERE `id_mailing` = :mailingId AND `id_user` = :userId AND `type_user` = :userType";

        parent::query($sql);
        parent::bindParams('mailingId', $mailingId);
        parent::bindParams('userId', $userId);
        parent::bindParams('userType', $userType);

        return parent::execute();
    }
}