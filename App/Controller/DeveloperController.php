<?php

namespace App;

use Exception;

/**
 * DeveloperController. Этот контроллер использует несколько моделей для создания, обновления, загрузки и удаления застройщиков
 */
class DeveloperController extends Controller
{
    protected $developerModel;

    /**
     * Инициализация DeveloperController
     */
    public function __construct()
    {
        parent::__construct();

        $this->developerModel = new DeveloperModel();
    }

    /**
     * Создание застройщика
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createDeveloper($request, $response)
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
                'data' => $data->address ?? '',
                'key' => 'Адрес'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->phone ?? '',
                'key' => 'Телефон'
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
            'address' => htmlentities(stripcslashes(strip_tags($data->address))),
            'phone' => htmlentities(stripcslashes(strip_tags($data->phone))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active)))
        );

        try {
            $developerData = $this->developerModel->createDeveloper($payload);

            if ($developerData['status']) {
                $response->code(201)->json($developerData['data']);

                return;
            }

            $response->code(400)->json('Ошибка создания застройщика. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление застройщика по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateDeveloper($request, $response)
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
                'validator' => 'developerExists',
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
                'data' => $data->address ?? '',
                'key' => 'Адрес'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->phone ?? '',
                'key' => 'Телефон'
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
            'address' => htmlentities(stripcslashes(strip_tags($data->address))),
            'phone' => htmlentities(stripcslashes(strip_tags($data->phone))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active)))
        );

        try {
            $developerData = $this->developerModel->updateDeveloper($payload);

            if ($developerData['status']) {
                $developer = $this->developerModel->fetchDeveloperById($request->id);
                $response->code(200)->json($developer);

                return;
            }

            $response->code(400)->json('Ошибка обновления застройщика. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных застройщика по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getDeveloperById($request, $response)
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
                'validator' => 'developerExists',
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
            $developer = $this->developerModel->fetchDeveloperById($request->id);
            $response->code(200)->json($developer);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка застройщиков
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchDevelopers($request, $response)
    {
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $developerList = $this->developerModel->fetchDevelopers($filter);
            $response->code(200)->json($developerList);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление застройщика по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteDeveloper($request, $response)
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
                'validator' => 'developerExists',
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
            if ($this->developerModel->deleteDeveloper($request->id)) {
                $response->code(200)->json('');

                return;
            }

            $response->code(400)->json('Ошибка удаления застройщика. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}