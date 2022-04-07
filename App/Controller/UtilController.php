<?php

namespace App;

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
}