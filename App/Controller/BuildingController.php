<?php

namespace App;

use Exception;

/**
 * BuildingController. Этот контроллер использует несколько моделей для создания, обновления, загрузки и удаления объектов недвижимости.
 */
class BuildingController extends Controller
{
    /**
     * Создание объекта недвижимости
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createBuilding($request, $response)
    {
        $responseObject = [];

        $FormDataMiddleware = new RequestMiddleware();
        $formData = $FormDataMiddleware::acceptsFormData();

        if (!$formData) {
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

        $data = $request->paramsPost();

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($data->name) ? $data->name : '',
                'key' => 'Название'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->address) ? $data->address : '',
                'key' => 'Адрес'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'address' => htmlentities(stripcslashes(strip_tags($data->address))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'houseClass' => htmlentities(stripcslashes(strip_tags($data->houseClass))),
            'material' => htmlentities(stripcslashes(strip_tags($data->material))),
            'entranceHouse' => htmlentities(stripcslashes(strip_tags($data->entranceHouse))),
            'parking' => htmlentities(stripcslashes(strip_tags($data->parking))),
            'territory' => htmlentities(stripcslashes(strip_tags($data->territory))),
            'ceilingHeight' => htmlentities(stripcslashes(strip_tags($data->ceilingHeight))),
            'maintenanceCost' => htmlentities(stripcslashes(strip_tags($data->maintenanceCost))),
            'distanceSea' => htmlentities(stripcslashes(strip_tags($data->distanceSea))),
            'gas' => htmlentities(stripcslashes(strip_tags($data->gas))),
            'heating' => htmlentities(stripcslashes(strip_tags($data->heating))),
            'electricity' => htmlentities(stripcslashes(strip_tags($data->electricity))),
            'sewerage' => htmlentities(stripcslashes(strip_tags($data->sewerage))),
            'waterSupply' => htmlentities(stripcslashes(strip_tags($data->waterSupply))),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        );

        try {
            $BuildingModel = new BuildingModel();
            $building = $BuildingModel::createBuilding($payload);

            if ($building['status']) {
                $responseObject['status'] = 201;
                $responseObject['data'] = $building['data'];
                $responseObject['message'] = '';

                $response->code(201)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Объект не может быть создан. Повторите попытку позже.';

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
     * Обновление объекта недвижимости по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateBuilding($request, $response)
    {
        $responseObject = [];
        $FormDataMiddleware = new RequestMiddleware();
        $formData = $FormDataMiddleware::acceptsFormData();

        if (!$formData) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Доступ к конечной точке разрешен только содержимому Multipart Form Data.',
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

        $data = $request->paramsPost();

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'buildingExists',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->name) ? $data->name : '',
                'key' => 'Название'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->address) ? $data->address : '',
                'key' => 'Адрес'
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
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'address' => htmlentities(stripcslashes(strip_tags($data->address))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'houseClass' => htmlentities(stripcslashes(strip_tags($data->houseClass))),
            'material' => htmlentities(stripcslashes(strip_tags($data->material))),
            'entranceHouse' => htmlentities(stripcslashes(strip_tags($data->entranceHouse))),
            'parking' => htmlentities(stripcslashes(strip_tags($data->parking))),
            'territory' => htmlentities(stripcslashes(strip_tags($data->territory))),
            'ceilingHeight' => htmlentities(stripcslashes(strip_tags($data->ceilingHeight))),
            'maintenanceCost' => htmlentities(stripcslashes(strip_tags($data->maintenanceCost))),
            'distanceSea' => htmlentities(stripcslashes(strip_tags($data->distanceSea))),
            'gas' => htmlentities(stripcslashes(strip_tags($data->gas))),
            'heating' => htmlentities(stripcslashes(strip_tags($data->heating))),
            'electricity' => htmlentities(stripcslashes(strip_tags($data->electricity))),
            'sewerage' => htmlentities(stripcslashes(strip_tags($data->sewerage))),
            'waterSupply' => htmlentities(stripcslashes(strip_tags($data->waterSupply))),
            'updated_at' => date('Y-m-d H:i:s')
        );

        try {
            $BuildingModel = new BuildingModel();
            $building = $BuildingModel::updateBuilding($payload);

            if ($building['status']) {
                $product['data'] = $BuildingModel::findBuildingById($request->id)['data'];
                $responseObject['status'] = 200;
                $responseObject['data'] = $product['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Объект не может быть обновлен. Повторите попытку позже.';

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
     * Получение данных объекта недвижимости по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getBuildingById($request, $response)
    {
        $responseObject = [];

        // Todo: Возможно будут доступны объекты даже не авторизованным
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
                'validator' => 'buildingExists',
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
            $BuildingModel = new BuildingModel();
            $building = $BuildingModel::findBuildingById($request->id);

            if ($building['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = $building['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось получить данные объекта. Повторите попытку позже.';

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
     * Получение списка объектов недвижимости
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchBuildings($request, $response)
    {
        $responseObject = [];
        // Todo: Возможно будут доступны объекты даже не авторизованным
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
            $BuildingModel = new BuildingModel();
            $building = $BuildingModel::fetchBuildings();

            if ($building['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = $building['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось получить данные объектов. Повторите попытку позже.';

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
     * Удаление объекта недвижимости по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteBuilding($request, $response)
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
                'validator' => 'buildingExists',
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
            $BuildingModel = new BuildingModel();
            $building = $BuildingModel::deleteBuilding($request->id);

            if ($building['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = [];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось удалить объект. Повторите попытку позже.';

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