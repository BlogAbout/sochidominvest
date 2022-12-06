<?php

namespace App\Messenger;

use App\Model;
use App\UtilModel;

// Fixme: отделить сервис от модели
class Messenger extends Model
{
    public int $id;
    public int $author;
    public int $avatarId;
    public string $name;
    public string $type;
    public string $dateCreated;
    public array $members;
    public array $messages;

    public function __construct(array $data = [])
    {
        parent::__construct();

        $this->id = $data['id'] ?? 0;
        $this->author = $data['author'] ?? 0;
        $this->avatarId = $data['avatarId'] ? (int)$data['avatarId'] : 0;
        $this->name = $data['name'] ?? '';
        $this->type = $data['type'] ?? 'message';
        $this->dateCreated = $data['dateCreated'] ?? '';
        $this->members = $data['members'] ?? [];
        $this->messages = $data['messages'] ?? [];
    }

    /**
     * Вернет чат по id
     *
     * @param int $messengerId Идентификатор чата
     * @return Messenger
     */
    public static function fetchMessengerById(int $messengerId): Messenger
    {
        $sql = "
            SELECT sdi.*
            FROM `sdi_messenger` sdi
            WHERE sdi.`id` = :messengerId
        ";

        parent::query($sql);
        parent::bindParams('messengerId', $messengerId);
        $item = parent::fetch();

        if (!empty($item)) {
            $messenger = new Messenger(self::formatData($item));

            $filter = [
                'messengerIds' => [$messenger->getId()]
            ];

            $messenger->setMessages(Message::fetchMessages($filter, [], 100));
            $messenger->fetchMembers();

            return $messenger;
        }

        // Fixme
        return [];
    }

    /**
     * Вернет список чатов
     *
     * @param int $currentUserId Идентификатор пользователя
     * @return array
     */
    public static function fetchMessengers(int $currentUserId): array
    {
        $messengers = [];

        $sql = "
            SELECT sdi.*
            FROM `sdi_messenger` sdi
            LEFT JOIN `sdi_messenger_member` AS mem ON mem.`id_messenger` = sdi.`id`
            WHERE mem.`id_user` = :currentUserId
            ORDER BY sdi.`id` DESC
        ";

        parent::query($sql);
        parent::bindParams('currentUserId', $currentUserId);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                $messenger = new Messenger(self::formatData($item));

                $filter = [
                    'messengerIds' => [$messenger->getId()]
                ];
                $sort = [
                    'id' => 'DESC'
                ];

                $messenger->setMessages(Message::fetchMessages($filter, $sort, 1));
                $messenger->fetchMembers();

                array_push($messengers, $messenger);
            }
        }

        return $messengers;
    }

    /**
     * Удаление чата по id
     *
     * @param int $messengerId Идентификатор чата
     * @param int $currentUserId Идентификатор пользователя
     * @return bool
     */
    public static function deleteMessenger(int $messengerId, int $currentUserId): bool
    {
        // Todo
        return true;
    }

    private function fetchMembers(): void
    {
        $members = [];

        $sql = "
            SELECT sdi.*
            FROM sdi_messenger_member sdi
            WHERE sdi.`id_messenger` = :messengerId
        ";

        parent::query($sql);
        parent::bindParams('messengerId', $this->getId());

        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                $members[$item['id_user']] = [
                    'userId' => $item['id_user'],
                    'readed' => (int)$item['id_message_readed'],
                    'deleted' => (int)$item['id_message_deleted'],
                    'active' => (int)$item['active']
                ];
            }
        }

        $this->setMembers($members);
    }

    /**
     * Обновление информации о прочитанных сообщениях
     *
     * @param \App\Messenger\Message $message Объект сообщения
     */
    public static function read(Message $message): void
    {
        $sql = "
            UPDATE `sdi_messenger_member`
            SET `id_message_readed` = :readed
            WHERE `id_messenger` = :messengerId AND `id_user` = :userId
        ";

        parent::query($sql);
        parent::bindParams('readed', (int)$message->getText());
        parent::bindParams('messengerId', $message->getMessengerId());
        parent::bindParams('userId', $message->getAuthor());

        parent::execute();
    }

    /**
     * Сохранение информации о чате
     */
    public function save(): void
    {
        if (!$this->getId()) {
            $this->insertToDb();
        } else {
            $this->updateToDb();
        }
    }

    /**
     * Добавление нового чата в базу данных
     */
    private function insertToDb(): void
    {
        $sql = "
            INSERT INTO `sdi_messenger`
                (`author`, `id_avatar`, `name`, `type`, `date_created`)
            VALUES
                (:author, :avatarId, :name, :type, :dateCreated)
        ";

        parent::query($sql);
        parent::bindParams('author', $this->getAuthor());
        parent::bindParams('avatarId', $this->getAvatarId());
        parent::bindParams('name', $this->getName());
        parent::bindParams('type', $this->getType());
        parent::bindParams('dateCreated', UtilModel::getDateNow());

        $item = parent::execute();

        if ($item) {
            $this->setId(parent::lastInsertedId());

            if (count($this->members)) {
                $this->insertMembersToDb();
            }
        }
    }

    /**
     * Обновление чата в базе данных
     */
    private function updateToDb(): void
    {
        $sql = "
            UPDATE `sdi_messenger`
            SET
                `id_avatar` = :avatarId,
                `name` = :name,
                `type` = :type
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $this->getId());
        parent::bindParams('avatarId', $this->getAvatarId());
        parent::bindParams('name', $this->getName());
        parent::bindParams('type', $this->getType());

        parent::execute();
    }

    /**
     * Добавление участников чата в базу данных
     */
    private function insertMembersToDb(): void
    {
        $this->dropMembersFromDb();

        $membersSql = [];

        foreach ($this->members as $key => $val) {
            array_push($membersSql, "($this->id, $key)");
        }

        $sql = "
            INSERT INTO `sdi_messenger_member`
                (`id_messenger`, `id_user`)
            VALUES
        " . implode(',', $membersSql);

        self::query($sql);
        self::execute();
    }

    /**
     * Удаление участников чата из базы данных
     */
    private function dropMembersFromDb(): void
    {
        $sql = "
            DELETE FROM `sdi_messenger_member`
            WHERE `id_messenger` = :messengerId
        ";

        self::query($sql);
        self::bindParams('messengerId', $this->getId());
        self::execute();
    }

    public function __toString(): string
    {
        $data = [
            'id' => $this->getId(),
            'author' => $this->getAuthor(),
            'avatarId' => $this->getAvatarId(),
            'name' => $this->getName(),
            'type' => $this->getType(),
            'dateCreated' => $this->getDateCreated(),
            'members' => $this->getMembers(),
            'messages' => $this->getMessages()
        ];

        return json_encode($data);
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     *
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatData(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'author' => (int)$data['author'],
            'avatarId' => (int)$data['id_avatar'],
            'name' => $data['name'],
            'type' => $data['type'],
            'dateCreated' => $data['date_created'],
            'members' => $data['members'] ?? [],
            'messages' => $data['messages'] ?? []
        ];
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getAuthor(): int
    {
        return $this->author;
    }

    /**
     * @param int $author
     */
    public function setAuthor(int $author): void
    {
        $this->author = $author;
    }

    /**
     * @return int
     */
    public function getAvatarId(): int
    {
        return $this->avatarId;
    }

    /**
     * @param int $avatarId
     */
    public function setAvatarId(int $avatarId): void
    {
        $this->avatarId = $avatarId;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getDateCreated(): string
    {
        return $this->dateCreated;
    }

    /**
     * @param string $dateCreated
     */
    public function setDateCreated(string $dateCreated): void
    {
        $this->dateCreated = $dateCreated;
    }

    /**
     * @return array
     */
    public function getMembers(): array
    {
        return $this->members;
    }

    /**
     * @param array $members
     */
    public function setMembers(array $members): void
    {
        $this->members = $members;
    }

    /**
     * @return array
     */
    public function getMessages(): array
    {
        return $this->messages;
    }

    /**
     * @param array $messages
     */
    public function setMessages(array $messages): void
    {
        $this->messages = $messages;
    }
}