<?php

namespace App\Agent;

class Contact
{
    public int $id;
    public int $agentId;
    public string $name;
    public string $post;
    public string $phone;
    public int $author;
    public string $authorName;
    public string $dateCreated;
    public string $dateUpdate;
    public int $active;

    /**
     * Contact constructor.
     * @param int $id
     * @param int $agentId
     * @param string $name
     * @param string $post
     * @param string $phone
     * @param int $author
     * @param string $authorName
     * @param string $dateCreated
     * @param string $dateUpdate
     * @param int $active
     */
    public function __construct(int $id, int $agentId, string $name, string $post, string $phone, int $author, string $authorName, string $dateCreated, string $dateUpdate, int $active)
    {
        $this->id = $id;
        $this->agentId = $agentId;
        $this->name = $name;
        $this->post = $post;
        $this->phone = $phone;
        $this->author = $author;
        $this->authorName = $authorName;
        $this->dateCreated = $dateCreated;
        $this->dateUpdate = $dateUpdate;
        $this->active = $active;
    }

    /**
     * Создание объекта Contact из массива данных
     *
     * @param array $data
     * @return \App\Agent\Contact
     */
    public static function initFromData(array $data = []): Contact
    {
        return new Contact(
            $data['id'] ?? 0,
            $data['agentId'] ?? 0,
            $data['name'] ?? '',
            $data['post'] ?? '',
            $data['phone'] ?? '',
            $data['author'] ?? 0,
            $data['authorName'] ?? '',
            $data['dateCreated'] ?? '',
            $data['dateUpdate'] ?? '',
            $data['active'] ?? 1
        );
    }

    /**
     * Создание объекта Agent из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\Agent\Contact
     */
    public static function initFromDB(array $data = []): Contact
    {
        return new Contact(
            $data['id'] ?? 0,
            $data['id_agent'] ?? 0,
            $data['name'] ?? '',
            $data['post'] ?? '',
            $data['phone'] ?? '',
            $data['author'] ?? 0,
            $data['authorName'] ?? '',
            $data['date_created'] ?? '',
            $data['date_update'] ?? '',
            $data['active'] ?? 1
        );
    }

    public function save()
    {
        if (!$this->getId()) {
            ContactService::insertItemToDb($this);
        } else {
            ContactService::updateItemToDb($this);
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
     * @return int
     */
    public function getAgentId(): int
    {
        return $this->agentId;
    }

    /**
     * @param int $agentId
     */
    public function setAgentId(int $agentId): void
    {
        $this->agentId = $agentId;
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
    public function getPost(): string
    {
        return $this->post;
    }

    /**
     * @param string $post
     */
    public function setPost(string $post): void
    {
        $this->post = $post;
    }

    /**
     * @return string
     */
    public function getPhone(): string
    {
        return $this->phone;
    }

    /**
     * @param string $phone
     */
    public function setPhone(string $phone): void
    {
        $this->phone = $phone;
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