<?php

namespace App\BusinessProcess;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use App\Payment\Payment;
use Exception;

/**
 * PaymentController. Контроллер транзакций
 */
class PaymentController extends Controller
{
    /**
     * Создание транзакции
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

        $payload = array(
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'userId' => JwtMiddleware::getUserId(),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'tariff' => htmlentities(stripcslashes(strip_tags($data->tariff)))
        );

        try {
            $payment = new Payment($payload);
            $payment->save();

            if ($payment->getId()) {
                $response->code(201)->json($payment);

                return;
            }

            LogModel::error('Ошибка создания платежа.', $payload);
            $response->code(400)->json('Ошибка создания платежа. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление транзакции по id
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
                'validator' => 'paymentExists',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
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
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->dateCreated))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'userId' => (int)htmlentities(stripcslashes(strip_tags($data->userId))),
            'email' => htmlentities(stripcslashes(strip_tags($data->email))),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'tariff' => htmlentities(stripcslashes(strip_tags($data->tariff)))
        );

        try {
            $payment = new Payment($payload);
            $payment->save();

            $response->code(200)->json($payment);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных транзакции по id
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
                'validator' => 'paymentExists',
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
            $item = Payment::fetchItem($request->id);
            $response->code(200)->json($item);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка транзакций
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchList($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        $filter = parent::getFilterParams($request->paramsGet()->all());

        try {
            $list = Payment::fetchList($filter);

            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}