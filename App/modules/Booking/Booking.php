<?php

namespace App\Booking;

use App\BuildingModel;
use App\MailModel;
use App\Model;
use App\NotificationModel;

// Fixme: отделить сервис от модели
class Booking extends Model
{
    public int $id;
    public string $dateStart;
    public string $dateFinish;
    public string $status;
    public int $buildingId;
    public string $buildingName;
    public int $userId;

    public function __construct(array $data = [], $settings = null)
    {
        parent::__construct($settings);

        $this->id = $data['id'] ?? 0;
        $this->dateStart = $data['dateStart'] ?? '';
        $this->dateFinish = $data['dateFinish'] ?? '';
        $this->status = $data['status'] ?? 'new';
        $this->buildingId = $data['buildingId'] ?? 0;
        $this->buildingName = $data['buildingName'] ?? '';
        $this->userId = $data['userId'] ?? 0;
    }

    /**
     * Получение данных бизнес-процесса по идентификатору
     *
     * @param int $bookingId Идентификатор брони
     * @return \App\Booking\Booking
     */
    public static function fetchItem(int $bookingId): Booking
    {
        $sql = "
            SELECT sdi.*,
                   (
                       SELECT b.`name`
                       FROM `sdi_building` AS b
                       WHERE b.`id` = sdi.`id_building` AND b.`active` IN (0, 1)
                   ) AS name_building
            FROM `sdi_booking` sdi
            WHERE sdi.`id` = :bookingId
        ";

        parent::query($sql);
        parent::bindParams('bookingId', $bookingId);
        $item = parent::fetch();

        if (!empty($item)) {
            return new Booking(self::formatData($item));
        }

        // Fixme
        return [];
    }

    /**
     * Получение данных бронирования на основе параметров фильтра
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $resultList = [];
        $sqlWhere = '';
        $where = [];

        if (!empty($filter['id']) && (!empty($filter['dateStart']) || !empty($filter['dateFinish']))) {
            array_push($where, "sdi.`id` NOT IN (" . implode(',', $filter['id']) . ")");
        } else if (!empty($filter['id'])) {
            array_push($where, "sdi.`id` IN (" . implode(',', $filter['id']) . ")");
        }

        if (!empty($filter['buildingId'])) {
            array_push($where, "sdi.`id_building` IN (" . implode(',', $filter['buildingId']) . ")");
        }

        if (!empty($filter['status'])) {
            array_push($where, "sdi.`status` IN ('" . implode("','", $filter['status']) . "')");
        }

        if (!empty($filter['dateStart']) && !empty($filter['dateFinish'])) {
            array_push($where, "
                (
                    (sdi.`date_start` BETWEEN '" . $filter['dateStart'] . "' AND '" . $filter['dateFinish'] . "') OR
                    (sdi.`date_finish` BETWEEN '" . $filter['dateStart'] . "' AND '" . $filter['dateFinish'] . "')
                )
            ");
        } else if (!empty($filter['dateStart'])) {
            array_push($where, "sdi.`date_start` >= '" . $filter['dateStart'] . "'");
        } else if (!empty($filter['dateFinish'])) {
            array_push($where, "sdi.`date_finish` <= '" . $filter['dateFinish'] . "'");
        }

        if (count($where)) {
            $sqlWhere = " WHERE " . implode(' AND ', $where);
        }

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT b.`name`
                       FROM `sdi_building` AS b
                       WHERE b.`id` = sdi.`id_building` AND b.`active` IN (0, 1)
                   ) AS name_building
            FROM `sdi_booking` sdi
            $sqlWhere
            ORDER BY sdi.`date_start` ASC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                $booking = new Booking(self::formatData($item));

                array_push($resultList, $booking);
            }
        }

        return $resultList;
    }

    /**
     * Сохранение информации о бронировании
     */
    public function save(): void
    {
        if (!$this->getId()) {
            $this->insertToDb();
        } else {
            $this->updateToDb();
        }
    }

    /**
     * ДДобавление нового бронирования в базу данных
     */
    private function insertToDb(): void
    {
        $sql = "
            INSERT INTO `sdi_booking`
                (`date_start`, `date_finish`, `status`, `id_building`, `id_user`)
            VALUES
                (:dateStart, :dateFinish, :status, :buildingId, :userId)
        ";

        parent::query($sql);
        parent::bindParams('dateStart', $this->getDateStart());
        parent::bindParams('dateFinish', $this->getDateFinish());
        parent::bindParams('status', $this->getStatus());
        parent::bindParams('buildingId', $this->getBuildingId());
        parent::bindParams('userId', $this->getUserId());

        $item = parent::execute();

        if ($item) {
            $this->setId(parent::lastInsertedId());

            $building = BuildingModel::fetchBuildingById($this->getBuildingId());
            if ($building) {
                $this->setBuildingName($building['name']);
            }

            NotificationModel::createItem([
                'author' => $this->getUserId(),
                'name' => 'Бронирование',
                'description' => 'Новая заявка на бронь #' . $this->getId(),
                'type' => 'booking',
                'objectId' => $this->getId(),
                'objectType' => 'booking',
                'dateCreated' => date('Y-m-d H:i:s'),
                'active' => 1
            ], []);

            $params = [
                'building' => $this->getBuildingName(),
                'dateStart' => $this->getDateStart(),
                'dateFinish' => $this->getDateFinish()
            ];
            $mailModel = new MailModel($this->settings, $this->settings->get('smtp_email'), 'booking', $params);
            $mailModel->send();
        }
    }

    /**
     * Обновление бронирования в базе данных
     */
    private function updateToDb(): void
    {
        $sql = "
            UPDATE `sdi_booking`
            SET
                `date_start` = :dateStart,
                `date_finish` = :dateFinish,
                `status` = :status,
                `id_building` = :buildingId,
                `id_user` = :userId
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $this->getId());
        parent::bindParams('dateStart', $this->getDateStart());
        parent::bindParams('dateFinish', $this->getDateFinish());
        parent::bindParams('status', $this->getStatus());
        parent::bindParams('buildingId', $this->getBuildingId());
        parent::bindParams('userId', $this->getUserId());

        parent::execute();

        $building = BuildingModel::fetchBuildingById($this->getBuildingId());
        if ($building) {
            $this->setBuildingName($building['name']);
        }
    }

    /**
     * Преобразование выходящих данных в формат для frontend
     *
     * @param array $data Массив из базы данных
     * @return array
     */
    private static function formatData(array $data): array
    {
        return [
            'id' => (int)$data['id'],
            'dateStart' => $data['date_start'],
            'dateFinish' => $data['date_finish'],
            'status' => $data['status'],
            'buildingId' => (int)$data['id_building'],
            'buildingName' => $data['name_building'],
            'userId' => (int)$data['id_user']
        ];
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
    public function getDateStart(): string
    {
        return $this->dateStart;
    }

    /**
     * @param string $dateStart
     */
    public function setDateStart(string $dateStart): void
    {
        $this->dateStart = $dateStart;
    }

    /**
     * @return string
     */
    public function getDateFinish(): string
    {
        return $this->dateFinish;
    }

    /**
     * @param string $dateFinish
     */
    public function setDateFinish(string $dateFinish): void
    {
        $this->dateFinish = $dateFinish;
    }

    /**
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @param string $status
     */
    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    /**
     * @return int
     */
    public function getBuildingId(): int
    {
        return $this->buildingId;
    }

    /**
     * @param int $buildingId
     */
    public function setBuildingId(int $buildingId): void
    {
        $this->buildingId = $buildingId;
    }

    /**
     * @return string
     */
    public function getBuildingName(): string
    {
        return $this->buildingName;
    }

    /**
     * @param string $buildingName
     */
    public function setBuildingName(string $buildingName): void
    {
        $this->buildingName = $buildingName;
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
}