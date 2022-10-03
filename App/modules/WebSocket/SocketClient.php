<?php

namespace App\WebSocket;

use App\LogModel;
use App\Messenger\Message;
use Ratchet\Client;

define('WSS_URL', 'ws://127.0.0.1:8081');
//define('WSS_URL', 'wss://api.sochidominvest.ru:8081');

class SocketClient
{
    private Message $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Отправка сообщения в сокет
     */
    public function send(): void
    {
        Client\connect(WSS_URL)->then(function ($conn) {
            $conn->on('message', function ($msg) use ($conn) {
                $conn->close();
            });

            $conn->send($this->getMessage()->__toString());
        }, function ($e) {
            LogModel::error($e->getMessage());
        });
    }

    /**
     * @return \App\Messenger\Message
     */
    public function getMessage(): Message
    {
        return $this->message;
    }

    /**
     * @param \App\Messenger\Message $message
     */
    public function setMessage(Message $message): void
    {
        $this->message = $message;
    }
}