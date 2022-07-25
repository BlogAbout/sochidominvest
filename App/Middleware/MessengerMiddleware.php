<?php

namespace App;

//ini_set('error_reporting', E_ALL);
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);

use App\Messenger\Message;
use App\Messenger\Messenger;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

class MessengerMiddleware implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;
    protected array $clientsInfo;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->clientsInfo = [];
    }

    /**
     * Добавление соединения в массив при подключении
     *
     * @param \Ratchet\ConnectionInterface $conn
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        $this->clientsInfo[$conn->resourceId] = null;
    }

    /**
     * Отправка сообщения
     *
     * @param \Ratchet\ConnectionInterface $from
     * @param $msg
     */
    public function onMessage(ConnectionInterface $from, $msg)
    {
        if (!$msg) {
            return;
        }

        $message = new Message(json_decode($msg, true));

        switch ($message->getType()) {
            case 'welcome':
                $this->setConnectionInfo($from, $message);
                $this->notifyAllOfOnlineUsers();
                break;
            case 'online':
                $this->notifyAllOfOnlineUsers();
                break;
            case 'notification':
                $this->sendMessage($from, $message);
                break;
            case 'read':
                Messenger::read($message);
                $this->sendMessage($from, $message);
                break;
            case 'message':
                $message->save();
                $this->sendMessage($from, $message);
                break;
        }
    }

    /**
     * Удаление соединения из массива при отключении
     *
     * @param \Ratchet\ConnectionInterface $conn
     */
    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);

        if (!empty($this->clientsInfo[$conn->resourceId])) {
            unset($this->clientsInfo[$conn->resourceId]);
            $this->notifyAllOfOnlineUsers();
        }
    }

    /**
     * @param \Ratchet\ConnectionInterface $conn
     * @param \Exception $e
     */
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $conn->close();
    }

    /**
     * Установка дополнительной информации для подключения
     *
     * @param \Ratchet\ConnectionInterface $connection
     * @param \App\Messenger\Message $message
     */
    private function setConnectionInfo(ConnectionInterface $connection, Message $message)
    {
        $this->clientsInfo[$connection->resourceId] = $message->getAuthor();
    }

    /**
     * Получение идентификатора пользователя выбранного подключения
     *
     * @param $connection
     * @return int
     */
    private function getConnectionUserId($connection): int
    {
        return $this->clientsInfo[$connection->resourceId];
    }

    /**
     * Отправка сообщений по списку подключений
     *
     * @param \Ratchet\ConnectionInterface $from Подключение, от кого отправлено
     * @param \App\Messenger\Message $message Объект отправляемого сообщения
     */
    private function sendMessage(ConnectionInterface $from, Message $message)
    {
        $attendees = $message->getAttendees();
        $sendAll = is_array($attendees) && count($attendees) > 0;

        foreach ($this->clients as $client) {
            if (!$sendAll && $from === $client) {
                continue;
            }

            if ($sendAll || in_array($this->getConnectionUserId($client), $attendees)) {
                $client->send($message->__toString());
            }
        }
    }

    /**
     * Уведомление всех пользователей о списке пользователей онлайн
     */
    private function notifyAllOfOnlineUsers()
    {
        $dataMessage = [
            'type' => 'online',
            'text' => json_encode(array_values($this->clientsInfo))
        ];

        $message = new Message($dataMessage);

        foreach ($this->clients as $client) {
            $client->send($message->__toString());
        }
    }
}