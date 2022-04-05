<?php

namespace App;

use Exception;
use Firebase\JWT\JWT;

/**
 * UserController. Этот контроллер использует несколько моделей для создания, обновления, получения и удаления пользователей
 */
class UserController extends Controller
{
    protected $userModel;

    /**
     * Инициализация UserController
     */
    public function __construct()
    {
        parent::__construct();

        $this->userModel = new UserModel();
    }

    /**
     * Регистрация пользователя
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function signUp($request, $response)
    {
        if (!$this->requestMiddleware->acceptsJson()) {
            $response->code(400)->json('Доступ к конечной точке разрешен только содержимому JSON.');

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $data->firstName ?? '',
                'key' => 'Имя'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->phone ?? '',
                'key' => 'Телефон',
            ],
            (object)[
                'validator' => 'emailExists',
                'data' => $data->email ?? '',
                'key' => 'Email'
            ],
            (object)[
                'validator' => 'min:6',
                'data' => $data->password ?? '',
                'key' => 'Пароль'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'firstName' => htmlspecialchars(stripcslashes(strip_tags($data->firstName))),
            'email' => stripcslashes(strip_tags($data->email)),
            'phone' => htmlspecialchars(stripcslashes(strip_tags($data->phone))),
            'password' => password_hash($data->password, PASSWORD_BCRYPT),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'lastActive' => date('Y-m-d H:i:s'),
            'active' => 1,
            'role' => htmlspecialchars(stripcslashes(strip_tags($data->role))),
            'settings' => ''
        );

        try {
            $userData = $this->userModel->createUser($payload);

            if ($userData['status']) {
                $userData['data']['token'] = $this->createUserToken($userData['data']['id']);
                unset($userData['data']['password']);

                $response->code(201)->json($userData['data']);

                return;
            }

            $response->code(500)->json('Ошибка создания учетной записи. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Авторизация пользователя
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function signIn($request, $response)
    {
        if (!$this->requestMiddleware->acceptsJson()) {
            $response->code(400)->json('Доступ к конечной точке разрешен только содержимому JSON.');

            return;
        }

        $data = json_decode($request->body());

        $validationObject = array(
            (object)[
                'validator' => 'required',
                'data' => $data->email ?? '',
                'key' => 'Email'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->password ?? '',
                'key' => 'Пароль'
            ],
            (object)[
                'validator' => 'min:6',
                'data' => $data->password ?? '',
                'key' => 'Пароль'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'email' => stripcslashes(strip_tags($data->email)),
            'password' => $data->password,
            'date_update' => date('Y-m-d H:i:s')
        );

        try {
            $userData = $this->userModel->checkEmail($payload['email']);

            if ($userData['status']) {
                if ($userData['data']['block'] === 1) {
                    $response->code(400)->json('Аккаунт заблокирован. За подробностями обратитесь к администрации системы.');

                    return;
                }

                if (password_verify($payload['password'], $userData['data']['password'])) {
                    $userData['data']['token'] = $this->createUserToken($userData['data']['id']);
                    unset($userData['data']['password']);

                    $response->code(201)->json($userData['data']);

                    return;
                }

                $response->code(400)->json('Неверные Email или пароль.');

                return;
            }

            $response->code(500)->json('Непредвиденная ошибка. Ваше действие не может быть выполнено. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

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
                'data' => $data->firstName ?? '',
                'key' => 'Имя'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->phone ?? '',
                'key' => 'Телефон',
            ],
            (object)[
                'validator' => 'emailExists',
                'data' => $data->email ?? '',
                'key' => 'Email'
            ],
            (object)[
                'validator' => 'min:6',
                'data' => $data->password ?? '',
                'key' => 'Пароль'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'firstName' => htmlspecialchars(stripcslashes(strip_tags($data->firstName))),
            'email' => stripcslashes(strip_tags($data->email)),
            'phone' => htmlspecialchars(stripcslashes(strip_tags($data->phone))),
            'password' => password_hash($data->password, PASSWORD_BCRYPT),
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'lastActive' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'role' => htmlspecialchars(stripcslashes(strip_tags($data->role))),
            'settings' => ''
        );

        try {
            $userData = $this->userModel->createUser($payload);

            if ($userData['status']) {
                unset($userData['data']['password']);

                $response->code(201)->json($userData['data']);

                return;
            }

            $response->code(400)->json('Непредвиденная ошибка. Пользователь не может быть создан. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

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
                'validator' => 'userExists',
                'data' => $request->id ?? ''
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->firstName ?? '',
                'key' => 'Имя'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->phone ?? '',
                'key' => 'Телефон',
            ],
            (object)[
                'validator' => 'emailExists',
                'data' => $data->email ?? '',
                'key' => 'Email',
                'id' => $request->id
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        $payload = array(
            'id' => $request->id,
            'firstName' => htmlspecialchars(stripcslashes(strip_tags($data->firstName))),
            'email' => stripcslashes(strip_tags($data->email)),
            'phone' => htmlspecialchars(stripcslashes(strip_tags($data->phone))),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'active' => (int)htmlentities(stripcslashes(strip_tags($data->active))),
            'block' => (int)htmlentities(stripcslashes(strip_tags($data->block))),
            'role' => htmlspecialchars(stripcslashes(strip_tags($data->role))),
            'settings' => ''
        );

        if ($data->password) {
            $payload['password'] = password_hash($data->password, PASSWORD_BCRYPT);
        }

        try {
            $userData = $this->userModel->updateUser($payload);

            if ($userData['status']) {
                $user = $this->userModel->fetchUserById($request->id);
                unset($user['password']);

                $response->code(200)->json($user);

                return;
            }

            $response->code(400)->json('Непредвиденная ошибка. Пользователь не может быть обновлен. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

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
                'validator' => 'userExists',
                'data' => $request->id ?? ''
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        try {
            $user = $this->userModel->fetchUserById($request->id);
            $response->code(200)->json($user);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

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
        if (!JwtMiddleware::getAndDecodeToken()) {
            $response->code(401)->json('Вы не авторизованы.');

            return;
        }

        try {
            $userList = $this->userModel->fetchUsers();
            $response->code(200)->json($userList);

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

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
                'validator' => 'userExists',
                'data' => $request->id ?? ''
            ],
            (object)[
                'validator' => 'userNotDirector',
                'data' => $request->id ?? ''
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        try {
            if ($this->userModel->deleteUser($request->id)) {
                $response->code(200)->json('');

                return;
            }

            $response->code(400)->json('Ошибка удаления пользователя. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * @param int $userId
     * @return string
     */
    private function createUserToken(int $userId): string
    {
        $tokenSecret = parent::JWTSecret();

        $tokenPayload = array(
            'iat' => time(),
            'iss' => 'PHP_MINI_REST_API', // Fixme: !!Modify:: Modify this to come from a constant
            'exp' => strtotime('+ 7 Days'),
            'user_id' => $userId
        );

        $jwt = JWT::encode($tokenPayload, $tokenSecret);

        TokenModel::createTokenDb([
            'user_id' => $userId,
            'jwt_token' => $jwt
        ]);

        return $jwt;
    }
}