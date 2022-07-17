<?php

namespace App;

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

        $message = new MessageModel(json_decode($msg, true));

        switch ($message->getType()) {
            case 'welcome':
                $this->setConnectionInfo($from, $message);
                $this->notifyAllOfOnlineUsers();
                break;
            case 'notification':
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
     * @param \App\MessageModel $message
     */
    private function setConnectionInfo(ConnectionInterface $connection, MessageModel $message)
    {
        $this->clientsInfo[$connection->resourceId] = $message->getAuthorId();
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
     * @param \App\MessageModel $message Объект отправляемого сообщения
     */
    private function sendMessage(ConnectionInterface $from, MessageModel $message)
    {
        $attendees = $message->getAttendees();
        $sendAll = is_array($attendees) && count($attendees) > 0;

        foreach ($this->clients as $client) {
            if ($from === $client) {
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
            'type' => 'notification',
            'text' => json_encode(array_values($this->clientsInfo))
        ];

        $message = new MessageModel($dataMessage);

        $this->sendMessage(null, $message);
    }
}