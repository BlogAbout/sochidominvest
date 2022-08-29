<?php

namespace App\Booking;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use Exception;

/**
 * BookingController. Контроллер бронирования
 */
class BookingController extends Controller
{
    /**
     * Создание бронирования
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
            'dateStart' => htmlentities(stripcslashes(strip_tags($data->dateStart))),
            'dateFinish' => htmlentities(stripcslashes(strip_tags($data->dateFinish))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'buildingId' => (int)htmlentities(stripcslashes(strip_tags($data->buildingId))),
            'userId' => JwtMiddleware::getUserId()
        );

        try {
            $booking = new Booking($payload);
            $booking->save();

            if ($booking->getId()) {
                $response->code(201)->json($booking);

                return;
            }

            LogModel::error('Ошибка создания бронирования.', $payload);
            $response->code(400)->json('Ошибка создания бронирования. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление бронирования по id
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
                'validator' => 'bookingExists',
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
            'dateStart' => htmlentities(stripcslashes(strip_tags($data->dateStart))),
            'dateFinish' => htmlentities(stripcslashes(strip_tags($data->dateFinish))),
            'status' => htmlentities(stripcslashes(strip_tags($data->status))),
            'buildingId' => (int)htmlentities(stripcslashes(strip_tags($data->buildingId))),
            'userId' => (int)htmlentities(stripcslashes(strip_tags($data->userId)))
        );

        try {
            $booking = new Booking($payload);
            $booking->save();

            $response->code(200)->json($booking);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка бронирования
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
            $list = Booking::fetchList($filter);

            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}