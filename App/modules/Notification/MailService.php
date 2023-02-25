<?php

namespace App\Notification;

use App\LogModel;
use App\User\UserExternalService;
use App\UserModel;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class MailService extends NotificationService
{
    private Notification $notification;
    private int $recipientId;
    private string $recipientEmail;
    private bool $recipientIsExternal;

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
    }

    /**
     * Отправка уведомления получателю
     */
    private function send(): void
    {
        $isSmtp = $this->settings->get('smtp_enable');

        if ($this->isRecipientIsExternal()) {
            $recipient = UserExternalService::fetchItemById($this->getRecipientId());
            $this->setRecipientEmail($recipient->getEmail());
        } else {
            $recipient = UserModel::fetchUserById($this->getRecipientId());
            $this->setRecipientEmail($recipient['email']);
        }

        if ($isSmtp === '1') {
            $this->sendSmtp();
        } else {
            $this->sendDefault();
        }
    }

    /**
     * Генерация копирайта для тела сообщения
     *
     * @return string
     */
    private function getCopyrightContent(): string
    {
        return '
            <p>&nbsp;</p>
            <p><strong>С уважением, администрация сервиса СОЧИДОМИНВЕСТ</strong></p>
        ';
    }

    /**
     * Генерация информации для тела сообщения
     *
     * @return string
     */
    private function getInformationContent(): string
    {
        return '
            <hr />
            <p><small><i>Это письмо носит информационный характер, отвечать на него не нужно!</i></small></p>
        ';
    }

    /**
     * Отправка письма через стандартную функцию без SMTP
     *
     * @return bool
     */
    public function sendDefault(): bool
    {
        if (!$this->getRecipientEmail()) {
            return false;
        }

        return mail($this->getRecipientEmail(), $this->getNotification()->getName(), $this->getNotification()->getDescription());
    }

    /**
     * Отправка письма через SMTP
     *
     * @return bool
     */
    public function sendSmtp(): bool
    {
        if (!$this->getRecipientEmail()) {
            return false;
        }

        $mail = new PHPMailer(true);

        $smtpFrom = $this->settings->get('smtp_email');
        $smtpHost = $this->settings->get('smtp_host');
        $smtpLogin = $this->settings->get('smtp_login');
        $smtpPassword = $this->settings->get('smtp_password');
        $smtpSslEnable = $this->settings->get('smtp_ssl');

        try {
            $mail->CharSet = 'UTF-8';
            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpLogin;
            $mail->Password = $smtpPassword;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = $smtpSslEnable === '1' ? 465 : 25;

            $mail->setFrom($smtpFrom);
            $mail->addAddress($this->getRecipientEmail());

            $mail->isHTML(true);
            $mail->Subject = $this->getNotification()->getName();
            $mail->Body = $this->getNotification()->getDescription();

            $mail->send();

            return true;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            return false;
        }
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
    public function getRecipientEmail(): string
    {
        return $this->recipientEmail;
    }

    /**
     * @param string $recipientEmail
     */
    public function setRecipientEmail(string $recipientEmail): void
    {
        $this->recipientEmail = $recipientEmail;
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
}