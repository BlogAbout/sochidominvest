<?php
$response = file_get_contents('php://input');

file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/logs.txt', '$response1: ' . json_encode($response) . PHP_EOL, FILE_APPEND);

if (!empty($response)) {
    $response = json_decode($response);
    file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/logs.txt', '$response2: ' . json_encode($response) . PHP_EOL, FILE_APPEND);


    // Curl
}

echo 'OK';