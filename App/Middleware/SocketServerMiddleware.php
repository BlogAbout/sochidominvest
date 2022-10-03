<?php

use App\MessengerMiddleware;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Factory;
use React\Socket\SecureServer;

require __DIR__ . '/../../vendor/autoload.php';

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MessengerMiddleware()
        )
    ),
    8081
);

$server->run();
//
//$loop = Factory::create();
//$webSock = new React\Socket\Server('0.0.0.0:8081', $loop);
//$webSock = new SecureServer($webSock, $loop, [
//    'local_cert' => __DIR__ . '/../../crt/cert.pem',
//    'local_pk' => __DIR__ . '/../../crt/privkey.pem',
//    'allow_self_signed' => true,
//    'verify_peer' => false
//]);
//
//$webServer = new IoServer(
//    new HttpServer(
//        new WsServer(
//            new MessengerMiddleware()
//        )
//    ),
//    $webSock,
//    $loop
//);
//
//$webServer->run();