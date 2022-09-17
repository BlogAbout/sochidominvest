<?php

namespace App\BusinessProcess;

use App\Model;
use App\UtilModel;

class BusinessProcess extends Model
{
    public int $id;
    public int $ticketId;
    public int $author;
    public int $responsible;
    public int $active;
    public string $type;
    public string $step;
    public string $name;
    public string $description;
    public string $dateCreated;
    public string $dateUpdate;
    public array $relations;
    public array $attendees;

    public function __construct(array $data = [])
    {
        parent::__construct();

        $this->id = $data['id'] ?? 0;
        $this->ticketId = $data['ticketId'] ?? 0;
        $this->author = $data['author'] ?? 0;
        $this->responsible = $data['responsible'] ?? 0;
        $this->active = $data['active'] ?? 0;
        $this->type = $data['type'] ?? '';
        $this->step = $data['step'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->dateCreated = $data['dateCreated'] ?? '';
        $this->dateUpdate = $data['dateUpdate'] ?? '';
        $this->relations = $data['relations'] ?? [];
        $this->attendees = $data['attendees'] ?? [];
    }

    /**
     * Получение данных бизнес-процесса по идентификатору
     *
     * @param int $businessProcessId Идентификатор бизнес-процесса
     * @return \App\BusinessProcess\BusinessProcess
     */
    public static function fetchItem(int $businessProcessId): BusinessProcess
    {
        $sql = "
            SELECT sdi.*,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bpa.`id_user`))
                       FROM `sdi_business_process_attendee` AS bpa
                       WHERE bpa.`id_business_process` = sdi.`id`
                   ) AS attendees
            FROM `sdi_business_process` sdi
            WHERE sdi.`id` = :businessProcessId
        ";

        parent::query($sql);
        parent::bindParams('businessProcessId', $businessProcessId);
        $item = parent::fetch();

        if (!empty($item)) {
            $businessProcess = new BusinessProcess(self::formatData($item));
            $businessProcess->fetchRelations();

            return $businessProcess;
        }

        // Fixme
        return [];
    }

    /**
     * Получение данных бизнес-процессов на основе параметров фильтра
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $resultList = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.*,
                   (
                       SELECT GROUP_CONCAT(DISTINCT(bpa.`id_user`))
                       FROM `sdi_business_process_attendee` AS bpa
                       WHERE bpa.`id_business_process` = sdi.`id`
                   ) AS attendees
            FROM `sdi_business_process` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                $businessProcess = new BusinessProcess(self::formatData($item));
                $businessProcess->fetchRelations();

                array_push($resultList, $businessProcess);
            }
        }

        return $resultList;
    }

    /**
     * Удаление бизнес-процесса по идентификатору (меняет статус активности)
     *
     * @param int $id Идентификатор бизнес-процесса
     * @return bool
     */
    public static function deleteItem(int $id): bool
    {
        $sql = "UPDATE `sdi_business_process` SET `active` = -1 WHERE `id` = :id";

        parent::query($sql);
        parent::bindParams('id', $id);

        return parent::execute();
    }

    public static function fetchOrdering(int $userId): array
    {
        $sql = "
            SELECT *
            FROM `sdi_business_process_sorting`
            WHERE `id_user` = :userId
        ";

        parent::query($sql);
        parent::bindParams('userId', $userId);
        $item = parent::fetch();

        if (!empty($item)) {
            if ($item['sorting'] !== '') {
                return json_decode($item['sorting']);
            } else {
                return [];
            }
        }

        return [];
    }

    /**
     * Обновление сортировки бизнес-процессов для пользователя
     *
     * @param array $bpIds
     * @param int $userId
     */
    public static function updateOrdering(array $bpIds, int $userId): void
    {
        $sql = "
            INSERT INTO `sdi_business_process_sorting` (`id_user`, `sorting`)
            VALUES (:userId, :sorting)
            ON DUPLICATE KEY
            UPDATE `sorting` = :sorting
        ";

        self::query($sql);
        self::bindParams('userId', $userId);
        self::bindParams('sorting', json_encode($bpIds));
        self::execute();
    }

    /**
     * Сохранение информации о бизнес-процессе
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
     * Добавление нового бизнес-процесса в базу данных
     */
    private function insertToDb(): void
    {
        $dateNow = UtilModel::getDateNow();
        $this->setDateCreated($dateNow);
        $this->setDateUpdate($dateNow);

        $sql = "
            INSERT INTO `sdi_business_process`
                (`id_ticket`, `author`, `responsible`, `active`, `type`, `step`, `name`, `description`, `date_created`, `date_update`)
            VALUES
                (:ticketId, :author, :responsible, :active, :type, :step, :name, :description, :dateCreated, :dateUpdate)
        ";

        parent::query($sql);
        parent::bindParams('ticketId', $this->getTicketId());
        parent::bindParams('author', $this->getAuthor());
        parent::bindParams('responsible', $this->getResponsible());
        parent::bindParams('active', $this->getActive());
        parent::bindParams('type', $this->getType());
        parent::bindParams('step', $this->getStep());
        parent::bindParams('name', $this->getName());
        parent::bindParams('description', $this->getDescription());
        parent::bindParams('dateCreated', $this->getDateCreated());
        parent::bindParams('dateUpdate', $this->getDateUpdate());

        $item = parent::execute();

        if ($item) {
            $this->setId(parent::lastInsertedId());
            $this->insertRelationsToDb();
            $this->insertAttendeesToDb();
        }
    }

    /**
     * Обновление бизнес-процесса в базе данных
     */
    private function updateToDb(): void
    {
        $dateNow = UtilModel::getDateNow();
        $this->setDateUpdate($dateNow);

        $sql = "
            UPDATE `sdi_business_process`
            SET
                `id_ticket` = :ticketId,
                `responsible` = :responsible,
                `active` = :active,
                `type` = :type,
                `step` = :step,
                `name` = :name,
                `description` = :description,
                `date_update` = :dateUpdate
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $this->getId());
        parent::bindParams('ticketId', $this->getTicketId());
        parent::bindParams('responsible', $this->getResponsible());
        parent::bindParams('active', $this->getActive());
        parent::bindParams('type', $this->getType());
        parent::bindParams('step', $this->getStep());
        parent::bindParams('name', $this->getName());
        parent::bindParams('description', $this->getDescription());
        parent::bindParams('dateUpdate', $this->getDateUpdate());

        parent::execute();

        $this->insertRelationsToDb();
        $this->insertAttendeesToDb();
    }

    /**
     * Добавление участников бизнес-процессу в базу данных
     */
    private function insertAttendeesToDb(): void
    {
        $this->dropAttendeesFromDb();

        if (count($this->attendees)) {

            $attendeesSql = [];

            foreach ($this->attendees as $attendee) {
                array_push($attendeesSql, "($this->id, $attendee)");
            }

            $sql = "
                INSERT INTO `sdi_business_process_attendee`
                    (`id_business_process`, `id_user`)
                VALUES
            " . implode(',', $attendeesSql);

            self::query($sql);
            self::execute();
        }
    }

    /**
     * Удаление участников бизнес-процесса из базы данных
     */
    private function dropAttendeesFromDb(): void
    {
        $sql = "
            DELETE FROM `sdi_business_process_attendee`
            WHERE `id_business_process` = :businessProcessId
        ";

        self::query($sql);
        self::bindParams('businessProcessId', $this->getId());
        self::execute();
    }

    /**
     * Добавление связей бизнес-процессу в базу данных
     */
    private function insertRelationsToDb(): void
    {
        $this->dropRelationsFromDb();

        if (count($this->relations)) {
            $relationsSql = [];

            foreach ($this->relations as $relation) {
                array_push($relationsSql, "($this->id, $relation->objectId, '$relation->objectType')");
            }

            $sql = "
                INSERT INTO `sdi_business_process_relation`
                    (`id_business_process`, `id_object`, `type_object`)
                VALUES
            " . implode(',', $relationsSql);

            self::query($sql);
            self::execute();
        }
    }

    /**
     * Удаление связей бизнес-процесса из базы данных
     */
    private function dropRelationsFromDb(): void
    {
        $sql = "
            DELETE FROM `sdi_business_process_relation`
            WHERE `id_business_process` = :businessProcessId
        ";

        self::query($sql);
        self::bindParams('businessProcessId', $this->getId());
        self::execute();
    }

    /**
     * Получение данных о связях бизнес-процесса с другими объектами сервиса
     */
    private function fetchRelations()
    {
        $relations = [];

        $sql = "
            SELECT sdi.*
            FROM sdi_business_process_relation sdi
            WHERE sdi.`id_business_process` = :businessProcessId
        ";

        parent::query($sql);
        parent::bindParams('businessProcessId', $this->getId());

        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                array_push($relations, [
                    'objectId' => (int)$item['id_object'],
                    'objectType' => $item['type_object']
                ]);
            }
        }

        $this->setRelations($relations);
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
            'ticketId' => (int)$data['id_ticket'],
            'author' => (int)$data['author'],
            'responsible' => (int)$data['responsible'],
            'active' => (int)$data['active'],
            'type' => $data['type'],
            'step' => $data['step'],
            'name' => $data['name'],
            'description' => $data['description'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'relations' => $data['relations'] ?? [],
            'attendees' => array_map('intval', $data['attendees'] ? explode(',', $data['attendees']) : []),
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
     * @return int
     */
    public function getTicketId(): int
    {
        return $this->ticketId;
    }

    /**
     * @param int $ticketId
     */
    public function setTicketId(int $ticketId): void
    {
        $this->ticketId = $ticketId;
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
     * @return int
     */
    public function getResponsible(): int
    {
        return $this->responsible;
    }

    /**
     * @param int $responsible
     */
    public function setResponsible(int $responsible): void
    {
        $this->responsible = $responsible;
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
    public function getStep(): string
    {
        return $this->step;
    }

    /**
     * @param string $step
     */
    public function setStep(string $step): void
    {
        $this->step = $step;
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
     * @return array
     */
    public function getRelations(): array
    {
        return $this->relations;
    }

    /**
     * @param array $relations
     */
    public function setRelations(array $relations): void
    {
        $this->relations = $relations;
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
}