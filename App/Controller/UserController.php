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
     * Создает нового пользователя
     *
     * @param mixed $request Содержит объект запроса
     * @param mixed $response Содержит объект ответа от маршрутизатора
     * @return void
     */
    public function createNewUser($request, $response)
    {
        $responseObject = [];
        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Извините, доступ к этой конечной точке разрешен только содержимому JSON.',
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
                'key' => 'First Name'
            ],
            (object)[
                'validator' => 'string',
                'data' => isset($data->firstName) ? $data->firstName : '',
                'key' => 'First Name'
            ],
            (object)[
                'validator' => 'required',
                'data' => isset($data->lastName) ? $data->lastName : '',
                'key' => 'Last Name',
            ],
            (object)[
                'validator' => 'string',
                'data' => isset($data->lastName) ? $data->lastName : '',
                'key' => 'Last Name',
            ],
            (object)[
                'validator' => 'emailExists',
                'data' => isset($data->email) ? $data->email : '',
                'key' => 'Email'
            ],
            (object)[
                'validator' => 'min:7',
                'data' => isset($data->password) ? $data->password : '',
                'key' => 'Password'
            ]
        );

        $validationBag = parent::validation($validationObject);
        if ($validationBag->status) {
            $response->code(400)->json($validationBag);

            return;
        }

        $payload = array(
            'firstName' => htmlspecialchars(stripcslashes(strip_tags($data->firstName))),
            'lastName' => htmlspecialchars(stripcslashes(strip_tags($data->lastName))),
            'email' => stripcslashes(strip_tags($data->email)),
            'password' => password_hash($data->password, PASSWORD_BCRYPT),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
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
                    "user_id" => $UserData['data']['user_id']
                );
                $Jwt = JWT::encode($tokenPayload, $tokenSecret);

                // Сохраняем JWT токен
                $TokenModel = new TokenModel();
                $TokenModel->createToken([
                    'user_id' => $UserData['data']['user_id'],
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
            $responseObject['message'] = 'Произошла непредвиденная ошибка, и ваша учетная запись не может быть создана. Пожалуйста, повторите попытку позже.';
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
    public function login($request, $response)
    {
        $responseObject = [];
        $Middleware = new RequestMiddleware();
        $Middleware = $Middleware::acceptsJson();

        if (!$Middleware) {
            array_push($responseObject, [
                'status' => 400,
                'message' => 'Извините, доступ к этой конечной точке разрешен только содержимому JSON.',
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
                'key' => 'Password'
            ],
            (object)[
                'validator' => 'min:7',
                'data' => isset($data->password) ? $data->password : '',
                'key' => 'Password'
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
                $responseObject['message'] = 'Пожалуйста, проверьте свой Email и пароль и повторите попытку.';
                $responseObject['data'] = [];
                $response->code(401)->json($responseObject);

                return;
            }

            $responseObject['status'] = 500;
            $responseObject['message'] = 'Произошла непредвиденная ошибка, и ваше действие не может быть выполнено. Пожалуйста, повторите попытку позже.';
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
}