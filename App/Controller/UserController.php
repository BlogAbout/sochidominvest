<?php

namespace App;

use Exception;
use Firebase\JWT\JWT;

/**
 * UserController. Этот контроллер использует несколько моделей для создания, обновления, получения и удаления пользователей
 */
class UserController extends Controller
{
    /**
     * Регистрирует пользователя
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function signUp($request, $response)
    {
        $responseObject = [];
        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Доступ к конечной точке разрешен только содержимому JSON.',
                'data' => []
            ]);

            $response->code(400)->json($responseObject);

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($data->firstName) ? $data->firstName : '',
                'key' => 'Имя'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->phone) ? $data->phone : '',
                'key' => 'Телефон',
            ],
            (object)[
                'validator' => 'emailExists',
                'data' => isset($data->email) ? $data->email : '',
                'key' => 'Email'
            ],
            (object)[
                'validator' => 'min:6',
                'data' => isset($data->password) ? $data->password : '',
                'key' => 'Пароль'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'firstName' => htmlspecialchars(stripcslashes(strip_tags($data->firstName))),
            'email' => stripcslashes(strip_tags($data->email)),
            'phone' => htmlspecialchars(stripcslashes(strip_tags($data->phone))),
            'password' => password_hash($data->password, PASSWORD_BCRYPT),
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
            'lastActive' => date('Y-m-d H:i:s'),
            'active' => 1,
            'role' => 'subscriber',
            'settings' => ''
        );

        try {
            $UserModel = new UserModel();
            $UserData = $UserModel::createUser($payload);

            if ($UserData['status']) {
                // Инициализируем JWT токен
                $tokenExp = date('Y-m-d H:i:s');
                $tokenSecret = parent::JWTSecret();
                $tokenPayload = array(
                    'iat' => time(),
                    'iss' => 'PHP_MINI_REST_API', // Fixme: !!Modify:: Modify this to come from a constant
                    "exp" => strtotime('+ 7 Days'),
                    "user_id" => $UserData['data']['userId']
                );
                $Jwt = JWT::encode($tokenPayload, $tokenSecret);

                // Сохраняем JWT токен
                $TokenModel = new TokenModel();
                $TokenModel->createToken([
                    'user_id' => $UserData['data']['userId'],
                    'jwt_token' => $Jwt
                ]);
                $UserData['data']['token'] = $Jwt;

                // Возвращаем ответ
                $responseObject['status'] = 201;
                $responseObject['message'] = '';
                $responseObject['data'] = $UserData;

                $response->code(201)->json($responseObject);

                return;
            }

            $responseObject['status'] = 500;
            $responseObject['message'] = 'Непредвиденная ошибка. Ваша учетная запись не может быть создана. Повторите попытку позже.';
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Авторизует нового пользователя
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function signIn($request, $response)
    {
        $responseObject = [];
        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Доступ к конечной точке разрешен только содержимому JSON.',
                'data' => []
            ]);

            $response->code(400)->json($responseObject);

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($data->email) ? $data->email : '',
                'key' => 'Email'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->password) ? $data->password : '',
                'key' => 'Пароль'
            ],
            (object)[
                'validator' => 'min:6',
                'data' => isset($data->password) ? $data->password : '',
                'key' => 'Пароль'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'email' => stripcslashes(strip_tags($data->email)),
            'password' => $data->password,
            'updated_at' => date('Y-m-d H:i:s')
        );

        try {
            $UserModel = new UserModel();
            $UserData = $UserModel::checkEmail($payload['email']);

            if ($UserData['status']) {
                if (password_verify($payload['password'], $UserData['data']['password'])) {
                    // Инициализируем JWT токен
                    $tokenExp = date('Y-m-d H:i:s');
                    $tokenSecret = parent::JWTSecret();
                    $tokenPayload = array(
                        'iat' => time(),
                        'iss' => 'PHP_MINI_REST_API', //!!Modify:: Modify this to come from a constant
                        "exp" => strtotime('+ 7 Days'),
                        "user_id" => $UserData['data']['id']
                    );
                    $Jwt = JWT::encode($tokenPayload, $tokenSecret);

                    // Сохраняем JWT токен
                    $TokenModel = new TokenModel();
                    $TokenModel->createToken([
                        'user_id' => $UserData['data']['id'],
                        'jwt_token' => $Jwt
                    ]);
                    $UserData['data']['token'] = $Jwt;

                    // Возвращаем ответ
                    $responseObject['status'] = 201;
                    $responseObject['message'] = '';
                    $responseObject['data'] = $UserData;

                    $response->code(201)->json($responseObject);

                    return;
                }

                $responseObject['status'] = 401;
                $responseObject['message'] = 'Проверьте свой Email и пароль и повторите попытку.';
                $responseObject['data'] = [];
                $response->code(401)->json($responseObject);

                return;
            }

            $responseObject['status'] = 500;
            $responseObject['message'] = 'Непредвиденная ошибка. Ваше действие не может быть выполнено. Повторите попытку позже.';
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Создание пользователя
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createUser($request, $response)
    {
        $responseObject = [];

        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Доступ к конечной точке разрешен только содержимому JSON.',
                'data' => []
            ]);

            $response->code(400)->json($responseObject);

            return;
        }

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($data->firstName) ? $data->firstName : '',
                'key' => 'Имя'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->phone) ? $data->phone : '',
                'key' => 'Телефон',
            ],
            (object)[
                'validator' => 'emailExists',
                'data' => isset($data->email) ? $data->email : '',
                'key' => 'Email'
            ],
            (object)[
                'validator' => 'min:6',
                'data' => isset($data->password) ? $data->password : '',
                'key' => 'Пароль'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'firstName' => htmlspecialchars(stripcslashes(strip_tags($data->firstName))),
            'email' => stripcslashes(strip_tags($data->email)),
            'phone' => htmlspecialchars(stripcslashes(strip_tags($data->phone))),
            'password' => password_hash($data->password, PASSWORD_BCRYPT),
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
            'lastActive' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'role' => htmlspecialchars(stripcslashes(strip_tags($data->role))),
            'settings' => ''
        );

        try {
            $UserModel = new UserModel();
            $user = $UserModel::createUser($payload);

            if ($user['status']) {
                $responseObject['status'] = 201;
                $responseObject['data'] = $user['data'];
                $responseObject['message'] = '';

                $response->code(201)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Пользователь не может быть создан. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Обновление пользователя по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function updateUser($request, $response)
    {
        $responseObject = [];

        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Доступ к конечной точке разрешен только содержимому JSON.',
                'data' => []
            ]);

            $response->code(400)->json($responseObject);

            return;
        }

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'userExists',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->firstName) ? $data->firstName : '',
                'key' => 'Имя'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->phone) ? $data->phone : '',
                'key' => 'Телефон',
            ],
            (object)[
                'validator' => 'emailExists',
                'data' => isset($data->email) ? $data->email : '',
                'key' => 'Email',
                'id' => $request->id
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'id' => $request->id,
            'firstName' => htmlspecialchars(stripcslashes(strip_tags($data->firstName))),
            'email' => stripcslashes(strip_tags($data->email)),
            'phone' => htmlspecialchars(stripcslashes(strip_tags($data->phone))),
            'password' => password_hash($data->password, PASSWORD_BCRYPT),
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
            'lastActive' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'role' => htmlspecialchars(stripcslashes(strip_tags($data->role))),
            'settings' => ''
        );

        try {
            $UserModel = new UserModel();
            $user = $UserModel::updateUser($payload);

            if ($user['status']) {
                $building['data'] = $UserModel::fetchUserById($request->id)['data'];
                $responseObject['status'] = 200;
                $responseObject['data'] = $building['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Пользователь не может быть обновлен. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Получение данных пользователя по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function getUserById($request, $response)
    {
        $responseObject = [];

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'userExists',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        try {
            $UserModel = new UserModel();
            $user = $UserModel::fetchUserById($request->id);

            if ($user['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = $user['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось получить данные пользователя. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Получение списка пользователей
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function fetchUsers($request, $response)
    {
        $responseObject = [];

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        try {
            $UserModel = new UserModel();
            $user = $UserModel::fetchUsers();

            if ($user['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = $user['data'];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось получить данные пользователей. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }

    /**
     * Удаление пользователя по id
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function deleteUser($request, $response)
    {
        $responseObject = [];

        $JwtMiddleware = new JwtMiddleware();
        $jwtMiddleware = $JwtMiddleware->getAndDecodeToken();
        if (isset($jwtMiddleware) && $jwtMiddleware == false) {
            $response->code(400)->json([
                'status' => 401,
                'message' => 'Вы не авторизованы.',
                'data' => []
            ]);

            return;
        }

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ],
            (object)[
                'validator' => 'userExists',
                'data' => isset($request->id) ? $request->id : '',
                'key' => 'Идентификатор'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        try {
            $UserModel = new UserModel();
            $user = $UserModel::deleteUser($request->id);

            if ($user['status']) {
                $responseObject['status'] = 200;
                $responseObject['data'] = [];
                $responseObject['message'] = '';

                $response->code(200)->json($responseObject);

                return;
            }

            $responseObject['status'] = 400;
            $responseObject['data'] = [];
            $responseObject['message'] = 'Непредвиденная ошибка. Не удалось удалить пользователя. Повторите попытку позже.';

            $response->code(400)->json($responseObject);

            return;
        } catch (Exception $e) {
            $responseObject['status'] = 500;
            $responseObject['message'] = $e->getMessage();
            $responseObject['data'] = [];

            $response->code(500)->json($responseObject);

            return;
        }
    }
}