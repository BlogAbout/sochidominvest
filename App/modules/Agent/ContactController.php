<?php

namespace App\Agent;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use Exception;

/**
 * ContactController. Контроллер контактов агентства
 */
class ContactController extends Controller
{
    /**
     * Получение данных о контакте по id
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
            $contact = ContactService::fetchItemById($request->id);
            $response->code(200)->json($contact);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка контактов
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
            $list = ContactService::fetchList($filter);

            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Создание контакта
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
            'agentId' => (int)htmlentities(stripcslashes(strip_tags($data->agentId))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'post' => htmlentities(stripcslashes(strip_tags($data->post))),
            'phone' => htmlentities(stripcslashes(strip_tags($data->phone))),
            'author' => JwtMiddleware::getUserId(),
            'authorName' => htmlentities(stripcslashes(strip_tags($data->authorName))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active)))
        );

        try {
            $contact = Contact::initFromData($payload);
            $contact->save();

            if ($contact->getId()) {
                $response->code(201)->json($contact);

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
     * Обновление контакта по id
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
            'agentId' => (int)htmlentities(stripcslashes(strip_tags($data->agentId))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'post' => htmlentities(stripcslashes(strip_tags($data->post))),
            'phone' => htmlentities(stripcslashes(strip_tags($data->phone))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'authorName' => htmlentities(stripcslashes(strip_tags($data->authorName))),
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->dateCreated))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active)))
        );

        try {
            $contact = Contact::initFromData($payload);
            $contact->save();

            $response->code(200)->json($contact);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление контакта по id
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
            if (ContactService::deleteItemFromDb($request->id)) {
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления контакта.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления контакта. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}