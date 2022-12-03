<?php

namespace App\Agent;

class Agent
{
    public int $id;
    public string $name;
    public string $description;
    public string $address;
    public string $phone;
    public int $author;
    public string $type;
    public string $dateCreated;
    public string $dateUpdate;
    public int $active;
    public int $avatarId;
    public string $avatar;
    public array $buildings;

    /**
     * Agent constructor.
     * @param int $id
     * @param string $name
     * @param string $description
     * @param string $address
     * @param string $phone
     * @param int $author
     * @param string $type
     * @param string $dateCreated
     * @param string $dateUpdate
     * @param int $active
     * @param int $avatarId
     * @param string $avatar
     * @param array $buildings
     */
    public function __construct(int $id, string $name, string $description, string $address, string $phone, int $author, string $type, string $dateCreated, string $dateUpdate, int $active, int $avatarId, string $avatar, array $buildings)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->address = $address;
        $this->phone = $phone;
        $this->author = $author;
        $this->type = $type;
        $this->dateCreated = $dateCreated;
        $this->dateUpdate = $dateUpdate;
        $this->active = $active;
        $this->avatarId = $avatarId;
        $this->avatar = $avatar;
        $this->buildings = $buildings;
    }

    /**
     * Создание объекта Agent из массива данных
     *
     * @param array $data
     * @return \App\Agent\Agent
     */
    public static function initFromData(array $data = []): Agent
    {
        return new Agent(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ?? '',
            $data['address'] ?? '',
            $data['phone'] ?? '',
            $data['author'] ?? 0,
            $data['type'] ?? 'agent',
            $data['dateCreated'] ?? '',
            $data['dateUpdate'] ?? '',
            $data['active'] ?? 1,
            $data['avatarId'] ?? 0,
            $data['avatar'] ?? '',
            $data['buildings'] ?? []
        );
    }

    /**
     * Создание объекта Agent из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\Agent\Agent
     */
    public static function initFromDB(array $data = []): Agent
    {
        return new Agent(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['description'] ?? '',
            $data['address'] ?? '',
            $data['phone'] ?? '',
            $data['author'] ?? 0,
            $data['type'] ?? 'agent',
            $data['date_created'] ?? '',
            $data['date_update'] ?? '',
            $data['active'] ?? 1,
            $data['id_avatar'] ?? 0,
            $data['avatar'] ?? '',
            $data['buildings'] ?? []
        );
    }

    public function save()
    {
        if (!$this->getId()) {
            AgentService::insertItemToDb($this);
        } else {
            AgentService::updateItemToDb($this);
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
    public function getAddress(): string
    {
        return $this->address;
    }

    /**
     * @param string $address
     */
    public function setAddress(string $address): void
    {
        $this->address = $address;
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
     * @return array
     */
    public function getBuildings(): array
    {
        return $this->buildings;
    }

    /**
     * @param array $buildings
     */
    public function setBuildings(array $buildings): void
    {
        $this->buildings = $buildings;
    }
}