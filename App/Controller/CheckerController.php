<?php

namespace App;

use Exception;

/**
 * CheckerController. Этот контроллер использует несколько моделей для создания, обновления, загрузки и удаления шахматки
 */
class CheckerController extends Controller
{
    protected $checkerModel;

    /**
     * Инициализация CheckerController
     */
    public function __construct()
    {
        parent::__construct();

        $this->checkerModel = new CheckerModel();
    }

    /**
     * Создание квартиры
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createChecker($request, $response)
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
                'data' => $data->buildingId ?? '',
                'key' => 'Объект недвижимости'
            ],
            (object)[
                'validator' => 'buildingExists',
                'data' => $data->buildingId ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->name ?? '',
                'key' => 'Название'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->area ?? '',
                'key' => 'Площадь'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->cost ?? '',
                'key' => 'Стоимость'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'buildingId' => (int)htmlentities(stripcslashes(strip_tags($data->buildingId))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'area' => (float)htmlentities(stripcslashes(strip_tags($data->area))),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'furnish' => htmlentities(stripcslashes(strip_tags($data->furnish))),
            'housing' => (int)htmlentities(stripcslashes(strip_tags($data->housing))),
            'stage' => (int)htmlentities(stripcslashes(strip_tags($data->stage))),
            'rooms' => (int)htmlentities(stripcslashes(strip_tags($data->rooms))),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status)))
        );

        try {
            $checkerData = $this->checkerModel->createChecker($payload);

            if ($checkerData['status']) {
                $response->code(201)->json($checkerData['data']);

                return;
            }

            $response->code(400)->json('Ошибка создания квартиры. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление квартиры по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateChecker($request, $response)
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
                'validator' => 'checkerExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->buildingId ?? '',
                'key' => 'Объект недвижимости'
            ],
            (object)[
                'validator' => 'buildingExists',
                'data' => $data->buildingId ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->name ?? '',
                'key' => 'Название'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->area ?? '',
                'key' => 'Площадь'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->cost ?? '',
                'key' => 'Стоимость'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'id' => $request->id,
            'buildingId' => (int)htmlentities(stripcslashes(strip_tags($data->buildingId))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'area' => (float)htmlentities(stripcslashes(strip_tags($data->area))),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'furnish' => htmlentities(stripcslashes(strip_tags($data->furnish))),
            'housing' => (int)htmlentities(stripcslashes(strip_tags($data->housing))),
            'stage' => (int)htmlentities(stripcslashes(strip_tags($data->stage))),
            'rooms' => (int)htmlentities(stripcslashes(strip_tags($data->rooms))),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status)))
        );

        try {
            $checkerData = $this->checkerModel->updateChecker($payload);

            if ($checkerData['status']) {
                $checker = $this->checkerModel->fetchCheckerById($request->id);
                $response->code(200)->json($checker);

                return;
            }

            $response->code(400)->json('Ошибка обновления квартиры. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных квартиры по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getCheckerById($request, $response)
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
                'validator' => 'checkerExists',
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
            $checker = $this->checkerModel->fetchCheckerById($request->id);
            $response->code(200)->json($checker);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка квартир
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchCheckers($request, $response)
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
                'validator' => 'buildingExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $filter = [
            'active' => 1
        ];

        try {
            $checkerList = $this->checkerModel->fetchCheckers($filter, $request->id);
            $response->code(200)->json($checkerList);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление квартиры по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteChecker($request, $response)
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
                'validator' => 'checkerExists',
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
            if ($this->checkerModel->deleteChecker($request->id)) {
                $response->code(200)->json('');

                return;
            }

            $response->code(400)->json('Ошибка удаления квартиры. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}