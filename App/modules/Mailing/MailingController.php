<?php

namespace App\Mailing;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use Exception;

/**
 * MailingController. Контроллер рассылок
 */
class MailingController extends Controller
{
    /**
     * Получение списка получателей рассылки по id рассылки
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
            $list = RecipientService::fetchList($request->id);
            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка рассылок
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
            $list = MailingService::fetchList($filter);

            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Создание рассылки
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
            'content' => htmlentities(stripcslashes(strip_tags($data->content))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => (int)htmlentities(stripcslashes(strip_tags($data->status)))
        );

        try {
            $mailing = Mailing::initFromData($payload);
            $mailing->save();

            if ($mailing->getId()) {
                $response->code(201)->json($mailing);

                return;
            }

            LogModel::error('Ошибка создания рассылки.', $payload);
            $response->code(400)->json('Ошибка создания рассылки. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление рассылки по id
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
            'content' => htmlentities(stripcslashes(strip_tags($data->content))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'authorName' => htmlentities(stripcslashes(strip_tags($data->authorName))),
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->dateCreated))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'status' => (int)htmlentities(stripcslashes(strip_tags($data->status))),
            'countRecipients' => (int)htmlentities(stripcslashes(strip_tags($data->countRecipients)))
        );

        try {
            $mailing = Mailing::initFromData($payload);
            $mailing->save();

            $response->code(200)->json($mailing);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление рассылки по id
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
            if (MailingService::deleteItemFromDb($request->id)) {
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления рассылки.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления рассылки. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление получателя рассылки
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteRecipient($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        try {
            if (RecipientService::deleteItemFromDb($request->mailingId, $request->userId, $request->userType)) {
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления получателя рассылки.', [
                'mailingId' => $request->mailingId,
                'userId' => $request->userId,
                'userType' => $request->userType
            ]);
            $response->code(400)->json('Ошибка удаления получателя рассылки. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}