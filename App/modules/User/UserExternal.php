<?php

namespace App\User;

class UserExternal
{
    public int $id;
    public string $name;
    public string $email;
    public string $phone;
    public int $active;
    public string $dateCreated;
    public string $dateUpdate;

    /**
     * UserExternal constructor.
     *
     * @param int $id
     * @param string $name
     * @param string $email
     * @param string $phone
     * @param int $active
     * @param string $dateCreated
     * @param string $dateUpdate
     */
    public function __construct(int $id = 0, string $name = '', string $email = '', string $phone = '', int $active = 1, string $dateCreated = '', string $dateUpdate = '')
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->phone = $phone;
        $this->active = $active;
        $this->dateCreated = $dateCreated;
        $this->dateUpdate = $dateUpdate;
    }

    /**
     * Создание объекта UserExternal из массива данных
     *
     * @param array $data
     * @return \App\User\UserExternal
     */
    public static function initFromData(array $data = []): UserExternal
    {
        return new UserExternal(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? '',
            $data['active'] ?? 0,
            $data['dateCreated'] ?? '',
            $data['dateUpdate'] ?? ''
        );
    }

    /**
     * Создание объекта UserExternal из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\User\UserExternal
     */
    public static function initFromDB(array $data = []): UserExternal
    {
        return new UserExternal(
            $data['id'] ?? 0,
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? '',
            $data['active'] ?? 0,
            $data['date_created'] ?? '',
            $data['date_update'] ?? ''
        );
    }

    public function save()
    {
        if (!$this->getId()) {
            UserExternalService::insertItemToDb($this);
        } else {
            UserExternalService::updateItemToDb($this);
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
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
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
}