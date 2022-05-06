<?php

namespace App;

use Exception;

/**
 * WidgetController. Контроллер взаимодействия с моделью управления виджетами.
 */
class WidgetController extends Controller
{
    protected $widgetModel;

    /**
     * Инициализация WidgetController
     */
    public function __construct()
    {
        parent::__construct();

        $this->widgetModel = new WidgetModel();
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
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'style' => htmlentities(stripcslashes(strip_tags($data->style))),
            'page' => htmlentities(stripcslashes(strip_tags($data->page))),
            'ordering' => (int)htmlentities(stripcslashes(strip_tags($data->ordering))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'data' => $data->data
        );

        try {
            $itemData = $this->widgetModel->createItem($payload);

            if ($itemData['status']) {
                $item = $this->widgetModel->fetchItemById($request->id);
                LogModel::log('create', 'widget', JwtMiddleware::getUserId(), $item);
                $response->code(201)->json($item);

                return;
            }

            LogModel::error('Ошибка создания виджета.', $payload);
            $response->code(400)->json('Ошибка создания виджета. Повторите попытку позже.');

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
                'validator' => 'widgetExists',
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
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'style' => htmlentities(stripcslashes(strip_tags($data->style))),
            'page' => htmlentities(stripcslashes(strip_tags($data->page))),
            'ordering' => (int)htmlentities(stripcslashes(strip_tags($data->ordering))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'data' => $data->data
        );

        try {
            $itemData = $this->widgetModel->updateItem($payload);

            if ($itemData['status']) {
                $item = $this->widgetModel->fetchItemById($request->id);
                LogModel::log('update', 'widget', JwtMiddleware::getUserId(), $item);
                $response->code(200)->json($item);

                return;
            }

            LogModel::error('Ошибка обновления виджета.', $payload);
            $response->code(400)->json('Ошибка обновления виджета. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление порядка виджетов
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateWidgetOrdering($request, $response)
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
        $filter = parent::getFilterParams($data->filter);

        try {
            $this->widgetModel->updateWidgetOrdering($data->ids);

            $list = $this->widgetModel->fetchList($filter);
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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
                'validator' => 'widgetExists',
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
            $item = $this->widgetModel->fetchItemById($request->id);
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
            $list = $this->widgetModel->fetchList($filter);
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Вернет содержимое элементов для каждого виджета
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchWidgetsContent($request, $response)
    {
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $list = $this->widgetModel->fetchWidgetsContent($filter);
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
                'validator' => 'widgetExists',
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
            if ($this->widgetModel->deleteItem($request->id)) {
                LogModel::log('remove', 'widget', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления виджета.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления виджета. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}