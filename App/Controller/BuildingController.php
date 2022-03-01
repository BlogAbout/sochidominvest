<?php

namespace App;

use Exception;

/**
 * BuildingController. Этот контроллер использует несколько моделей для создания, обновления, загрузки и удаления объектов недвижимости
 */
class BuildingController extends Controller
{
    protected $buildingModel;

    /**
     * Инициализация BuildingController
     */
    public function __construct()
    {
        parent::__construct();

        $this->buildingModel = new BuildingModel();
    }

    /**
     * Создание объекта недвижимости
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createBuilding($request, $response)
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
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'houseClass' => htmlentities(stripcslashes(strip_tags($data->houseClass))),
            'material' => htmlentities(stripcslashes(strip_tags($data->material))),
            'houseType' => htmlentities(stripcslashes(strip_tags($data->houseType))),
            'entranceHouse' => htmlentities(stripcslashes(strip_tags($data->entranceHouse))),
            'parking' => htmlentities(stripcslashes(strip_tags($data->parking))),
            'territory' => htmlentities(stripcslashes(strip_tags($data->territory))),
            'ceilingHeight' => (float)htmlentities(stripcslashes(strip_tags($data->ceilingHeight))),
            'maintenanceCost' => (float)htmlentities(stripcslashes(strip_tags($data->maintenanceCost))),
            'distanceSea' => (float)htmlentities(stripcslashes(strip_tags($data->distanceSea))),
            'gas' => htmlentities(stripcslashes(strip_tags($data->gas))),
            'heating' => htmlentities(stripcslashes(strip_tags($data->heating))),
            'electricity' => htmlentities(stripcslashes(strip_tags($data->electricity))),
            'sewerage' => htmlentities(stripcslashes(strip_tags($data->sewerage))),
            'waterSupply' => htmlentities(stripcslashes(strip_tags($data->waterSupply))),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'advantages' => htmlentities(stripcslashes(strip_tags(implode(',', $data->advantages)))),
            'tags' => $data->tags
        );

        try {
            $buildingData = $this->buildingModel->createBuilding($payload);

            if ($buildingData['status']) {
                $response->code(201)->json($buildingData['data']);

                return;
            }

            $response->code(400)->json('Ошибка создания объекта. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление объекта недвижимости по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateBuilding($request, $response)
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
                'validator' => 'buildingExists',
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
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'houseClass' => htmlentities(stripcslashes(strip_tags($data->houseClass))),
            'material' => htmlentities(stripcslashes(strip_tags($data->material))),
            'houseType' => htmlentities(stripcslashes(strip_tags($data->houseType))),
            'entranceHouse' => htmlentities(stripcslashes(strip_tags($data->entranceHouse))),
            'parking' => htmlentities(stripcslashes(strip_tags($data->parking))),
            'territory' => htmlentities(stripcslashes(strip_tags($data->territory))),
            'ceilingHeight' => (float)htmlentities(stripcslashes(strip_tags($data->ceilingHeight))),
            'maintenanceCost' => (float)htmlentities(stripcslashes(strip_tags($data->maintenanceCost))),
            'distanceSea' => (float)htmlentities(stripcslashes(strip_tags($data->distanceSea))),
            'gas' => htmlentities(stripcslashes(strip_tags($data->gas))),
            'heating' => htmlentities(stripcslashes(strip_tags($data->heating))),
            'electricity' => htmlentities(stripcslashes(strip_tags($data->electricity))),
            'sewerage' => htmlentities(stripcslashes(strip_tags($data->sewerage))),
            'waterSupply' => htmlentities(stripcslashes(strip_tags($data->waterSupply))),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'advantages' => htmlentities(stripcslashes(strip_tags(implode(',', $data->advantages)))),
            'tags' => $data->tags
        );

        try {
            $buildingData = $this->buildingModel->updateBuilding($payload);

            if ($buildingData['status']) {
                $building = $this->buildingModel->fetchBuildingById($request->id);
                $response->code(200)->json($building);

                return;
            }

            $response->code(400)->json('Ошибка обновления объекта. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных объекта недвижимости по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getBuildingById($request, $response)
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

        try {
            $building = $this->buildingModel->fetchBuildingById($request->id);
            $response->code(200)->json($building);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка объектов недвижимости
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchBuildings($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        try {
            $buildingList = $this->buildingModel->fetchBuildings();
            $response->code(200)->json($buildingList);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление объекта недвижимости по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteBuilding($request, $response)
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

        try {
            if ($this->buildingModel->deleteBuilding($request->id)) {
                $response->code(200)->json('');

                return;
            }

            $response->code(400)->json('Ошибка удаления объекта. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}