<?php

namespace App;

use Exception;

/**
 * FeedbackController. Этот контроллер использует несколько моделей для создания, обновления, загрузки и удаления заявок
 */
class FeedbackController extends Controller
{
    protected $feedbackModel;

    /**
     * Инициализация FeedbackController
     */
    public function __construct()
    {
        parent::__construct();

        $this->feedbackModel = new FeedbackModel($this->settings);
    }

    /**
     * Создание заявки
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createFeed($request, $response)
    {
        if (!$this->requestMiddleware->acceptsJson()) {
            $response->code(400)->json('Доступ к конечной точке разрешен только содержимому JSON.');

            return;
        }

        $author = null;
        if (JwtMiddleware::getAndDecodeToken()) {
            $author = JwtMiddleware::getUserId();
        }

        $data = json_decode($request->body());

        if (!$author) {
            $validationObject = array(
                (object)[
                    'validator' => 'required',
                    'data' => $data->phone ?? '',
                    'key' => 'Номер телефона'
                ]
            );

            $validationBag = parent::validation($validationObject);
            if ($validationBag->status) {
                $response->code(400)->json($validationBag->errors);

                return;
            }
        }

        $payload = array(
            'phone' => $data->phone ? htmlentities(stripcslashes(strip_tags($data->phone))) : '',
            'name' => $data->name ? htmlentities(stripcslashes(strip_tags($data->name))) : '',
            'title' => htmlentities(stripcslashes(strip_tags($data->title))),
            'type' => $data->type ? htmlentities(stripcslashes(strip_tags($data->type))) : 'feed',
            'objectId' => $data->objectId ? (int)htmlentities(stripcslashes(strip_tags($data->objectId))) : null,
            'objectType' => $data->objectType ? htmlentities(stripcslashes(strip_tags($data->objectType))) : '',
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'author' => $author,
            'messages' => $data->messages
        );

        try {
            $feedData = $this->feedbackModel->createFeed($payload);

            if ($feedData['status']) {
                if ($author) {
                    LogModel::log('create', 'feed', $author, $feedData['data']);
                }

                $response->code(201)->json($feedData['data']);

                return;
            }

            LogModel::error('Ошибка создания заявки.', $payload);
            $response->code(400)->json('Ошибка создания заявки. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление заявки по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateFeed($request, $response)
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
                'validator' => 'feedExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'id' => $request->id,
            'phone' => $data->phone ? htmlentities(stripcslashes(strip_tags($data->phone))) : '',
            'name' => $data->name ? htmlentities(stripcslashes(strip_tags($data->name))) : '',
            'title' => htmlentities(stripcslashes(strip_tags($data->title))),
            'type' => $data->type ? htmlentities(stripcslashes(strip_tags($data->type))) : 'feed',
            'objectId' => $data->objectId ? (int)htmlentities(stripcslashes(strip_tags($data->objectId))) : null,
            'objectType' => $data->objectType ? htmlentities(stripcslashes(strip_tags($data->objectType))) : '',
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'author' => JwtMiddleware::getUserId(),
            'messages' => $data->messages,
            'authorFeed' => $data->author
        );

        try {
            $feedData = $this->feedbackModel->updateFeed($payload);

            if ($feedData['status']) {
                $feed = $this->feedbackModel->fetchFeedById($request->id);
                LogModel::log('update', 'feed', JwtMiddleware::getUserId(), $feed);
                $response->code(200)->json($feed);

                return;
            }

            LogModel::error('Ошибка обновления заявки.', $payload);
            $response->code(400)->json('Ошибка обновления заявки. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных заявки по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getFeedById($request, $response)
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
                'validator' => 'feedExists',
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
            $feed = $this->feedbackModel->fetchFeedById($request->id);
            $response->code(200)->json($feed);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка заявок
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchFeeds($request, $response)
    {
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $feedList = $this->feedbackModel->fetchFeeds($filter);
            $response->code(200)->json($feedList);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление заявки по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteFeed($request, $response)
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
                'validator' => 'feedExists',
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
            if ($this->feedbackModel->deleteFeed($request->id)) {
                LogModel::log('remove', 'feed', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления заявки.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления заявки. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}