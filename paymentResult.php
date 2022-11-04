<?php
$response = file_get_contents('php://input');

if (!empty($response)) {
    $response = json_decode($response);

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
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($response));

    curl_exec($ch);
    curl_close($ch);
}

echo 'OK';