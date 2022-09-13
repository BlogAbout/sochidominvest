<?php

namespace App\Payment;

use App\Model;
use App\UserModel;
use App\UtilModel;

class Payment extends Model
{
    public int $id;
    public string $name;
    public string $dateCreated;
    public string $dateUpdate;
    public string $status;
    public int $userId;
    public string $userEmail;
    public string $userName;
    public string $companyEmail;
    public float $cost;
    public string $tariff;

    private TinkoffMerchantAPI $api;
    private string $apiUrl = 'https://task.masbook.pro/api/v2/paymentSuccess';
    private string $apiLogin = '1662393169438DEMO';
    private string $apiKey = 'v5eokhwod2a3whvk';

    public function __construct(array $data = [], $settings = null)
    {
        parent::__construct($settings);

        $this->id = $data['id'] ?: 0;
        $this->name = $data['name'] ?: '';
        $this->dateCreated = $data['dateCreated'] ?: '';
        $this->dateUpdate = $data['dateUpdate'] ?: '';
        $this->status = $data['status'] ?: 'pending';
        $this->userId = $data['userId'] ?: 0;
        $this->userEmail = $data['userEmail'] ?: '';
        $this->userName = $data['userName'] ?: '';
        $this->companyEmail = $data['companyEmail'] ?: '';
        $this->cost = $data['cost'] ?: 0;
        $this->tariff = $data['tariff'] ?: '';

        $this->api = new TinkoffMerchantAPI($this->getApiLogin(), $this->getApiKey());
    }

    /**
     * Получение данных транзакции по идентификатору
     *
     * @param int $paymentId Идентификатор транзакции
     * @return \App\Payment\Payment
     */
    public static function fetchItem(int $paymentId): Payment
    {
        $sql = "
            SELECT sdi.*
            FROM `sdi_transaction` sdi
            WHERE sdi.`id` = :paymentId
        ";

        parent::query($sql);
        parent::bindParams('paymentId', $paymentId);
        $item = parent::fetch();

        if (!empty($item)) {
            $payment = new Payment(self::formatData($item));

            $user = UserModel::fetchUserById($payment->getUserId());
            if ($user) {
                $payment->setUserName($user['firstName']);
                $payment->setUserEmail($user['email']);
            }

            return $payment;
        }

        // Fixme
        return [];
    }

    /**
     * Получение данных транзакций на основе параметров фильтра
     *
     * @param array $filter Массив параметров фильтрации
     * @return array
     */
    public static function fetchList(array $filter): array
    {
        $resultList = [];
        $sqlWhere = parent::generateFilterQuery($filter);

        $sql = "
            SELECT sdi.*
            FROM `sdi_transaction` sdi
            $sqlWhere
            ORDER BY sdi.`id` ASC
        ";

        parent::query($sql);
        $list = parent::fetchAll();

        if (!empty($list)) {
            foreach ($list as $item) {
                $payment = new Payment(self::formatData($item));

                array_push($resultList, $payment);
            }
        }

        return $resultList;
    }

    /**
     * Сохранение транзакции
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
     * Создание транзакции в базе данных
     */
    private function insertToDb(): void
    {
        $dateNow = UtilModel::getDateNow();
        $this->setDateCreated($dateNow);
        $this->setDateUpdate($dateNow);

        $user = UserModel::fetchUserById($this->getUserId());
        if ($user) {
            $this->setUserEmail($user['email']);
            $this->setUserName($user['firstName']);
        }

        $sql = "
            INSERT INTO `sdi_transaction`
                (`name`, `date_created`, `date_update`, `status`, `id_user`, `email`, `cost`, `tariff`)
            VALUES
                (:name, :dateCreated, :dateUpdate, :status, :userId, :userEmail, :cost, :tariff)
        ";

        parent::query($sql);
        parent::bindParams('name', $this->getName());
        parent::bindParams('dateCreated', $this->getDateCreated());
        parent::bindParams('dateUpdate', $this->getDateUpdate());
        parent::bindParams('status', $this->getStatus());
        parent::bindParams('userId', $this->getUserId());
        parent::bindParams('userEmail', $this->getUserEmail());
        parent::bindParams('cost', $this->getCost());
        parent::bindParams('tariff', $this->getTariff());

        $item = parent::execute();

        if ($item) {
            $this->setId(parent::lastInsertedId());
        }
    }

    /**
     * Обновление транзакции в базе данных
     */
    private function updateToDb(): void
    {
        $dateNow = UtilModel::getDateNow();
        $this->setDateUpdate($dateNow);

        $sql = "
            UPDATE `sdi_transaction`
            SET
                `date_update` = :dateUpdate,
                `status` = :status
            WHERE `id` = :id
        ";

        parent::query($sql);
        parent::bindParams('id', $this->getId());
        parent::bindParams('dateUpdate', $this->getDateUpdate());
        parent::bindParams('status', $this->getStatus());

        parent::execute();
    }

    /**
     * Инициализация платежа
     *
     * @throws \HttpException
     */
    public function createPay()
    {
        $params = [
            'OrderId' => $this->getId(),
            'Amount' => $this->getCost() * 100,
            'DATA' => [
                'name' => $this->getName(),
                'user' => $this->getUserId()
            ],
            'Receipt' => $this->getReceipt(),
            'NotificationURL' => $this->getApiUrl()
        ];

        $this->api->init($params);

        if ($this->api->error) {
            return [
                'status' => false,
                'data' => $this->api->error
            ];
        } else {
            return [
                'status' => true,
                'data' => $this->api->paymentUrl
            ];
        }
    }

    /**
     * Создание массива данных для чека
     *
     * @return array
     */
    private function getReceipt(): array
    {
        $receiptItem = [
            [
                'Name' => $this->getName(),
                'Price' => $this->getCost() * 100,
                'Quantity' => 1,
                'Amount' => $this->getCost() * 100,
                'PaymentMethod' => $this->api->getPaymentMethod('full_prepayment'),
                'PaymentObject' => $this->api->getPaymentObject('service'),
                'Tax' => $this->api->getVat('none')
            ]
        ];

        return [
            'EmailCompany' => $this->getCompanyEmail(),
            'Email' => $this->getUserEmail(),
            'Taxation' => $this->api->getTaxation('usn_income_outcome'),
            'Items' => $this->balanceAmount($receiptItem, $this->getCost() * 100)
        ];
    }

    private function balanceAmount($items, $amount): array
    {
        $sum = 0;

        foreach ($items as $item) {
            $sum += $item['Amount'];
        }

        if ($sum != $amount) {
            $sumAmountNew = 0;
            $difference = $amount - $sum;
            $amountNew = [];

            foreach ($items as $key => $item) {
                $itemsAmountNew = $item['Amount'] + floor($difference * $item['Amount'] / $sum);
                $amountNew[$key] = $itemsAmountNew;
                $sumAmountNew += $itemsAmountNew;
            }

            if ($sumAmountNew != $amount) {
                $maxKey = array_keys($amountNew, max($amountNew))[0]; // ключ макс значения
                $amountNew[$maxKey] = max($amountNew) + ($amount - $sumAmountNew);
            }

            foreach ($amountNew as $key => $item) {
                $items[$key]['Amount'] = $item;
            }
        }

        return $items;
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
            'name' => $data['date_start'],
            'dateCreated' => $data['date_created'],
            'dateUpdate' => $data['date_update'],
            'status' => $data['status'],
            'userId' => (int)$data['id_user'],
            'userEmail' => $data['email'],
            'cost' => (float)$data['cost'],
            'tariff' => $data['tariff']
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
    public function getUserEmail(): string
    {
        return $this->userEmail;
    }

    /**
     * @param string $userEmail
     */
    public function setUserEmail(string $userEmail): void
    {
        $this->userEmail = $userEmail;
    }

    /**
     * @return string
     */
    public function getUserName(): string
    {
        return $this->userName;
    }

    /**
     * @param string $userName
     */
    public function setUserName(string $userName): void
    {
        $this->userName = $userName;
    }

    /**
     * @return string
     */
    public function getCompanyEmail(): string
    {
        return $this->companyEmail;
    }

    /**
     * @param string $companyEmail
     */
    public function setCompanyEmail(string $companyEmail): void
    {
        $this->companyEmail = $companyEmail;
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
     * @return string
     */
    public function getTariff(): string
    {
        return $this->tariff;
    }

    /**
     * @param string $tariff
     */
    public function setTariff(string $tariff): void
    {
        $this->tariff = $tariff;
    }

    /**
     * @return string
     */
    public function getApiUrl(): string
    {
        return $this->apiUrl;
    }

    /**
     * @return string
     */
    public function getApiLogin(): string
    {
        return $this->apiLogin;
    }

    /**
     * @return string
     */
    public function getApiKey(): string
    {
        return $this->apiKey;
    }
}