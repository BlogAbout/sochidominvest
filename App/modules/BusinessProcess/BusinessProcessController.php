<?php

namespace App\BusinessProcess;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use App\UtilModel;
use Exception;

/**
 * BusinessProcessController. Контроллер бизнес-процессов
 */
class BusinessProcessController extends Controller
{
    /**
     * Создание бизнес-процесса
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
            'ticketId' => (int)htmlentities(stripcslashes(strip_tags($data->ticketId))),
            'author' => JwtMiddleware::getUserId(),
            'responsible' => (int)htmlentities(stripcslashes(strip_tags($data->responsible))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'step' => htmlentities(stripcslashes(strip_tags($data->step))),
            'ordering' => (int)htmlentities(stripcslashes(strip_tags($data->ordering))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'dateCreated' => UtilModel::getDateNow(),
            'dateUpdate' => UtilModel::getDateNow(),
            'relations' => $data->relations,
            'attendees' => $data->attendees
        );

        try {
            $businessProcess = new BusinessProcess($payload);
            $businessProcess->save();

            if ($businessProcess->getId()) {
                // Todo: LogModel::log('create', 'businessProcess', JwtMiddleware::getUserId(), $businessProcess);
                $response->code(201)->json($businessProcess);

                return;
            }

            LogModel::error('Ошибка создания бизнес-процесса.', $payload);
            $response->code(400)->json('Ошибка создания бизнес-процесса. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление бизнес-процесса по id
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
                'validator' => 'businessProcessExists',
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
            'ticketId' => (int)htmlentities(stripcslashes(strip_tags($data->ticketId))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'responsible' => (int)htmlentities(stripcslashes(strip_tags($data->responsible))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'type' => htmlentities(stripcslashes(strip_tags($data->type))),
            'step' => htmlentities(stripcslashes(strip_tags($data->step))),
            'ordering' => (int)htmlentities(stripcslashes(strip_tags($data->ordering))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->dateCreated))),
            'dateUpdate' => UtilModel::getDateNow(),
            'relations' => $data->relations,
            'attendees' => $data->attendees
        );

        try {
            $businessProcess = new BusinessProcess($payload);
            $businessProcess->save();

            // Todo: LogModel::log('update', 'businessProcess', JwtMiddleware::getUserId(), $businessProcess);
            $response->code(200)->json($businessProcess);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение данных бизнес-процесса по id
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
                'validator' => 'businessProcessExists',
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
            $item = BusinessProcess::fetchItem($request->id);
            $response->code(200)->json($item);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка бизнес-процессов
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
            $list = BusinessProcess::fetchList($filter);
            $ordering = BusinessProcess::fetchOrdering(JwtMiddleware::getUserId());
            $response->code(200)->json([
                'list' => $list,
                'ordering' => $ordering
            ]);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление бизнес-процесса по id
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

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $request->id ?? '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'businessProcessExists',
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
            if (BusinessProcess::deleteItem($request->id)) {
                LogModel::log('remove', 'businessProcess', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления бизнес-процесса.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления бизнес-процесса. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление сортировки и уровней бизнес-процессов
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateBusinessProcessesOrdering($request, $response)
    {
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        $data = json_decode($request->body());

        $payload = array(
            'id' => (int)htmlentities(stripcslashes(strip_tags($data->bp->id))),
            'ticketId' => (int)htmlentities(stripcslashes(strip_tags($data->bp->ticketId))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->bp->author))),
            'responsible' => (int)htmlentities(stripcslashes(strip_tags($data->bp->responsible))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->bp->active))),
            'type' => htmlentities(stripcslashes(strip_tags($data->bp->type))),
            'step' => htmlentities(stripcslashes(strip_tags($data->bp->step))),
            'ordering' => (int)htmlentities(stripcslashes(strip_tags($data->bp->ordering))),
            'name' => htmlentities(stripcslashes(strip_tags($data->bp->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->bp->description))),
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->bp->dateCreated))),
            'dateUpdate' => UtilModel::getDateNow(),
            'relations' => $data->bp->relations,
            'attendees' => $data->bp->attendees
        );

        try {
            $businessProcess = new BusinessProcess($payload);
            $businessProcess->save();

            BusinessProcess::updateOrdering($data->ids, JwtMiddleware::getUserId());

            $response->code(200)->json(BusinessProcess::fetchOrdering(JwtMiddleware::getUserId()));

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}