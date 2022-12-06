<?php

namespace App\Agent;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use Exception;

/**
 * AgentController. Контроллер агентств
 */
class AgentController extends Controller
{
    /**
     * Получение данных об агентстве по id
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

        try {
            $agent = AgentService::fetchItemById($request->id);
            $response->code(200)->json($agent);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка агентств
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
            $list = AgentService::fetchList($filter);

            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Создание агентства
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
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'address' => htmlentities(stripcslashes(strip_tags($data->address))),
            'phone' => htmlentities(stripcslashes(strip_tags($data->phone))),
            'author' => JwtMiddleware::getUserId(),
            'authorName' => htmlentities(stripcslashes(strip_tags($data->authorName))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'avatarId' => (int)htmlentities(stripcslashes(strip_tags($data->avatarId))),
            'avatar' => htmlentities(stripcslashes(strip_tags($data->authorName)))
        );

        try {
            $agent = Agent::initFromData($payload);
            $agent->save();

            if ($agent->getId()) {
                $response->code(201)->json($agent);

                return;
            }

            LogModel::error('Ошибка создания агентства.', $payload);
            $response->code(400)->json('Ошибка создания агентства. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление агентства по id
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

        $payload = array(
            'id' => $request->id,
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'address' => htmlentities(stripcslashes(strip_tags($data->address))),
            'phone' => htmlentities(stripcslashes(strip_tags($data->phone))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'authorName' => htmlentities(stripcslashes(strip_tags($data->authorName))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->dateCreated))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'avatarId' => (int)htmlentities(stripcslashes(strip_tags($data->avatarId))),
            'avatar' => htmlentities(stripcslashes(strip_tags($data->authorName)))
        );

        try {
            $agent = Agent::initFromData($payload);
            $agent->save();

            $response->code(200)->json($agent);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление агентства по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteItem($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        try {
            if (AgentService::deleteItemFromDb($request->id)) {
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления агентства.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления агентства. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}