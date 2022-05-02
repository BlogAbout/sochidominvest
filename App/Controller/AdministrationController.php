<?php

namespace App;

use Exception;

/**
 * AdministrationController. Контроллер взаимодействия с моделью управления администрирования.
 */
class AdministrationController extends Controller
{
    protected $administrationModel;

    /**
     * Инициализация AdministrationController
     */
    public function __construct()
    {
        parent::__construct();

        $this->administrationModel = new AdministrationModel();
    }

    /**
     * Сохранение настроек
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function saveSettings($request, $response)
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
                'data' => $data->settings ?? '',
                'key' => 'Настройки'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = $data->settings;

        try {
            $list = $this->administrationModel->saveSettings($payload);

            LogModel::log('update', 'settings', JwtMiddleware::getUserId(), ['content' => 'Обновлены настройки администрирования']);
            $response->code(201)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка настроек
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchSettings($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        try {
            $list = $this->administrationModel->fetchSettings();
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}