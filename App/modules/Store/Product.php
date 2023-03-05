<?php

namespace App\Store;

class Product
{
    public int $id;
    public int $categoryId;
    public string $name;
    public string $description;
    public float $cost;
    public float $costOld;
    public int $avatarId;
    public string $avatar;
    public string $dateCreated;
    public string $dateUpdate;
    public int $active;
    public int $author;
    public string $metaTitle;
    public string $metaDescription;
    public object $fields;
    public array $images;
    public array $videos;

    /**
     * Product constructor.
     *
     * @param int $id
     * @param int $categoryId
     * @param string $name
     * @param string $description
     * @param float $cost
     * @param float $costOld
     * @param int $avatarId
     * @param string $avatar
     * @param string $dateCreated
     * @param string $dateUpdate
     * @param int $active
     * @param int $author
     * @param string $metaTitle
     * @param string $metaDescription
     * @param object $fields
     * @param array $images
     * @param array $videos
     */
    public function __construct(int $id, int $categoryId, string $name, string $description, float $cost, float $costOld, int $avatarId, string $avatar, string $dateCreated, string $dateUpdate, int $active, int $author, string $metaTitle, string $metaDescription, object $fields, array $images, array $videos)
    {
        $this->id = $id;
        $this->categoryId = $categoryId;
        $this->name = $name;
        $this->description = $description;
        $this->cost = $cost;
        $this->costOld = $costOld;
        $this->avatarId = $avatarId;
        $this->avatar = $avatar;
        $this->dateCreated = $dateCreated;
        $this->dateUpdate = $dateUpdate;
        $this->active = $active;
        $this->author = $author;
        $this->metaTitle = $metaTitle;
        $this->metaDescription = $metaDescription;
        $this->fields = $fields;
        $this->images = $images;
        $this->videos = $videos;
    }

    /**
     * Создание объекта Product из массива данных
     *
     * @param array $data
     * @return \App\Store\Product
     */
    public static function initFromData(array $data = []): Product
    {
        return new Product(
            $data['id'] ?? 0,
            $data['categoryId'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ? html_entity_decode($data['description']) : '',
            $data['cost'] ?? 0,
            $data['costOld'] ?? 0,
            $data['avatarId'] ?? 0,
            $data['avatar'] ?? '',
            $data['dateCreated'] ?? '',
            $data['dateUpdate'] ?? '',
            $data['active'] ?? 1,
            $data['author'] ?? 0,
            $data['metaTitle'] ?? '',
            $data['metaDescription'] ?? '',
            $data['fields'] ?? null,
            $data['images'] ?? [],
            $data['videos'] ?? []
        );
    }

    /**
     * Создание объекта Product из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\Store\Product
     */
    public static function initFromDB(array $data = []): Product
    {
        return new Product(
            $data['id'] ?? 0,
            $data['id_category'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ? html_entity_decode($data['description']) : '',
            $data['cost'] ?? 0,
            $data['cost_old'] ?? 0,
            $data['id_avatar'] ?? 0,
            $data['avatar'] ?? '',
            $data['date_created'] ?? '',
            $data['date_update'] ?? '',
            $data['active'] ?? 1,
            $data['author'] ?? 0,
            $data['meta_title'] ?? '',
            $data['meta_description'] ?? '',
            $data['fields'] ? json_decode($data['fields']) : null,
            array_map('intval', $data['images'] ? explode(',', $data['images']) : []),
            array_map('intval', $data['videos'] ? explode(',', $data['videos']) : [])
        );
    }

    public function save()
    {
        if (!$this->getId()) {
            ProductService::insertItemToDb($this);
        } else {
            ProductService::updateItemToDb($this);
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
    public function getCategoryId(): int
    {
        return $this->categoryId;
    }

    /**
     * @param int $categoryId
     */
    public function setCategoryId(int $categoryId): void
    {
        $this->categoryId = $categoryId;
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
     * @return float
     */
    public function getCost(): float
    {
        return $this->cost;
    }

    /**
     * @param float $cost
     */
    public function setCost(float $cost): void
    {
        $this->cost = $cost;
    }

    /**
     * @return float
     */
    public function getCostOld(): float
    {
        return $this->costOld;
    }

    /**
     * @param float $costOld
     */
    public function setCostOld(float $costOld): void
    {
        $this->costOld = $costOld;
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
    public function getAvatar(): string
    {
        return $this->avatar;
    }

    /**
     * @param string $avatar
     */
    public function setAvatar(string $avatar): void
    {
        $this->avatar = $avatar;
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
     * @return object
     */
    public function getFields(): object
    {
        return $this->fields;
    }

    /**
     * @param object $fields
     */
    public function setFields(object $fields): void
    {
        $this->fields = $fields;
    }

    /**
     * @return array
     */
    public function getImages(): array
    {
        return $this->images;
    }

    /**
     * @param array $images
     */
    public function setImages(array $images): void
    {
        $this->images = $images;
    }

    /**
     * @return array
     */
    public function getVideos(): array
    {
        return $this->videos;
    }

    /**
     * @param array $videos
     */
    public function setVideos(array $videos): void
    {
        $this->videos = $videos;
    }
}