<?php

namespace App;

use Exception;

/**
 * DocumentController. Этот контроллер использует несколько моделей для создания, обновления, загрузки и удаления документов
 */
class DocumentController extends Controller
{
    protected $documentModel;

    /**
     * Инициализация DocumentController
     */
    public function __construct()
    {
        parent::__construct();

        $this->documentModel = new DocumentModel();
    }

    /**
     * Создание документа
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createDocument($request, $response)
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

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $data->name ?? '',
                'key' => 'Название'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'userId' => $data->userId ? (int)htmlentities(stripcslashes(strip_tags($data->userId))) : null,
            'name' => $data->name ? htmlentities(stripcslashes(strip_tags($data->name))) : '',
            'objectId' => $data->objectId ? (int)htmlentities(stripcslashes(strip_tags($data->objectId))) : null,
            'objectType' => $data->objectType ? htmlentities(stripcslashes(strip_tags($data->objectType))) : '',
            'type' => $data->type ? htmlentities(stripcslashes(strip_tags($data->type))) : 'file',
            'extension' => $data->extension ? htmlentities(stripcslashes(strip_tags($data->extension))) : null,
            'content' => $data->content ? htmlentities(stripcslashes(strip_tags($data->content))) : '',
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'author' => JwtMiddleware::getUserId()
        );

        try {
            $documentData = $this->documentModel->createDocument($payload);

            if ($documentData['status']) {
                $response->code(201)->json($documentData['data']);

                return;
            }

            $response->code(400)->json('Ошибка создания документа. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление документа по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateDocument($request, $response)
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

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'documentExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->name ?? '',
                'key' => 'Название'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'id' => $request->id,
            'userId' => $data->userId ? (int)htmlentities(stripcslashes(strip_tags($data->userId))) : null,
            'name' => $data->name ? htmlentities(stripcslashes(strip_tags($data->name))) : '',
            'objectId' => $data->objectId ? (int)htmlentities(stripcslashes(strip_tags($data->objectId))) : null,
            'objectType' => $data->objectType ? htmlentities(stripcslashes(strip_tags($data->objectType))) : '',
            'type' => $data->type ? htmlentities(stripcslashes(strip_tags($data->type))) : 'file',
            'extension' => $data->extension ? htmlentities(stripcslashes(strip_tags($data->extension))) : null,
            'content' => $data->content ? htmlentities(stripcslashes(strip_tags($data->content))) : '',
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active)))
        );

        try {
            $documentData = $this->documentModel->updateDocument($payload);

            if ($documentData['status']) {
                $document = $this->documentModel->fetchDocumentById($request->id);
                $response->code(200)->json($document);

                return;
            }

            $response->code(400)->json('Ошибка обновления документа. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных документа по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getDocumentById($request, $response)
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
                'validator' => 'documentExists',
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
            $document = $this->documentModel->fetchDocumentById($request->id);
            $response->code(200)->json($document);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка документов
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchDocuments($request, $response)
    {
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $documentList = $this->documentModel->fetchDocuments($filter);
            $response->code(200)->json($documentList);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление документа по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteDocument($request, $response)
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
                'validator' => 'documentExists',
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
            if ($this->documentModel->deleteDocument($request->id)) {
                $response->code(200)->json('');

                return;
            }

            $response->code(400)->json('Ошибка удаления документа. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}