<?php

namespace App\Messenger;

use App\Model;
use App\UtilModel;

class Message extends Model
{
    public int $id;
    public int $messengerId;
    public int $active;
    public string $type; // Тип сообщения: welcome, online, notification, message, create
    public string $text;
    public int $author;
    public int $userId;
    public string $dateCreated;
    public string $dateUpdate;
    public int $parentMessageId;
    public array $attendees;

    /**
     * Message constructor.
     */
    public function __construct(array $data = [])
    {
        parent::__construct();

        $this->id = $data['id'] ?: 0;
        $this->messengerId = $data['messengerId'] ?: 0;
        $this->active = $data['active'] ? (int)$data['active'] : 1;
        $this->type = $data['type'] ?: 'message';
        $this->text = $data['text'] ?: '';
        $this->author = $data['author'] ?: 0;
        $this->userId = $data['userId'] ? (int)$data['userId'] : 0;
        $this->dateCreated = $data['dateCreated'] ?: '';
        $this->dateUpdate = $data['dateUpdate'] ?: '';
        $this->parentMessageId = $data['parentMessageId'] ?: 0;
        $this->attendees = $data['attendees'] ?: [];
    }

    /**
     * Вернет список сообщений
     *
     * @param array $filter Массив фильтров
     * @param array $sort Массив сортировок
     * @param int $limit Количество записей
     * @return array
     */
    public static function fetchMessages(array $filter = [], array $sort = [], int $limit = 0): array
    {
        $messages = [];
        $whereArray = [];
        $sortArray = [];

        if (count($filter)) {
            if (!empty($filter['messagesIds']) && count($filter['messagesIds'])) {
                array_push($whereArray, 'sdi.`id` IN (' . implode($filter['messagesIds']) . ')');
            }

            // Todo
            if (!empty($filter['messengerIds']) && count($filter['messengerIds'])) {
                array_push($whereArray, 'sdi.`id_messenger` IN (' . implode($filter['messengerIds']) . ')');
            }
        }

        if (count($sort)) {
            // Todo
            foreach ($sort as $key => $val) {
                array_push($sortArray, $key . ' ' . $val);
            }
        }

        $sql = "
            SELECT sdi.*
            FROM `sdi_messenger_messages` sdi
            " . (count($whereArray) ? " WHERE " . implode(' AND ', $whereArray) : "") . "
            " . (count($sortArray) ? " ORDER BY " . implode(', ', $sortArray) : "") . "
            " . ($limit ? " LIMIT " . $limit : "") . "
        ";

        parent::query($sql);

        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                $message = new Message(self::formatData($item));
                array_push($messages, $message);
            }
        }

        return $messages;
    }

    /**
     * Сохранение сообщения
     */
    public function save(): void
    {
        if (!$this->getId()) {
            if (!$this->getMessengerId()) {
                $membersData = [];

                if ($this->getAttendees() && count($this->getAttendees())) {
                    foreach ($this->getAttendees() as $attendee) {
                        $membersData[$attendee] = [
                            'userId' => $attendee,
                            'readed' => 0,
                            'deleted' => 0,
                            'active' => 1
                        ];
                    }
                }

                $messengerData = [
                    'author' => $this->getAuthor(),
                    'members' => $membersData,
                    'messages' => [$this]
                ];

                $messenger = new Messenger($messengerData);

                $messenger->save();
                $this->setMessengerId($messenger->getId());
                $this->setType('create');
            }

            $this->insertToDb();
        } else {
            $this->updateToDb();
        }
    }

    /**
     * Добавление нового сообщения в базу данных
     */
    private function insertToDb(): void
    {
        $dateNow = UtilModel::getDateNow();
        $this->setDateCreated($dateNow);
        $this->setDateUpdate($dateNow);

        $sql = "
            INSERT INTO `sdi_messenger_messages`
                (`id_messenger`, `active`, `type`, `text`, `author`, `id_user`, `date_created`, `date_update`, `id_message_parent`)
            VALUES
                (:messengerId, :active, :type, :text, :author, :userId, :dateCreated, :dateUpdate, :parentMessageId)
        ";

        parent::query($sql);
        parent::bindParams('messengerId', $this->getMessengerId());
        parent::bindParams('active', $this->getActive());
        parent::bindParams('type', $this->getType());
        parent::bindParams('text', $this->getText());
        parent::bindParams('author', $this->getAuthor());
        parent::bindParams('userId', $this->getUserId());
        parent::bindParams('dateCreated', $this->getDateCreated());
        parent::bindParams('dateUpdate', $this->getDateUpdate());
        parent::bindParams('parentMessageId', $this->getParentMessageId());

        $item = parent::execute();

        if ($item) {
            $this->setId(parent::lastInsertedId());
        }
    }

    /**
     * Обновление сообщения в базе данных
     */
    private function updateToDb(): void
    {
        $sql = "
            UPDATE `sdi_messenger_messages`
            SET
                `active` = :active,
                `type` = :type,
                `text` = :text,
                `id_user` = :text,
                `date_update` = :dateUpdate,
                `id_message_parent` = :parentMessageId
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $this->getId());
        parent::bindParams('active', $this->getActive());
        parent::bindParams('type', $this->getType());
        parent::bindParams('text', $this->getText());
        parent::bindParams('userId', $this->getUserId());
        parent::bindParams('dateUpdate', UtilModel::getDateNow());
        parent::bindParams('parentMessageId', $this->getParentMessageId());

        parent::execute();
    }

    public function __toString(): string
    {
        $data = [
            'id' => $this->getId(),
            'messengerId' => $this->getMessengerId(),
            'active' => $this->getActive(),
            'type' => $this->getType(),
            'text' => $this->getText(),
            'author' => $this->getAuthor(),
            'userId' => $this->getUserId(),
            'dateCreated' => $this->getDateCreated(),
            'dateUpdate' => $this->getDateUpdate(),
            'parentMessageId' => $this->getParentMessageId(),
            'attendees' => $this->getAttendees()
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
            'messengerId' => (int)$data['id_messenger'],
            'active' => (int)$data['active'],
            'type' => $data['type'],
            'text' => $data['text'],
            'author' => (int)$data['author'],
            'userId' => (int)$data['id_user'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'parentMessageId' => (int)$data['id_message_parent'],
            'attendees' => []
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
    public function getMessengerId(): int
    {
        return $this->messengerId;
    }

    /**
     * @param int $messengerId
     */
    public function setMessengerId(int $messengerId): void
    {
        $this->messengerId = $messengerId;
    }

    /**
     * @return int
     */
    public function getActive(): int
    {
        return $this->active;
    }

    /**
     * @param int $active
     */
    public function setActive(int $active): void
    {
        $this->active = $active;
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
    public function getText(): string
    {
        return $this->text;
    }

    /**
     * @param string $text
     */
    public function setText(string $text): void
    {
        $this->text = $text;
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
    public function getUserId(): int
    {
        return $this->userId;
    }

    /**
     * @param int $userId
     */
    public function setUserId(int $userId): void
    {
        $this->userId = $userId;
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
     * @return string
     */
    public function getDateUpdate(): string
    {
        return $this->dateUpdate;
    }

    /**
     * @param string $dateUpdate
     */
    public function setDateUpdate(string $dateUpdate): void
    {
        $this->dateUpdate = $dateUpdate;
    }

    /**
     * @return int
     */
    public function getParentMessageId(): int
    {
        return $this->parentMessageId;
    }

    /**
     * @param int $parentMessageId
     */
    public function setParentMessageId(int $parentMessageId): void
    {
        $this->parentMessageId = $parentMessageId;
    }

    /**
     * @return array
     */
    public function getAttendees(): array
    {
        return $this->attendees;
    }

    /**
     * @param array $attendees
     */
    public function setAttendees(array $attendees): void
    {
        $this->attendees = $attendees;
    }
}