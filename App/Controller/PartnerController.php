<?php

namespace App;

use Exception;

/**
 * PartnerController. Контроллер взаимодействия с моделью управления партнерами.
 */
class PartnerController extends Controller
{
    protected $partnerModel;

    /**
     * Инициализация PartnerController
     */
    public function __construct()
    {
        parent::__construct();

        $this->partnerModel = new PartnerModel();
    }

    /**
     * Создание элемента
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
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription))),
            'avatarId' => $data->avatarId ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'author' => JwtMiddleware::getUserId(),
            'info' => $data->info ? json_encode($data->info) : ''
        );

        try {
            $itemData = $this->partnerModel->createItem($payload);

            if ($itemData['status']) {
                $item = $this->partnerModel->fetchItemById($request->id);
                LogModel::log('create', 'partner', JwtMiddleware::getUserId(), $item);
                $response->code(200)->json($item);

                return;
            }

            LogModel::error('Ошибка создания партнера.', $payload);
            $response->code(400)->json('Ошибка создания партнера. Повторите попытку позже.');

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

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'partnerExists',
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
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription))),
            'avatarId' => $data->avatarId ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'avatar' => $data->avatar && $data->images ? htmlentities(stripcslashes(strip_tags($data->avatar))) : null,
            'info' => $data->info ? json_encode($data->info) : ''
        );

        try {
            $itemData = $this->partnerModel->updateItem($payload);

            if ($itemData['status']) {
                $item = $this->partnerModel->fetchItemById($request->id);
                LogModel::log('update', 'partner', JwtMiddleware::getUserId(), $item);
                $response->code(200)->json($item);

                return;
            }

            LogModel::error('Ошибка обновления партнера.', $payload);
            $response->code(400)->json('Ошибка обновления партнера. Повторите попытку позже.');

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
                'validator' => 'partnerExists',
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
            $item = $this->partnerModel->fetchItemById($request->id);
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
            $list = $this->partnerModel->fetchList($filter);
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление элемента по id
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
                'validator' => 'partnerExists',
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
            if ($this->partnerModel->deleteItem($request->id)) {
                LogModel::log('remove', 'partner', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления партнера.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления партнера. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}