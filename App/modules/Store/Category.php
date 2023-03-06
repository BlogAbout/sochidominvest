<?php

namespace App\Store;

class Category
{
    public int $id;
    public string $name;
    public string $description;
    public string $dateCreated;
    public string $dateUpdate;
    public int $active;
    public int $author;
    public string $metaTitle;
    public string $metaDescription;
    public array $fields;

    /**
     * Category constructor.
     *
     * @param int $id
     * @param string $name
     * @param string $description
     * @param string $dateCreated
     * @param string $dateUpdate
     * @param int $active
     * @param int $author
     * @param string $metaTitle
     * @param string $metaDescription
     * @param array $fields
     */
    public function __construct(int $id, string $name, string $description, string $dateCreated, string $dateUpdate, int $active, int $author, string $metaTitle, string $metaDescription, array $fields)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->dateCreated = $dateCreated;
        $this->dateUpdate = $dateUpdate;
        $this->active = $active;
        $this->author = $author;
        $this->metaTitle = $metaTitle;
        $this->metaDescription = $metaDescription;
        $this->fields = $fields;
    }

    /**
     * Создание объекта Category из массива данных
     *
     * @param array $data
     * @return \App\Store\Category
     */
    public static function initFromData(array $data = []): Category
    {
        return new Category(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ? html_entity_decode($data['description']) : '',
            $data['dateCreated'] ?? '',
            $data['dateUpdate'] ?? '',
            $data['active'] ?? 1,
            $data['author'] ?? 0,
            $data['metaTitle'] ?? '',
            $data['metaDescription'] ?? '',
            $data['fields'] ?? []
        );
    }

    /**
     * Создание объекта Category из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\Store\Category
     */
    public static function initFromDB(array $data = []): Category
    {
        return new Category(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ? html_entity_decode($data['description']) : '',
            $data['date_created'] ?? '',
            $data['date_update'] ?? '',
            $data['active'] ?? 1,
            $data['author'] ?? 0,
            $data['meta_title'] ?? '',
            $data['meta_description'] ?? '',
            $data['fields'] ? json_decode($data['fields']) : []
        );
    }

    public function save()
    {
        if (!$this->getId()) {
            CategoryService::insertItemToDb($this);
        } else {
            CategoryService::updateItemToDb($this);
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
    public function getMetaTitle(): string
    {
        return $this->metaTitle;
    }

    /**
     * @param string $metaTitle
     */
    public function setMetaTitle(string $metaTitle): void
    {
        $this->metaTitle = $metaTitle;
    }

    /**
     * @return string
     */
    public function getMetaDescription(): string
    {
        return $this->metaDescription;
    }

    /**
     * @param string $metaDescription
     */
    public function setMetaDescription(string $metaDescription): void
    {
        $this->metaDescription = $metaDescription;
    }

    /**
     * @return array
     */
    public function getFields(): array
    {
        return $this->fields;
    }

    /**
     * @param array $fields
     */
    public function setFields(array $fields): void
    {
        $this->fields = $fields;
    }
}