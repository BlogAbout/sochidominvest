<?php

namespace App\Notification;

use App\User\UserExternalService;
use App\UserModel;

class SmsService extends NotificationService
{
    private Notification $notification;
    private int $recipientId;
    private string $recipientPhone;
    private bool $recipientIsExternal;
    private string $typeApiService;
    private string $apiHost;
    private string $apiLogin;
    private string $apiPassword;
    private bool $serviceEnable;

    /**
     * MailService constructor.
     *
     * @param Notification $notification Объект уведомления
     * @param int $recipientId Идентификатор пользователя (получателя)
     * @param bool $recipientIsExternal Внешний пользователь или нет
     */
    public function __construct($settings, Notification $notification, int $recipientId, bool $recipientIsExternal = false)
    {
        parent::__construct($settings);

        $this->notification = $notification;
        $this->recipientId = $recipientId;
        $this->recipientIsExternal = $recipientIsExternal;

        $this->setServiceEnable($this->settings->get('sms_enable') === '1');
        $this->setTypeApiService($this->settings->get('sms_service'));
        $this->setApiHost($this->settings->get('sms_address'));
        $this->setApiLogin($this->settings->get('sms_login'));
        $this->setApiPassword($this->settings->get('sms_password'));
    }

    /**
     * Отправка уведомления получателю
     */
    private function send(): void
    {
        if (!$this->isServiceEnable() || !$this->getApiHost() || !$this->getApiLogin() || !$this->getApiPassword()) {
            return;
        }

        if ($this->isRecipientIsExternal()) {
            $recipient = UserExternalService::fetchItemById($this->getRecipientId());
            $this->setRecipientPhone(preg_replace('/\D/', '', $recipient->getPhone()));
        } else {
            $recipient = UserModel::fetchUserById($this->getRecipientId());
            $this->setRecipientPhone(preg_replace('/\D/', '', $recipient['phone']));
        }
    }

    /**
     * Определение сервиса, через который отправлять СМС
     */
    private function sendSms(): void
    {
        switch ($this->getTypeApiService()) {
            case 'mts':
                $this->sendByMts();
                break;
        }
    }

    /**
     * Отправка СМС через МТС
     */
    private function sendByMts(): void
    {
        $auth = 'Basic ' . base64_encode($this->getApiLogin() . ':' . $this->getApiPassword());

        $req = [
            'messages' => [
                [
                    'content' => [
                        'short_text' => $this->getNotification()->getDescription()
                    ],
                    'to' => [
                        [
                            'msisdn' => $this->getRecipientPhone()
                        ]
                    ]
                ]
            ],
            'options' => [
                'class' => 1,
                'from' => [
                    'sms_address' => 'СОЧИДОМИНВЕСТ'
                ]
            ]
        ];

        $respStr = $this->curlRequest('messages', $auth, json_encode($req), [], 'POST');

        $resp = json_decode($respStr, true);

        if (isset($resp["code"])) {
            var_dump($respStr);
            return;
        }


        if (!isset($resp['messages'][0]['internal_id'])) {
            var_dump($respStr);
            return;
        }

        var_dump('successes response:', $respStr);
    }

    private function curlRequest(string $url = '', string $auth = '', $data = null, $headers = null, string $method = 'GET')
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->getApiHost() . $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);

        if (!empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }

        $headers = array_merge($headers, ['Authorization: ' . $auth, 'Content-Type: application/json; charset=utf-8']);

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        $response = curl_exec($ch);

        if (curl_error($ch)) {
            trigger_error('Curl Error:' . curl_error($ch));
        }

        curl_close($ch);

        return $response;
    }

    /**
     * @return \App\Notification\Notification
     */
    public function getNotification(): Notification
    {
        return $this->notification;
    }

    /**
     * @param \App\Notification\Notification $notification
     */
    public function setNotification(Notification $notification): void
    {
        $this->notification = $notification;
    }

    /**
     * @return int
     */
    public function getRecipientId(): int
    {
        return $this->recipientId;
    }

    /**
     * @param int $recipientId
     */
    public function setRecipientId(int $recipientId): void
    {
        $this->recipientId = $recipientId;
    }

    /**
     * @return string
     */
    public function getRecipientPhone(): string
    {
        return $this->recipientPhone;
    }

    /**
     * @param string $recipientPhone
     */
    public function setRecipientPhone(string $recipientPhone): void
    {
        $this->recipientPhone = $recipientPhone;
    }

    /**
     * @return bool
     */
    public function isRecipientIsExternal(): bool
    {
        return $this->recipientIsExternal;
    }

    /**
     * @param bool $recipientIsExternal
     */
    public function setRecipientIsExternal(bool $recipientIsExternal): void
    {
        $this->recipientIsExternal = $recipientIsExternal;
    }

    /**
     * @return string
     */
    public function getTypeApiService(): string
    {
        return $this->typeApiService;
    }

    /**
     * @param string $typeApiService
     */
    public function setTypeApiService(string $typeApiService): void
    {
        $this->typeApiService = $typeApiService;
    }

    /**
     * @return string
     */
    public function getApiHost(): string
    {
        return $this->apiHost;
    }

    /**
     * @param string $apiHost
     */
    public function setApiHost(string $apiHost): void
    {
        $this->apiHost = $apiHost;
    }

    /**
     * @return string
     */
    public function getApiLogin(): string
    {
        return $this->apiLogin;
    }

    /**
     * @param string $apiLogin
     */
    public function setApiLogin(string $apiLogin): void
    {
        $this->apiLogin = $apiLogin;
    }

    /**
     * @return string
     */
    public function getApiPassword(): string
    {
        return $this->apiPassword;
    }

    /**
     * @param string $apiPassword
     */
    public function setApiPassword(string $apiPassword): void
    {
        $this->apiPassword = $apiPassword;
    }

    /**
     * @return bool
     */
    public function isServiceEnable(): bool
    {
        return $this->serviceEnable;
    }

    /**
     * @param bool $serviceEnable
     */
    public function setServiceEnable(bool $serviceEnable): void
    {
        $this->serviceEnable = $serviceEnable;
    }
}