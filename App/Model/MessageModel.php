<?php

namespace App;

/**
 * MessageModel - Модель управления мессенджером.
 */
class MessageModel extends Model
{
    private int $id;       // Идентификатор сообщения
    private string $type;       // Тип сообщения: welcome, notification, message
    private int $authorId;      // Автор сообщения
    private array $attendees;   // Получатели сообщения (если пусто, получают все, кроме автора)
    private int $chatId;   // Идентификатор чата (только для личной переписки)
    private int $groupId;  // Идентификатор группы (только для группового чата)
    private int $parentId; // Идентификатор родительского сообщения (если цитата)
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
        $this->groupId = $message['groupId'] ?: 0;
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
            'groupId' => $this->groupId,
            'parentId' => $this->parentId,
            'text' => $this->text
        ];

        return json_encode($data);
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
    public function getGroupId(): int
    {
        return $this->groupId;
    }

    /**
     * @param int $groupId
     */
    public function setGroupId(int $groupId): void
    {
        $this->groupId = $groupId;
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