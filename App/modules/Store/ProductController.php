<?php

namespace App\Store;

use App\Controller;
use App\JwtMiddleware;
use App\LogModel;
use Exception;

/**
 * ProductController. Контроллер товаров
 */
class ProductController extends Controller
{
    /**
     * Получение данных о товаре по id
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
            $product = ProductService::fetchItemById($request->id);
            $response->code(200)->json($product);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Получение списка товаров
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
            $list = ProductService::fetchList($filter);

            $response->code(200)->json($list);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Создание товара
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
            'categoryId' => (int)htmlentities(stripcslashes(strip_tags($data->categoryId))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'costOld' => (float)htmlentities(stripcslashes(strip_tags($data->costOld))),
            'avatarId' => $data->avatarId && $data->images ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'avatar' => $data->avatar && $data->images ? htmlentities(stripcslashes(strip_tags($data->avatar))) : null,
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'author' => JwtMiddleware::getUserId(),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription))),
            'fields' => htmlentities(stripcslashes(strip_tags($data->fields))),
            'images' => $data->images,
            'videos' => $data->videos
        );

        try {
            $product = Product::initFromData($payload);
            $product->save();

            if ($product->getId()) {
                $response->code(201)->json($product);

                return;
            }

            LogModel::error('Ошибка создания товара.', $payload);
            $response->code(400)->json('Ошибка создания товара. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Обновление товара по id
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
            'categoryId' => (int)htmlentities(stripcslashes(strip_tags($data->categoryId))),
            'name' => htmlentities(stripcslashes(strip_tags($data->name))),
            'description' => htmlentities(stripcslashes(strip_tags($data->description))),
            'cost' => (float)htmlentities(stripcslashes(strip_tags($data->cost))),
            'costOld' => (float)htmlentities(stripcslashes(strip_tags($data->costOld))),
            'avatarId' => $data->avatarId && $data->images ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'avatar' => $data->avatar && $data->images ? htmlentities(stripcslashes(strip_tags($data->avatar))) : null,
            'dateCreated' => htmlentities(stripcslashes(strip_tags($data->dateCreated))),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'author' => JwtMiddleware::getUserId(),
            'metaTitle' => htmlentities(stripcslashes(strip_tags($data->metaTitle))),
            'metaDescription' => htmlentities(stripcslashes(strip_tags($data->metaDescription))),
            'fields' => htmlentities(stripcslashes(strip_tags($data->fields))),
            'images' => $data->images,
            'videos' => $data->videos
        );

        try {
            $product = Product::initFromData($payload);
            $product->save();

            $response->code(200)->json($product);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Удаление товара по id
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
            if (ProductService::deleteItemFromDb($request->id)) {
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления товара.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления товара. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }
}