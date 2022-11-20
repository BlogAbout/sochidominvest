<?php

namespace App\Payment;

use HttpException;

class TinkoffMerchantAPI
{
    private string $apiUrl;
    private string $terminalKey;
    private string $secretKey;
    private $paymentId;
    private $status;
    private $error;
    private $response;
    private $paymentUrl;

    public function __construct(string $terminalKey, string $secretKey)
    {
        $this->apiUrl = 'https://securepay.tinkoff.ru/v2/';
        $this->terminalKey = $terminalKey;
        $this->secretKey = $secretKey;
    }

    public function __get($name)
    {
        switch ($name) {
            case 'paymentId':
                return $this->paymentId;
            case 'status':
                return $this->status;
            case 'error':
                return $this->error;
            case 'paymentUrl':
                return $this->paymentUrl;
            case 'response':
                return htmlentities($this->response);
            default:
                if ($this->response) {
                    if ($json = json_decode($this->response, true)) {
                        foreach ($json as $key => $value) {
                            if (strtolower($name) == strtolower($key)) {
                                return $json[$key];
                            }
                        }
                    }
                }

                return false;
        }
    }

    /**
     * @param $args array You could use associative array or url params string
     * @return bool
     * @throws HttpException
     */
    public function init(array $args): bool
    {
        return $this->buildQuery('Init', $args);
    }

    /**
     * @throws \HttpException
     */
    public function getState(array $args): string
    {
        return $this->buildQuery('GetState', $args);
    }

    /**
     * @throws \HttpException
     */
    public function confirm(array $args): string
    {
        return $this->buildQuery('Confirm', $args);
    }

    /**
     * @throws \HttpException
     */
    public function charge(array $args): string
    {
        return $this->buildQuery('Charge', $args);
    }

    /**
     * @throws \HttpException
     */
    public function addCustomer(array $args): string
    {
        return $this->buildQuery('AddCustomer', $args);
    }

    /**
     * @throws \HttpException
     */
    public function getCustomer(array $args): string
    {
        return $this->buildQuery('GetCustomer', $args);
    }

    /**
     * @throws \HttpException
     */
    public function removeCustomer(array $args): string
    {
        return $this->buildQuery('RemoveCustomer', $args);
    }

    /**
     * @throws \HttpException
     */
    public function getCardList(array $args): string
    {
        return $this->buildQuery('GetCardList', $args);
    }

    /**
     * @throws \HttpException
     */
    public function removeCard(array $args): string
    {
        return $this->buildQuery('RemoveCard', $args);
    }

    /**
     * Builds a query string and call sendRequest method.
     * Could be used to custom API call method.
     *
     * @param string $path API method name
     * @param array $args query params
     *
     * @return string
     * @throws HttpException
     */
    public function buildQuery(string $path, array $args): string
    {
        $url = $this->apiUrl;
        if (is_array($args)) {
            if (!array_key_exists('TerminalKey', $args)) {
                $args['TerminalKey'] = $this->terminalKey;
            }
            if (!array_key_exists('Token', $args)) {
                $args['Token'] = $this->_genToken($args);
            }
        }
        $url = $this->_combineUrl($url, $path);


        return $this->_sendRequest($url, $args);
    }

    /**
     * Generates Token
     *
     * @param array $args
     * @return string
     */
    private function _genToken(array $args): string
    {
        $token = '';
        $args['Password'] = $this->secretKey;
        ksort($args);

        foreach ($args as $arg) {
            if (!is_array($arg)) {
                $token .= $arg;
            }
        }

        $token = hash('sha256', $token);

        return $token;
    }

    /**
     * Combines parts of URL. Simply gets all parameters and puts '/' between
     *
     * @return string
     */
    private function _combineUrl(): string
    {
        $args = func_get_args();
        $url = '';
        foreach ($args as $arg) {
            if (is_string($arg)) {
                if ($arg[strlen($arg) - 1] !== '/') $arg .= '/';
                $url .= $arg;
            }
        }

        return $url;
    }

    /**
     * MainPage method. Call API with params
     *
     * @param string $apiUrl
     * @param array $args
     * @return string
     * @throws HttpException
     */
    private function _sendRequest(string $apiUrl, array $args): string
    {
        $this->error = '';
        if (is_array($args)) {
            $args = json_encode($args);
        }

        if ($curl = curl_init()) {
            curl_setopt($curl, CURLOPT_URL, $apiUrl);
            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $args);
            curl_setopt($curl, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
            ));

            $out = curl_exec($curl);
            $this->response = $out;
            $json = json_decode($out);

            if ($json) {
                if (@$json->ErrorCode !== "0") {
                    $this->error = @$json->Details;
                } else {
                    $this->paymentUrl = @$json->PaymentURL;
                    $this->paymentId = @$json->PaymentId;
                    $this->status = @$json->Status;
                }
            }

            curl_close($curl);

            return $out;

        } else {
            throw new HttpException('Can not create connection to ' . $apiUrl . ' with args ' . $args, 404);
        }
    }

    public function getTaxation(string $taxation): string
    {
        $taxations = [
            'osn' => 'osn', // Общая СН
            'usn_income' => 'usn_income', // Упрощенная СН (доходы)
            'usn_income_outcome' => 'usn_income_outcome', // Упрощенная СН (доходы минус расходы)
            'envd' => 'envd', // Единый налог на вмененный доход
            'esn' => 'esn', // Единый сельскохозяйственный налог
            'patent' => 'patent' // Патентная СН
        ];

        return $taxations[$taxation];
    }

    public function getPaymentMethod(string $method): string
    {
        $paymentMethod = [
            'full_prepayment' => 'full_prepayment', // Предоплата 100%
            'prepayment' => 'prepayment', // Предоплата
            'advance' => 'advance', // Аванc
            'full_payment' => 'full_payment', // Полный расчет
            'partial_payment' => 'partial_payment', // Частичный расчет и кредит
            'credit' => 'credit', // Передача в кредит
            'credit_payment' => 'credit_payment' // Оплата кредита
        ];

        return $paymentMethod[$method];
    }

    public function getPaymentObject(string $object): string
    {
        $paymentObject = [
            'commodity' => 'commodity', // Товар
            'excise' => 'excise', // Подакцизный товар
            'job' => 'job', // Работа
            'service' => 'service', // Услуга
            'gambling_bet' => 'gambling_bet', // Ставка азартной игры
            'gambling_prize' => 'gambling_prize', // Выигрыш азартной игры
            'lottery' => 'lottery', // Лотерейный билет
            'lottery_prize' => 'lottery_prize', // Выигрыш лотереи
            'intellectual_activity' => 'intellectual_activity', // Предоставление результатов интеллектуальной деятельности
            'payment' => 'payment', // Платеж
            'agent_commission' => 'agent_commission', // Агентское вознаграждение
            'composite' => 'composite', // Составной предмет расчета
            'another' => 'another' // Иной предмет расчета
        ];

        return $paymentObject[$object];
    }

    public function getVat(string $vat): string
    {
        $vats = [
            'none' => 'none', // Без НДС
            'vat0' => 'vat0', // НДС 0%
            'vat10' => 'vat10', // НДС 10%
            'vat20' => 'vat20' // НДС 20%
        ];

        return $vats[$vat];
    }
}