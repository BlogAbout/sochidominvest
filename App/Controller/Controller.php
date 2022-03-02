<?php

namespace App;

use Exception;

/**
 * Controller. Базовый контроллер для всех других контроллеров. Все остальные контроллеры расширяют этот контроллер.
 */
class Controller
{
    protected $requestMiddleware;

    /**
     * Инициализация базового контроллера
     */
    public function __construct()
    {
        $this->requestMiddleware = new RequestMiddleware();
    }

    /**
     * Проверяет массив объектов, используя определенные правила
     *
     * @param array $payloads Содержит массив объектов, которые будут проверены.
     * @return \stdClass $response
     */
    protected static function validation(array $payloads): \stdClass
    {
        $response = [];

        foreach ($payloads as $payload) {
            if ($payload->validator == 'required') {
                if ($payload->data == null || $payload->data = '' || !isset($payload->data)) {
                    array_push($response, "$payload->key обязательно для заполнения");
                }
            }

            if ($payload->validator == 'string') {
                if (preg_match('/[^A-Za-zА-Яа-яЁё]/', $payload->data)) {
                    array_push($response, "$payload->key должно содержать только текст.");
                }
            }

            if ($payload->validator == 'numeric') {
                if (preg_match('/[^0-9_]/', $payload->data)) {
                    array_push($response, "$payload->key должно содержать только цифры.");
                }
            }

            if ($payload->validator == 'boolean') {
                if (strtolower(gettype($payload->data)) !== 'boolean') {
                    array_push($response, "$payload->key должно содержать boolean значение.");
                }
            }

            if (stristr($payload->validator, ':')) {
                $operationName = explode(':', $payload->validator)[0];
                $operationChecks = (int)explode(':', $payload->validator)[1];

                if (strtolower($operationName) == 'min' && $operationChecks > strlen($payload->data)) {
                    array_push($response, "$payload->key должен быть больше, чем $operationChecks символа");
                }

                if (strtolower($operationName) == 'max' && $operationChecks < strlen($payload->data)) {
                    array_push($response, "$payload->key должен быть меньше, чем $operationChecks символа");
                }

                if (strtolower($operationName) == 'between') {
                    $operationChecksTwo = (int)explode(':', $payload->validator)[2];
                    array_push($response, "$payload->key должно быть между $operationChecks и $operationChecksTwo символами");
                }
            }

            if ($payload->validator == 'emailExists') {
                try {
                    $checkEmail = UserModel::checkEmail($payload->data);

                    if ($checkEmail['status']) {
                        if (!$payload->id || $checkEmail['data']['id'] != $payload->id) {
                            array_push($response, "Указанный $payload->key уже существует. Пожалуйста, попробуйте другой.");
                        }
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'userExists') {
                try {
                    $checkUser = UserModel::fetchUserById((int)$payload->data);

                    if (!$checkUser['id']) {
                        array_push($response, "Пользователь с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'buildingExists') {
                try {
                    $checkBuilding = BuildingModel::fetchBuildingById((int)$payload->data);

                    if (!$checkBuilding['id']) {
                        array_push($response, "Объект с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'checkerExists') {
                try {
                    $checkChecker = CheckerModel::fetchCheckerById((int)$payload->data);

                    if (!$checkChecker['id']) {
                        array_push($response, "Квартира с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'tagExists') {
                try {
                    $checkTag = TagModel::fetchTagById((int)$payload->data);

                    if (!$checkTag['id']) {
                        array_push($response, "Метка с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

//            if ($payload->validator == 'img') {
//                try {
//                    $files = $payload->data;
//                    if ($files) {
//                        $fileName = $files['name'];
//
//                        $targetDir = '../../public/img/';
//                        $targetFile = $targetDir . basename($files['name']);
//
//                        $fileSize = $files['size'];
//                        $fileExtension = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
//
//                        if (!in_array($fileExtension, $payload->acceptedExtension)) {
//                            array_push($response, "{$payload->key} принимает только следующие расширения: " . implode(", ", $payload->acceptedExtension));
//                        }
//
//                        if ($fileSize > $payload->maxSize) {
//                            array_push($response, "{$payload->key} размер файла должен быть меньше " . $payload->maxSize);
//                        }
//                    }
//                } catch (Exception $e) {
//                }
//            }
        }

        $validationErrors = new \stdClass();

        if (count($response) < 1) {
            $validationErrors->status = false;
            $validationErrors->errors = [];

            return $validationErrors;
        }

        $validationErrors->status = true;
        $validationErrors->errors = implode(",\n", $response);

        return $validationErrors;
    }

    /**
     * Вернет JWT секрет
     *
     * @param void
     * @return string
     */
    protected static function JWTSecret(): string
    {
        return 'K-lyniEXe8Gm-WOA7IhUd5xMrqCBSPzZFpv02Q6sJcVtaYD41wfHRL3';
    }
}