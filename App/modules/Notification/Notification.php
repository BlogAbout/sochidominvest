<?php

namespace App\Notification;

class Notification
{
    public int $id;
    public int $author;
    public string $name;
    public string $description;
    public string $type;
    public int $objectId;
    public string $objectType;
    public string $dateCreated;
    public int $active;

    /**
     * Notification constructor.
     *
     * @param int $id
     * @param int $author
     * @param string $name
     * @param string $description
     * @param string $type
     * @param int $objectId
     * @param string $objectType
     * @param string $dateCreated
     * @param int $active
     */
    public function __construct(int $id, int $author, string $name, string $description, string $type, int $objectId, string $objectType, string $dateCreated, int $active)
    {
        $this->id = $id;
        $this->author = $author;
        $this->name = $name;
        $this->description = $description;
        $this->type = $type;
        $this->objectId = $objectId;
        $this->objectType = $objectType;
        $this->dateCreated = $dateCreated;
        $this->active = $active;
    }

    /**
     * Создание объекта Notification из массива данных
     *
     * @param array $data
     * @return \App\Notification\Notification
     */
    public static function initFromData(array $data = []): Notification
    {
        return new Notification(
            $data['id'] ?? 0,
            $data['author'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ?? '',
            $data['type'] ?? 'system',
            $data['objectId'] ?? 0,
            $data['objectType'] ?? '',
            $data['dateCreated'] ?? '',
            $data['active'] ?? 1
        );
    }

    /**
     * Создание объекта Notification из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\Notification\Notification
     */
    public static function initFromDB(array $data = []): Notification
    {
        return new Notification(
            $data['id'] ?? 0,
            $data['author'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ?? '',
            $data['type'] ?? 'system',
            $data['id_object'] ?? 0,
            $data['type_object'] ?? '',
            $data['date_created'] ?? '',
            $data['active'] ?? 1
        );
    }

    public function save()
    {
        NotificationService::insertItemToDb($this);
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
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
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
    public function getObjectId(): int
    {
        return $this->objectId;
    }

    /**
     * @param int $objectId
     */
    public function setObjectId(int $objectId): void
    {
        $this->objectId = $objectId;
    }

    /**
     * @return string
     */
    public function getObjectType(): string
    {
        return $this->objectType;
    }

    /**
     * @param string $objectType
     */
    public function setObjectType(string $objectType): void
    {
        $this->objectType = $objectType;
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
}