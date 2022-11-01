<?php

namespace App\WebSocket;

use App\LogModel;
use App\Messenger\Message;
use Ratchet\Client;
use React\EventLoop\Loop;
use React\Socket\Connector;

define('WSS_URL', 'wss://api.sochidominvest.ru:8081');

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
        $secureContext = array(
            'local_cert' => __DIR__ . '/../../../crt/cert.pem',
            'local_pk' => __DIR__ . '/../../../crt/privkey.pem',
            'allow_self_signed' => true,
            'verify_peer' => false
        );

        $reactConnector = new Connector([
            'dns' => '8.8.8.8',
            'timeout' => 10,
            'tls' => $secureContext
        ]);
        $loop = Loop::get();
        $connector = new Client\Connector($loop, $reactConnector);

        $connector(WSS_URL)->then(function ($conn) {
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