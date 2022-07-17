<?php

namespace App;

/**
 * MessageModel - Модель управления мессенджером.
 */
class MessageModel extends Model
{
    private int $id;            // Идентификатор сообщения
    private string $type;       // Тип сообщения: welcome, notification, message
    private int $authorId;      // Автор сообщения
    private array $attendees;   // Получатели сообщения (если пусто, получают все, кроме автора)
    private int $chatId;        // Идентификатор чата (только для личной переписки)
    private int $parentId;      // Идентификатор родительского сообщения (если цитата)
    private string $text;       // Текст сообщения
    private array $files;       // Массив файлов (вложений)

    /**
     * MessageModel constructor.
     */
    public function __construct(array $message)
    {
        parent::__construct();

        $this->id = $message['id'] ?: 0;
        $this->type = $message['type'] ?: 'message';
        $this->authorId = $message['authorId'] ?: 0;
        $this->attendees = $message['attendees'] ?: [];
        $this->chatId = $message['chatId'] ?: 0;
        $this->parentId = $message['parentId'] ?: 0;
        $this->text = $message['text'] ?: '';
        $this->files = $message['files'] ?: [];
    }

    public function __toString(): string
    {
        $data = [
            'id' => $this->id,
            'type' => $this->type,
            'authorId' => $this->authorId,
            'chatId' => $this->chatId,
            'parentId' => $this->parentId,
            'text' => $this->text
        ];

        return json_encode($data);
    }

    /**
     * Сохранение сообщения в базе данных
     */
    public function save()
    {
        if (!$this->chatId) {
            $this->createChat();
        }

        $this->createMessage();
    }

    /**
     * Создание нового чата, если это новое сообщение без chatId
     */
    private function createChat()
    {
        $sql = "
            INSERT INTO `sdi_messenger`
                (`name`, `author`, `type`, `date_created`)
            VALUES
                (:name, :author, :type, :dateCreated)
        ";

        parent::query($sql);
        parent::bindParams('name', '');
        parent::bindParams('author', $this->authorId);
        parent::bindParams('type', 'private');
        parent::bindParams('dateCreated', date('Y-m-d H:i:s'));

        $item = parent::execute();

        if (!$item) {
            return;
        }

        $this->setChatId(parent::lastInsertedId());

        if (!count($this->attendees)) {
            return;
        }

        $attendeesSql = [];

        foreach ($this->attendees as $attendee) {
            array_push($attendeesSql, "($this->chatId, $attendee)");
        }

        $sql = "
            INSERT INTO `sdi_messenger_member`
                (`id_messenger`, `id_user`)
            VALUES
        " . implode(',', $attendeesSql);

        self::query($sql);
        self::execute();
    }

    private function createMessage()
    {
        $sql = "
            INSERT INTO `sdi_messenger_messages`
                (`id_messenger`, `active`, `type`, `text`, `author`, `id_user`, `date_created`, `id_message_parent`)
            VALUES
                (:messengerId, :active, :type, :text, :author, :userId, :dateCreated, :parentMessageId)
        ";

        parent::query($sql);
        parent::bindParams('messengerId', $this->chatId);
        parent::bindParams('type', 'text');
        parent::bindParams('text', $this->text);
        parent::bindParams('author', $this->authorId);
        parent::bindParams('userId', count($this->attendees) ? $this->attendees[0] : 0);
        parent::bindParams('dateCreated', date('Y-m-d H:i:s'));
        parent::bindParams('parentMessageId', $this->parentId);

        $item = parent::execute();

        if (!$item) {
            return;
        }

        $this->setId(parent::lastInsertedId());
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
     * @return int
     */
    public function getAuthorId(): int
    {
        return $this->authorId;
    }

    /**
     * @param int $authorId
     */
    public function setAuthorId(int $authorId): void
    {
        $this->authorId = $authorId;
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

    /**
     * @return int
     */
    public function getChatId(): int
    {
        return $this->chatId;
    }

    /**
     * @param int $chatId
     */
    public function setChatId(int $chatId): void
    {
        $this->chatId = $chatId;
    }

    /**
     * @return int
     */
    public function getParentId(): int
    {
        return $this->parentId;
    }

    /**
     * @param int $parentId
     */
    public function setParentId(int $parentId): void
    {
        $this->parentId = $parentId;
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
     * @return array
     */
    public function getFiles(): array
    {
        return $this->files;
    }

    /**
     * @param array $files
     */
    public function setFiles(array $files): void
    {
        $this->files = $files;
    }
}