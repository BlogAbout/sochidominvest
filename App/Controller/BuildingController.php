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

        $this->buildingModel = new BuildingModel($this->settings);
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
            'coordinates' => htmlentities(stripcslashes(strip_tags($data->coordinates))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'publish' => (int)htmlentities(stripcslashes(strip_tags($data->publish))),
            'rent' => (int)htmlentities(stripcslashes(strip_tags($data->rent))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'district' => htmlentities(stripcslashes(strip_tags($data->district))),
            'districtZone' => htmlentities(stripcslashes(strip_tags($data->districtZone))),
            'houseClass' => htmlentities(stripcslashes(strip_tags($data->houseClass))),
            'material' => htmlentities(stripcslashes(strip_tags($data->material))),
            'houseType' => htmlentities(stripcslashes(strip_tags($data->houseType))),
            'entranceHouse' => htmlentities(stripcslashes(strip_tags($data->entranceHouse))),
            'parking' => htmlentities(stripcslashes(strip_tags($data->parking))),
            'territory' => htmlentities(stripcslashes(strip_tags($data->territory))),
            'ceilingHeight' => (float)htmlentities(stripcslashes(strip_tags($data->ceilingHeight))),
            'maintenanceCost' => (float)htmlentities(stripcslashes(strip_tags($data->maintenanceCost))),
            'distanceSea' => (int)htmlentities(stripcslashes(strip_tags($data->distanceSea))),
            'gas' => htmlentities(stripcslashes(strip_tags($data->gas))),
            'heating' => htmlentities(stripcslashes(strip_tags($data->heating))),
            'electricity' => htmlentities(stripcslashes(strip_tags($data->electricity))),
            'sewerage' => htmlentities(stripcslashes(strip_tags($data->sewerage))),
            'waterSupply' => htmlentities(stripcslashes(strip_tags($data->waterSupply))),
            'advantages' => is_array($data->advantages) && count($data->advantages) ? htmlentities(stripcslashes(strip_tags(implode(',', $data->advantages)))) : '',
            'payments' => is_array($data->payments) && count($data->payments) ? htmlentities(stripcslashes(strip_tags(implode(',', $data->payments)))) : '',
            'formalization' => is_array($data->formalization) && count($data->formalization) ? htmlentities(stripcslashes(strip_tags(implode(',', $data->formalization)))) : '',
            'amountContract' => htmlentities(stripcslashes(strip_tags($data->amountContract))),
            'surchargeDoc' => (float)htmlentities(stripcslashes(strip_tags($data->surchargeDoc))),
            'surchargeGas' => (float)htmlentities(stripcslashes(strip_tags($data->surchargeGas))),
            'saleNoResident' => (int)htmlentities(stripcslashes(strip_tags($data->saleNoResident))),
            'tags' => $data->tags,
            'contactUsers' => $data->contactUsers,
            'contactContacts' => $data->contactContacts,
            'developers' => $data->developers,
            'agents' => $data->agents,
            'articles' => $data->articles,
            'images' => $data->images,
            'videos' => $data->videos,
            'avatarId' => $data->avatarId && $data->images ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'avatar' => $data->avatar && $data->images ? htmlentities(stripcslashes(strip_tags($data->avatar))) : null,
            'area' => (float)htmlentities(stripcslashes(strip_tags($data->area))),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription))),
            'passed' => $data->passed ?? null,
            'rentData' => $data->rentData,
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'author' => JwtMiddleware::getUserId(),
            'cadastrNumber' => htmlentities(stripcslashes(strip_tags($data->cadastrNumber))),
            'cadastrCost' => (float)htmlentities(stripcslashes(strip_tags($data->cadastrCost)))
        );

        try {
            $buildingData = $this->buildingModel->createBuilding($payload);

            if ($buildingData['status']) {
                LogModel::log('create', 'building', JwtMiddleware::getUserId(), $buildingData['data']);
                $response->code(201)->json($buildingData['data']);

                return;
            }

            LogModel::error('Ошибка создания объекта.', $payload);
            $response->code(400)->json('Ошибка создания объекта. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
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
            'coordinates' => htmlentities(stripcslashes(strip_tags($data->coordinates))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'publish' => (int)htmlentities(stripcslashes(strip_tags($data->publish))),
            'rent' => (int)htmlentities(stripcslashes(strip_tags($data->rent))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'district' => htmlentities(stripcslashes(strip_tags($data->district))),
            'districtZone' => htmlentities(stripcslashes(strip_tags($data->districtZone))),
            'houseClass' => htmlentities(stripcslashes(strip_tags($data->houseClass))),
            'material' => htmlentities(stripcslashes(strip_tags($data->material))),
            'houseType' => htmlentities(stripcslashes(strip_tags($data->houseType))),
            'entranceHouse' => htmlentities(stripcslashes(strip_tags($data->entranceHouse))),
            'parking' => htmlentities(stripcslashes(strip_tags($data->parking))),
            'territory' => htmlentities(stripcslashes(strip_tags($data->territory))),
            'ceilingHeight' => (float)htmlentities(stripcslashes(strip_tags($data->ceilingHeight))),
            'maintenanceCost' => (float)htmlentities(stripcslashes(strip_tags($data->maintenanceCost))),
            'distanceSea' => (int)htmlentities(stripcslashes(strip_tags($data->distanceSea))),
            'gas' => htmlentities(stripcslashes(strip_tags($data->gas))),
            'heating' => htmlentities(stripcslashes(strip_tags($data->heating))),
            'electricity' => htmlentities(stripcslashes(strip_tags($data->electricity))),
            'sewerage' => htmlentities(stripcslashes(strip_tags($data->sewerage))),
            'waterSupply' => htmlentities(stripcslashes(strip_tags($data->waterSupply))),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'advantages' => is_array($data->advantages) && count($data->advantages) ? htmlentities(stripcslashes(strip_tags(implode(',', $data->advantages)))) : '',
            'payments' => is_array($data->payments) && count($data->payments) ? htmlentities(stripcslashes(strip_tags(implode(',', $data->payments)))) : '',
            'formalization' => is_array($data->formalization) && count($data->formalization) ? htmlentities(stripcslashes(strip_tags(implode(',', $data->formalization)))) : '',
            'amountContract' => htmlentities(stripcslashes(strip_tags($data->amountContract))),
            'surchargeDoc' => (float)htmlentities(stripcslashes(strip_tags($data->surchargeDoc))),
            'surchargeGas' => (float)htmlentities(stripcslashes(strip_tags($data->surchargeGas))),
            'saleNoResident' => (int)htmlentities(stripcslashes(strip_tags($data->saleNoResident))),
            'tags' => $data->tags,
            'contactUsers' => $data->contactUsers,
            'contactContacts' => $data->contactContacts,
            'developers' => $data->developers,
            'agents' => $data->agents,
            'articles' => $data->articles,
            'images' => $data->images,
            'videos' => $data->videos,
            'avatarId' => $data->avatarId && $data->images ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'avatar' => $data->avatar && $data->images ? htmlentities(stripcslashes(strip_tags($data->avatar))) : null,
            'area' => (float)htmlentities(stripcslashes(strip_tags($data->area))),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription))),
            'passed' => $data->passed ?? null,
            'rentData' => $data->rentData,
            'video' => htmlentities(stripcslashes(strip_tags($data->video))),
            'cadastrNumber' => htmlentities(stripcslashes(strip_tags($data->cadastrNumber))),
            'cadastrCost' => (float)htmlentities(stripcslashes(strip_tags($data->cadastrCost)))
        );

        try {
            $buildingData = $this->buildingModel->updateBuilding($payload);

            if ($buildingData['status']) {
                $building = $this->buildingModel->fetchBuildingById($request->id);
                LogModel::log('update', 'building', JwtMiddleware::getUserId(), $building);
                $response->code(200)->json($building);

                return;
            }

            LogModel::error('Ошибка обновления объекта.', $payload);
            $response->code(400)->json('Ошибка обновления объекта. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
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
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение графика цен объекта недвижимости по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchBuildingPricesById($request, $response)
    {
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
            $prices = $this->buildingModel->fetchBuildingPricesById($request->id);
            $response->code(200)->json($prices);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $buildingList = $this->buildingModel->fetchBuildings($filter);
            $response->code(200)->json($buildingList);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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
                LogModel::log('remove', 'building', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления объекта.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления объекта. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}