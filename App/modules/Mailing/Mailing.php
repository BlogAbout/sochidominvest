<?php

namespace App\Mailing;

class Mailing
{
    public int $id;
    public string $name;
    public string $content;
    public string $type;
    public int $author;
    public string $authorName;
    public int $active;
    public int $status;
    public string $dateCreated;
    public int $countRecipients;

    /**
     * Mailing constructor.
     *
     * @param int $id
     * @param string $name
     * @param string $content
     * @param string $type
     * @param int $author
     * @param string $authorName
     * @param int $active
     * @param int $status
     * @param string $dateCreated
     * @param int $countRecipients
     */
    public function __construct(int $id, string $name, string $content, string $type, int $author, string $authorName, int $active, int $status, string $dateCreated, int $countRecipients)
    {
        $this->id = $id;
        $this->name = $name;
        $this->content = $content;
        $this->type = $type;
        $this->author = $author;
        $this->authorName = $authorName;
        $this->active = $active;
        $this->status = $status;
        $this->dateCreated = $dateCreated;
        $this->countRecipients = $countRecipients;
    }

    /**
     * Создание объекта Mailing из массива данных
     *
     * @param array $data
     * @return \App\Mailing\Mailing
     */
    public static function initFromData(array $data = []): Mailing
    {
        return new Mailing(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['content'] ?? '',
            $data['type'] ?? 'mail',
            $data['author'] ?? 0,
            $data['authorName'] ?? '',
            $data['active'] ?? 1,
            $data['status'] ?? 0,
            $data['dateCreated'] ?? '',
            $data['countRecipients'] ?? 0
        );
    }

    /**
     * Создание объекта Mailing из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\Mailing\Mailing
     */
    public static function initFromDB(array $data = []): Mailing
    {
        return new Mailing(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['content'] ?? '',
            $data['type'] ?? 'mail',
            $data['author'] ?? 0,
            $data['authorName'] ?? '',
            $data['active'] ?? 1,
            $data['status'] ?? 0,
            $data['date_created'] ?? '',
            $data['countRecipients'] ?? 0
        );
    }

    public function save()
    {
        if (!$this->getId()) {
            MailingService::insertItemToDb($this);
        } else {
            MailingService::updateItemToDb($this);
        }
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
    public function getContent(): string
    {
        return $this->content;
    }

    /**
     * @param string $content
     */
    public function setContent(string $content): void
    {
        $this->content = $content;
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
    public function getAuthorName(): string
    {
        return $this->authorName;
    }

    /**
     * @param string $authorName
     */
    public function setAuthorName(string $authorName): void
    {
        $this->authorName = $authorName;
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
     * @return int
     */
    public function getStatus(): int
    {
        return $this->status;
    }

    /**
     * @param int $status
     */
    public function setStatus(int $status): void
    {
        $this->status = $status;
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
    public function getCountRecipients(): int
    {
        return $this->countRecipients;
    }

    /**
     * @param int $countRecipients
     */
    public function setCountRecipients(int $countRecipients): void
    {
        $this->countRecipients = $countRecipients;
    }
}