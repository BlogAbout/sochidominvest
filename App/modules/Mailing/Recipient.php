<?php

namespace App\Mailing;

class Recipient
{
    public int $mailingId;
    public int $userId;
    public string $userType;
    public string $email;

    /**
     * Recipient constructor.
     *
     * @param int $mailingId
     * @param int $userId
     * @param string $userType
     * @param string $email
     */
    public function __construct(int $mailingId, int $userId, string $userType, string $email)
    {
        $this->mailingId = $mailingId;
        $this->userId = $userId;
        $this->userType = $userType;
        $this->email = $email;
    }


    /**
     * Создание объекта Recipient из массива данных
     *
     * @param array $data
     * @return \App\Mailing\Recipient
     */
    public static function initFromData(array $data = []): Recipient
    {
        return new Recipient(
            $data['mailingId'] ?? 0,
            $data['userId'] ?? 0,
            $data['userType'] ?? '',
            $data['email'] ?? ''
        );
    }

    /**
     * Создание объекта Recipient из данных, полученных из базы данных
     *
     * @param array $data
     * @return \App\Mailing\Recipient
     */
    public static function initFromDB(array $data = []): Recipient
    {
        return new Recipient(
            $data['id_mailing'] ?? 0,
            $data['id_user'] ?? 0,
            $data['type_user'] ?? '',
            $data['email'] ?? ''
        );
    }

    /**
     * @return int
     */
    public function getMailingId(): int
    {
        return $this->mailingId;
    }

    /**
     * @param int $mailingId
     */
    public function setMailingId(int $mailingId): void
    {
        $this->mailingId = $mailingId;
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
    public function getUserType(): string
    {
        return $this->userType;
    }

    /**
     * @param string $userType
     */
    public function setUserType(string $userType): void
    {
        $this->userType = $userType;
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
}