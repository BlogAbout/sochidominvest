<?php

namespace App;

use Exception;

/**
 * ArticleController. Контроллер взаимодействия с моделью управления статьями.
 */
class ArticleController extends Controller
{
    protected $articleModel;

    /**
     * Инициализация ArticleController
     */
    public function __construct()
    {
        parent::__construct();

        $this->articleModel = new ArticleModel();
    }

    /**
     * Создание статьи
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createItem($request, $response)
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
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->description ?? '',
                'key' => 'Контент'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'publish' => (int)htmlentities(stripcslashes(strip_tags($data->publish))),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->meta_title))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->meta_description))),
            'buildings' => $data->buildings,
            'images' => $data->images,
            'avatarId' => $data->avatarId && $data->images ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'avatar' => $data->avatar && $data->images ? htmlentities(stripcslashes(strip_tags($data->avatar))) : null,
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'author' => JwtMiddleware::getUserId()
        );

        try {
            $itemData = $this->articleModel->createItem($payload);

            if ($itemData['status']) {
                LogModel::log('create', 'article', JwtMiddleware::getUserId(), $itemData['data']);
                $response->code(201)->json($itemData['data']);

                return;
            }

            LogModel::error('Ошибка создания статьи.', $payload);
            $response->code(400)->json('Ошибка создания статьи. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление статьи по id
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

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'articleExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->name ?? '',
                'key' => 'Название'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->description ?? '',
                'key' => 'Контент'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'id' => $request->id,
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'publish' => (int)htmlentities(stripcslashes(strip_tags($data->publish))),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription))),
            'buildings' => $data->buildings,
            'images' => $data->images,
            'avatarId' => $data->avatarId && $data->images ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'avatar' => $data->avatar && $data->images ? htmlentities(stripcslashes(strip_tags($data->avatar))) : null
        );

        try {
            $itemData = $this->articleModel->updateItem($payload);

            if ($itemData['status']) {
                $item = $this->articleModel->fetchItemById($request->id);
                LogModel::log('update', 'article', JwtMiddleware::getUserId(), $item);
                $response->code(200)->json($item);

                return;
            }

            LogModel::error('Ошибка обновления статьи.', $payload);
            $response->code(400)->json('Ошибка обновления статьи. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных статьи по id
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
                'validator' => 'articleExists',
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
            $item = $this->articleModel->fetchItemById($request->id);
            $response->code(200)->json($item);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка статей
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchList($request, $response)
    {
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $list = $this->articleModel->fetchList($filter);
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление статьи по id
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
                'validator' => 'articleExists',
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
            if ($this->articleModel->deleteItem($request->id)) {
                LogModel::log('remove', 'article', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления статьи.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления статьи. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}