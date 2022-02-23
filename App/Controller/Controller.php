<?php

namespace App;

use Exception;

/**
 * Controller. Базовый контроллер для всех других контроллеров. Все остальные контроллеры расширяют этот контроллер.
 */
class Controller
{
    /**
     * Проверяет массив объектов, используя определенные правила
     *
     * @param array $payloads Содержит массив объектов, которые будут проверены.
     * @return \stdClass $response
     */
    protected static function validation($payloads)
    {
        $response = [];

        foreach ($payloads as $payload) {
            if ($payload->validator == 'required') {
                if ($payload->data == null || $payload->data = '' || !isset($payload->data)) {
                    array_push($response, [
                        'key' => $payload->key,
                        'message' => "{$payload->key} обязательно для заполнения"
                    ]);
                }
            }

            if ($payload->validator == 'string') {
                if (preg_match('/[^A-Za-zА-Яа-яЁё]/', $payload->data)) {
                    array_push($response, [
                        'key' => $payload->key,
                        'message' => "{$payload->key} должно содержать только текст."
                    ]);
                }
            }

            if ($payload->validator == 'numeric') {
                if (preg_match('/[^0-9_]/', $payload->data)) {
                    array_push($response, [
                        'key' => $payload->key,
                        'message' => "{$payload->key} должно содержать только цифры."
                    ]);
                }
            }

            if ($payload->validator == 'boolean') {
                if (strtolower(gettype($payload->data)) !== 'boolean') {
                    array_push($response, [
                        'key' => $payload->key,
                        'message' => "{$payload->key} должно содержать boolean значение."
                    ]);
                }
            }

            if (stristr($payload->validator, ':')) {
                $operationName = explode(':', $payload->validator)[0];
                $operationChecks = (int)explode(':', $payload->validator)[1];

                if (strtolower($operationName) == 'min' && $operationChecks > strlen($payload->data)) {
                    array_push($response, [
                        'key' => $payload->key,
                        'message' => "{$payload->key} должно быть больше, чем " . strlen($payload->data)
                    ]);
                }

                if (strtolower($operationName) == 'max' && $operationChecks < strlen($payload->data)) {
                    array_push($response, [
                        'key' => $payload->key,
                        'message' => "{$payload->key} должно быть меньше, чем " . strlen($payload->data)
                    ]);
                }

                if (strtolower($operationName) == 'between') {
                    $operationChecksTwo = (int)explode(':', $payload->validator)[2];
                    array_push($response, [
                        'key' => $payload->key,
                        'message' => "{$payload->key} должно быть между " . $operationChecks . ' и ' . $operationChecksTwo
                    ]);
                }
            }

            if ($payload->validator == 'emailExists') {
                try {
                    $UserModel = new UserModel();
                    $checkEmail = $UserModel::checkEmail($payload->data);

                    if ($checkEmail['status']) {
                        array_push($response, [
                            'key' => $payload->key,
                            'message' => "Указанный {$payload->key} уже существует. Пожалуйста, попробуйте другой."
                        ]);
                    }
                } catch (Exception $e) {
                    /** */
                }
            }

            // Todo
            if ($payload->validator == 'catalogExists') {
                try {
                    $CatalogModel = new CatalogModel();
                    $checkCatalog = $CatalogModel::fetchCatalogByID($payload->data);

                    if (!$checkCatalog['status']) {
                        array_push($response, [
                            'key' => $payload->key,
                            'message' => "Sorry, The catalog with this ID could not be found in our database."
                        ]);
                    }
                } catch (Exception $e) {
                    /** */
                }
            }

            // Todo
            if ($payload->validator == 'buildingExists') {
                try {
                    $ProductModel = new BuildingModel();
                    $checkProduct = $ProductModel::findProductById((int)$payload->data);

                    if (!$checkProduct['status']) {
                        array_push($response, [
                            'key' => $payload->key,
                            'message' => "Sorry, The product with this ID could not be found in our database."
                        ]);
                    }
                } catch (Exception $e) {
                    /** */
                }
            }

            if ($payload->validator == 'img') {
                try {
                    $files = $payload->data;
                    if ($files) {
                        $fileName = $files['name'];

                        $targetDir = '../../public/img/';
                        $targetFile = $targetDir . basename($files['name']);

                        $fileSize = $files['size'];
                        $fileExtension = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

                        if (!in_array($fileExtension, $payload->acceptedExtension)) {
                            array_push($response, [
                                'key' => $payload->key,
                                'message' => "{$payload->key} принимает только следующие расширения: " . implode(", ", $payload->acceptedExtension)
                            ]);
                        }

                        if ($fileSize > $payload->maxSize) {
                            array_push($response, [
                                'key' => $payload->key,
                                'message' => "{$payload->key} размер файла должен быть меньше " . $payload->maxSize
                            ]);
                        }
                    }
                } catch (Exception $e) {
                    /** */
                }
            }

        }

        $validationErrors = new \stdClass();

        if (count($response) < 1) {
            $validationErrors->status = false;
            $validationErrors->errors = [];

            return $validationErrors;
        }

        $validationErrors->status = true;
        $validationErrors->errors = $response;

        return $validationErrors;
    }

    /**
     * Вернет JWT секрет
     *
     * @param void
     * @return string
     */
    protected static function JWTSecret()
    {
        return 'K-lyniEXe8Gm-WOA7IhUd5xMrqCBSPzZFpv02Q6sJcVtaYD41wfHRL3';
    }
}