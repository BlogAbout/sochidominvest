<?php

namespace App\Store;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use Exception;

/**
 * CategoryController. Контроллер категорий товаров
 */
class CategoryController extends Controller
{
    /**
     * Получение данных о категории товаров по id
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
            $category = CategoryService::fetchItemById($request->id);
            $response->code(200)->json($category);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка категорий товаров
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
            $list = CategoryService::fetchList($filter);

            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Создание категории товаров
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
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'fields' => htmlentities(stripcslashes(strip_tags($data->fields))),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription)))
        );

        try {
            $category = Category::initFromData($payload);
            $category->save();

            if ($category->getId()) {
                $response->code(201)->json($category);

                return;
            }

            LogModel::error('Ошибка создания категории товаров.', $payload);
            $response->code(400)->json('Ошибка создания категории товаров. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление категории товаров по id
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
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->dateCreated))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'author' => (int)htmlentities(stripcslashes(strip_tags($data->author))),
            'fields' => htmlentities(stripcslashes(strip_tags($data->fields))),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription)))
        );

        try {
            $category = Category::initFromData($payload);
            $category->save();

            $response->code(200)->json($category);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление категории товаров по id
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
            if (CategoryService::deleteItemFromDb($request->id)) {
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления категории товаров.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления категории товаров. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}