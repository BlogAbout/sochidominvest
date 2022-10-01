<?php
$response1 = file_get_contents('php://input');

file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/logs.txt', '$response1: ' . json_encode($response1) . PHP_EOL, FILE_APPEND);

if (!empty($response1)) {
    $response2 = json_decode($response1);
    file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/logs.txt', '$response2: ' . json_encode($response2) . PHP_EOL, FILE_APPEND);

    $url = 'https://api.sochidominvest.ru/api/v1/paymentResult';
    $headers = array(
        'Content-Type: application/json'
    );

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($response2));

    curl_exec($ch);
    curl_close($ch);
}

echo 'OK';