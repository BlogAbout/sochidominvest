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

        $this->userModel = new UserModel($this->settings);
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
            'passwordDefault' => $data->password,
            'dateCreated' => date('Y-m-d H:i:s'),
            'dateUpdate' => date('Y-m-d H:i:s'),
            'lastActive' => date('Y-m-d H:i:s'),
            'active' => 1,
            'role' => 'subscriber',
            'settings' => '{"notifyNewAction":1,"soundAlert":1,"pushNotify":1,"notifyEdit":1,"notifyNewItem":1,"pushMessenger":1,"sendEmail":1}',
            'tariff' => 'free',
            'tariffExpired' => date('Y-m-d H:i:s')
        );

        try {
            $userData = $this->userModel->createUser($payload);

            if ($userData['status']) {
                $userData['data']['token'] = $this->createUserToken($userData['data']['id']);
                unset($userData['data']['password']);

                $response->code(201)->json($userData['data']);

                return;
            }

            LogModel::error('Ошибка создания учетной записи.', $payload);
            $response->code(500)->json('Ошибка создания учетной записи. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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

            LogModel::error('Непредвиденная ошибка.', $payload);
            $response->code(500)->json('Непредвиденная ошибка. Ваше действие не может быть выполнено. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Восстановление пароля
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function forgotPassword($request, $response)
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
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        try {
            $email = stripcslashes(strip_tags($data->email));

            $userByEmail = UserModel::checkEmail($email);

            if ($userByEmail['status']) {
                $code = $this->userModel->forgotPassword($email);

                $response->code(201)->json($code);
            } else {
                $response->code(500)->json('Пользователь с таким E-mail не существует.');
            }
        } catch (Exception $e) {
            $response->code(500)->json($e->getMessage());

            return;
        }
    }

    /**
     * Смена пароля
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function resetPassword($request, $response)
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
                'key' => 'E-mail'
            ],
            (object)[
                'validator' => 'required',
                'data' => $data->password ?? '',
                'key' => 'Пароль'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag->errors);

            return;
        }

        try {
            $payload = array(
                'password' => password_hash($data->password, PASSWORD_BCRYPT),
                'email' => stripcslashes(strip_tags($data->email))
            );

            if ($this->userModel->resetPassword($payload)) {
                $userData = $this->userModel->checkEmail($payload['email']);

                if ($userData['status']) {
                    if ($userData['data']['block'] === 1) {
                        $response->code(400)->json('Аккаунт заблокирован. За подробностями обратитесь к администрации системы.');

                        return;
                    }

                    if (password_verify($data->password, $userData['data']['password'])) {
                        $userData['data']['token'] = $this->createUserToken($userData['data']['id']);
                        unset($userData['data']['password']);

                        $response->code(201)->json($userData['data']);

                        return;
                    }

                    $response->code(400)->json('Неверные Email или пароль.');

                    return;
                }

                LogModel::error('Непредвиденная ошибка.', $payload);
                $response->code(500)->json('Непредвиденная ошибка. Ваше действие не может быть выполнено. Повторите попытку позже.');
            } else {
                $response->code(201)->json('Ошибка назначения нового пароля. Попробуйте пройти процедуру восстановления снова.');
            }

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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
            'avatarId' => $data->avatarId ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'settings' => '{"notifyNewAction":1,"soundAlert":1,"pushNotify":1,"notifyEdit":1,"notifyNewItem":1,"pushMessenger":1,"sendEmail":1}',
            'post' => $data->post ? (int)htmlentities(stripcslashes(strip_tags($data->post))) : null,
            'tariff' => 'free',
            'tariffExpired' => date('Y-m-d H:i:s')
        );

        try {
            $userData = $this->userModel->createUser($payload);

            if ($userData['status']) {
                unset($userData['data']['password']);
                LogModel::log('create', 'user', JwtMiddleware::getUserId(), $userData['data']);
                $response->code(201)->json($userData['data']);

                return;
            }

            LogModel::error('Непредвиденная ошибка. Пользователь не может быть создан.', $payload);
            $response->code(400)->json('Непредвиденная ошибка. Пользователь не может быть создан. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
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
            'avatarId' => $data->avatarId ? (int)htmlentities(stripcslashes(strip_tags($data->avatarId))) : null,
            'settings' => $data->settings ? json_encode($data->settings) : '',
            'post' => $data->post ? (int)htmlentities(stripcslashes(strip_tags($data->post))) : null,
            'tariff' => htmlspecialchars(stripcslashes(strip_tags($data->tariff))),
            'tariffExpired' => htmlspecialchars(stripcslashes(strip_tags($data->tariffExpired)))
        );

        if ($data->password) {
            $payload['password'] = password_hash($data->password, PASSWORD_BCRYPT);
        }

        try {
            $userData = $this->userModel->updateUser($payload);

            if ($userData['status']) {
                $user = $this->userModel->fetchUserById($request->id);
                LogModel::log('update', 'user', JwtMiddleware::getUserId(), $user);
                unset($user['password']);

                $response->code(200)->json($user);

                return;
            }

            LogModel::error('Непредвиденная ошибка. Пользователь не может быть обновлен.', $payload);
            $response->code(400)->json('Непредвиденная ошибка. Пользователь не может быть обновлен. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage(), $payload);
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
            unset($user['password']);

            $response->code(200)->json($user);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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
            $userList = $this->userModel->fetchUsers(['active' => [0, 1]]);
            $response->code(200)->json($userList);

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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
                LogModel::log('remove', 'user', JwtMiddleware::getUserId(), ['id' => $request->id]);
                $response->code(200)->json('');

                return;
            }

            LogModel::error('Ошибка удаления пользователя.', ['id' => $request->id]);
            $response->code(400)->json('Ошибка удаления пользователя. Повторите попытку позже.');

            return;
        } catch (Exception $e) {
            LogModel::error($e->getMessage());
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