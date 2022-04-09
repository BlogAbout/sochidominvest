<?php

namespace App;

use Exception;

/**
 * UtilController. Содержит точки доступа для дополнительных функций
 */
class UtilController extends Controller
{
    protected $utilModel;

    /**
     * Инициализация UtilController
     */
    public function __construct()
    {
        parent::__construct();

        $this->utilModel = new UtilModel();
    }

    /**
     * Обновление счетчика просмотра объекта
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateCountViews($request, $response)
    {
        $objectType = $request->objectType ?? '';
        $objectId = $request->objectId ?? 0;

        if ($objectId && $objectType) {
            $this->utilModel->updateCountViews($objectId, $objectType);
        }

        $response->code(200)->json('');
    }

    /**
     * Получение списка логов
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchLogs($request, $response)
    {
        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $list = LogModel::fetchLogs($filter);
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}