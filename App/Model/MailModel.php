<?php

namespace App;

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require 'vendor/autoload.php';

/**
 * MailModel. Содержит методы взаимодействия с почтовыми отправлениями
 */
class MailModel extends Model
{
    protected $mailTo = '';
    protected $type = '';
    protected $params = [];

    /**
     * Инициализация MailModel
     *
     * @param string $mailTo E-mail получателя
     * @param string $type Тип сообщения
     * @param array $params Массив дополнительных параметров
     */
    public function __construct(SettingMiddleware $settings, string $mailTo, string $type, array $params = [])
    {
        parent::__construct($settings);

        $this->mailTo = $mailTo;
        $this->type = $type;
        $this->params = $params;
    }

    /**
     * Генерация содержимого сообщения
     *
     * @return string
     */
    public function generateMessageTemplate(): string
    {
        $copyright = '
            <p>&nbsp;</p>
            <p><strong>С уважением, администрация сервиса СОЧИДОМИНВЕСТ</strong></p>
        ';

        $info = '
            <hr />
            <p><small><i>Это письмо носит информационный характер, отвечать на него не нужно!</i></small></p>
        ';

        switch ($this->type) {
            case 'forgot':
                return '
                    <p>Здравствуйте!</p>
                    <p>Кто-то запросил восстановление пароля для аккаунта в сервисе СОЧИДОМИНВЕСТ.</p>
                    <p>Для завершения процесса восстановления пароля укажите проверочный код:</p>
                    <h3>' . $this->params['code'] . '</h3>
                    <p>Если Вы этого не делали, просто проигнорируйте это письмо.</p>
                    ' . $copyright . $info;
            case 'registration':
                return '
                    <p>Здравствуйте!</p>
                    <p>Вы произвели регистрацию в сервисе СОЧИДОМИНВЕСТ.</p>
                    <p>Ваши данные для входа:<br />Логин: ' . $this->params['login'] . '<br />Пароль: ' . $this->params['password'] . '</p>
                    ' . $copyright . $info;
            case 'feed':
                return '
                    <p>В сервисе СОЧИДОМИНВЕСТ появилось новое обращение в техническую поддержку.</p>
                    <p>Тема: <strong>' . $this->params['message'] . '</strong></p>
                    <p>Пожалуйста, проверьте заявки и свяжитесь с клиентом! (в будущем здесь будет ссылка)</p>
                ' . $info;
            case 'booking':
                return '
                    <p>В сервисе СОЧИДОМИНВЕСТ зарегистрирована новая бронь.</p>
                    <p>Объект недвижимости: <strong>' . $this->params['building'] . '</strong></p>
                    <p>Дата заезда: <strong>' . $this->params['dateStart'] . '</strong></p>
                    <p>Дата выезда: <strong>' . $this->params['dateFinish'] . '</strong></p>
                    <p>Пожалуйста, проверьте заявки и свяжитесь с клиентом! (в будущем здесь будет ссылка)</p>
                ' . $info;
            default:
                return '';
        }
    }

    public function generateSubject() {
        switch ($this->type) {
            case 'forgot':
                return 'Восстановление пароля';
            case 'registration':
                return 'Завершение регистрации';
            case 'feed':
                return 'Заявка в техническую поддержку';
            case 'booking':
                return 'Новая бронь';
            default:
                return 'Без темы';
        }
    }

    /**
     * Отправка сообщения на почту
     *
     * @return bool
     */
    public function send(): bool
    {
        $isSmtp = $this->settings->get('smtp_enable');

        $subject = $this->generateSubject();
        $message = $this->generateMessageTemplate();

        if ($isSmtp === '1') {
            return $this->sendSmtp($subject, $message);
        } else {
            return $this->sendDefault($subject, $message);
        }
    }

    public function sendDefault(string $subject, string $message): bool
    {
        return mail($this->mailTo, $subject, $message);
    }

    public function sendSmtp(string $subject, string $message): bool
    {
        $mail = new PHPMailer(true);

        $smtpFrom = $this->params && $this->params['mailFrom'] ? $this->params['mailFrom'] : $this->settings->get('smtp_email');
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
            $mail->addAddress($this->mailTo);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $message;

            $mail->send();

            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}