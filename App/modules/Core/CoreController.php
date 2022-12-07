<?php

namespace App\Core;

use App\Controller;
use App\LogModel;
use Exception;

/**
 * CoreController. Контроллер ядра
 */
class CoreController extends Controller
{
    /**
     * Запуск всех проверок
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function initAllChecking($request, $response)
    {
        try {
            $coreService = new CoreService($this->settings);
            $coreService->checkExpiredDateUsers();

            $response->code(200)->json('');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}