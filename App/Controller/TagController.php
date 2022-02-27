<?php

namespace App;

use Exception;

/**
 * TagController. Этот контроллер использует несколько моделей для создания, обновления, загрузки и удаления меток
 */
class TagController extends Controller
{
    /**
     * Создание метки
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createTag($request, $response)
    {
        $responseObject = [];

        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Доступ к конечной точке разрешен только содержимому JSON.',
                'data' => []
            ]);

            $response->code(400)->json($responseObject);

            return;
        }

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($data->name) ? $data->name : '',
                'key' => 'Название'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
        );

        try {
            $TagModel = new TagModel();
            $tag = $TagModel::createTag($payload);

            if ($tag['status']) {
                $responseObject['status'] = 201;
                $responseObject['data'] = $tag['data'];
                $responseObject['message'] = '';

                $response->code(201)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Метка не может быть создана. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Обновление метки по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateTag($request, $response)
    {
        $responseObject = [];

        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Доступ к конечной точке разрешен только содержимому JSON.',
                'data' => []
            ]);

            $response->code(400)->json($responseObject);

            return;
        }

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'tagExists',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->name) ? $data->name : '',
                'key' => 'Название'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'id' => $request->id,
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
        );

        try {
            $TagModel = new TagModel();
            $tag = $TagModel::updateTag($payload);

            if ($tag['status']) {
                $tag['data'] = $TagModel::fetchTagById($request->id)['data'];
                $responseObject['status'] = 200;
                $responseObject['data'] = $tag['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Метка не может быть обновлена. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Получение данных метки по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getTagById($request, $response)
    {
        $responseObject = [];

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'tagExists',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        try {
            $TagModel = new TagModel();
            $tag = $TagModel::fetchTagById($request->id);

            if ($tag['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = $tag['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось получить данные метки. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Получение списка меток
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchTags($request, $response)
    {
        $responseObject = [];

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        try {
            $TagModel = new TagModel();
            $tag = $TagModel::fetchTags();

            if ($tag['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = $tag['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось получить данные меток. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Удаление метки по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteTag($request, $response)
    {
        $responseObject = [];

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'tagExists',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        try {
            $TagModel = new TagModel();
            $tag = $TagModel::deleteTag($request->id);

            if ($tag['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = [];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось удалить метку. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }
}