<?php

namespace App;

use Exception;

/**
 * AttachmentController. Контроллер взаимодействия с моделью управления вложениями.
 */
class AttachmentController extends Controller
{
    protected $attachmentModel;

    /**
     * Инициализация AttachmentController
     */
    public function __construct()
    {
        parent::__construct();

        $this->attachmentModel = new AttachmentModel();
    }

    /**
     * Загрузка элемента
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function uploadAttachment($request, $response)
    {
        if (!$this->requestMiddleware->acceptsFormData()) {
            $response->code(400)->json('Доступ к конечной точке разрешен только содержимому FormData.');

            return;
        }

        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        $files = $request->files()->all();
        $data = $request->paramsPost();

        $type = $data->type ?? 'image';

        $result = self::uploadFileToServer($files, $type);

        if (!$result['status']) {
            $response->code(400)->json($result['data']);
            return;
        }

        $payload = array(
            'content' => htmlentities(stripcslashes(strip_tags($data->content))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'extension' => htmlentities(stripcslashes(strip_tags($data->extension))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'author' => JwtMiddleware::getUserId()
        );

        try {
            $itemData = $this->attachmentModel->createItem($payload);

            if ($itemData['status']) {
                LogModel::log('create', 'attachment', JwtMiddleware::getUserId(), $itemData['data']);
                $response->code(201)->json($itemData['data']);

                return;
            }

            LogModel::error('Ошибка создания вложения.', $payload);
            $response->code(400)->json('Ошибка создания вложения. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление элемента по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateItem($request, $response)
    {
        if (!$this->requestMiddleware->acceptsJson()) {
            $response->code(400)->json('Доступ к конечной точке разрешен только содержимому JSON.');

            return;
        }

        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        $data = json_decode($request->body());

        $payload = array(
            'id' => $request->id,
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active)))
        );

        try {
            $itemData = $this->attachmentModel->updateItem($payload);

            if ($itemData['status']) {
                $item = $this->attachmentModel->fetchItemById($request->id);
                LogModel::log('update', 'attachment', JwtMiddleware::getUserId(), $item);
                $response->code(200)->json($item);

                return;
            }

            LogModel::error('Ошибка обновления вложения.', $payload);
            $response->code(400)->json('Ошибка обновления вложения. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных элемента по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchItemById($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'attachmentExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        try {
            $item = $this->attachmentModel->fetchItemById($request->id);
            $response->code(200)->json($item);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка элементов
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchList($request, $response)
    {
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $list = $this->attachmentModel->fetchList($filter);
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление вложения по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteItem($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'attachmentExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        try {
            if ($this->attachmentModel->deleteItem($request->id)) {
                LogModel::log('remove', 'attachment', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления вложения.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления вложения. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Загрузка файла на сервер
     *
     * @param array $files
     * @param string $type
     * @return array
     */
    private function uploadFileToServer(array $files, string $type): array
    {
        if (!$files || !$files['file'] || $files['file']['error'] > 0) {
            return array(
                'status' => false,
                'data' => 'Ошибка загрузки файла. Повторите попытку позже.'
            );
        }

        // Todo: Проверка на тип файла
        // Todo: Проверка на размер файла

        $nameArray = explode('.', $files['file']['name']);
        $extension = array_pop($nameArray);
        $fileTmpName = $files['file']['tmp_name'];
        $fileName = base64_encode(microtime()) . '.' . $extension;
        $path = $type . '/';

        $dir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/' . $path;
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }

        if (!move_uploaded_file($fileTmpName, $dir . $fileName)) {
            return array(
                'status' => false,
                'data' => 'Ошибка сохранения файла на сервере. Возможно не достаточно прав. Повторите попытку позже.'
            );
        }

        return array(
            'status' => true,
            'data' => [
                'content' => $path . $fileName,
                'extension' => $extension
            ]
        );
    }
}