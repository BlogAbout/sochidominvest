<?php

namespace App\Core;

use App\Agent\AgentService;
use App\BuildingModel;
use App\CheckerModel;
use App\DeveloperModel;
use App\Model;
use App\UserModel;
use App\UtilModel;

class CoreService extends Model
{
    public function __construct($settings)
    {
        parent::__construct($settings);
    }

    /**
     * Проверка даты активности тарифа пользователей
     */
    public function checkExpiredDateUsers(): void
    {
        $sql = "
            SELECT *
            FROM `sdi_user`
            WHERE DATE(`tariff_expired`) <= DATE(NOW()) AND `tariff` != 'free';
        ";

        parent::query($sql);

        $users = parent::fetchAll();

        if (!empty($users)) {
            foreach ($users as $user) {
                $this->disableAllDataForUser($user['id']);
            }
        }
    }

    /**
     * Обновление активных данных пользователя при смене тарифа
     *
     * @param int $userId Идентификатор пользователя
     * @param string $tariff Выбранный тариф
     * @param string $prevTariff Старый тариф
     */
    public function updateAllDataForUser(int $userId, string $tariff = 'free', string $prevTariff = 'free'): void
    {
        if ($prevTariff === $tariff) {
            return;
        }

        switch ($tariff) {
            case 'base':
            {
                if ($prevTariff === 'business' || $prevTariff === 'effectivePlus') {
                    $this->updateDataByTariff($userId, 5, 0, 0, 0, false);
                }

                break;
            }
            case 'business':
            {
                if ($prevTariff === 'effectivePlus') {
                    $this->updateDataByTariff($userId, 10, 10, 1, 1, true);
                }

                break;
            }
            case 'effectivePlus':
            {
                break;
            }
            default:
            {
                $this->disableAllDataForUser($userId);
                break;
            }
        }
    }

    /**
     * Отключение всех данных для выбранного пользователя
     *
     * @param int $userId Идентификатор пользователя
     */
    private function disableAllDataForUser(int $userId): void
    {
        AgentService::disableAllAgentsForUser($userId);
        DeveloperModel::disableAllDevelopersForUser($userId);
        BuildingModel::disableAllBuildingsForUser($userId);
        CheckerModel::disableAllCheckersForUser($userId);
        UserModel::changeTariffForUser($userId, 'free', UtilModel::getDateNow());
    }

    /**
     * Обновление данные пользователя на основе тарифа
     *
     * @param int $userId Идентификатор пользователя
     * @param int $countBuildings Количество объектов недвижимости
     * @param int $countCheckers Количество шахматок
     * @param int $countAgents Количество доступных агентств
     * @param int $countDevelopers Количество доступных застройщиков
     * @param bool $withBuildings Доступны новостройки
     */
    private function updateDataByTariff(int $userId, int $countBuildings, int $countCheckers, int $countAgents, int $countDevelopers, bool $withBuildings): void
    {
        $idsBuildings = [];
        $idsCheckers = [];
        $idsAgents = [];
        $idsDevelopers = [];

        if ($countBuildings) {
            if ($withBuildings) {
                $sql = "SELECT `id` FROM `sdi_building` WHERE `active` = 1 LIMIT :countBuildings;";
            } else {
                $sql = "SELECT `id` FROM `sdi_building` WHERE `active` = 1 AND `type` != 'building' LIMIT :countBuildings;";
            }

            parent::query($sql);
            parent::bindParams('countBuildings', $countBuildings);

            $ids = parent::fetchColumn();
            $idsBuildings = array_map('intval', $ids ?? []);
        }

        if ($countCheckers && $withBuildings && count($idsBuildings)) {
            $sql = "
                SELECT `id`
                FROM `sdi_building_checker`
                WHERE `active` = 1 AND `id_building` IN (" . implode(',', $idsBuildings) . ")
                LIMIT :countCheckers;
            ";

            parent::query($sql);
            parent::bindParams('countCheckers', $countCheckers);

            $ids = parent::fetchColumn();
            $idsCheckers = array_map('intval', $ids ?? []);
        }

        if ($countAgents) {
            $sql = "SELECT `id` FROM `sdi_agent` WHERE `active` = 1 LIMIT :countAgents;";

            parent::query($sql);
            parent::bindParams('countAgents', $countAgents);

            $ids = parent::fetchColumn();
            $idsAgents = array_map('intval', $ids ?? []);
        }

        if ($countDevelopers) {
            $sql = "SELECT `id` FROM `sdi_developer` WHERE `active` = 1 LIMIT :countDevelopers;";

            parent::query($sql);
            parent::bindParams('countDevelopers', $countDevelopers);

            $ids = parent::fetchColumn();
            $idsDevelopers = array_map('intval', $ids ?? []);
        }

        AgentService::disableAllAgentsForUser($userId);
        DeveloperModel::disableAllDevelopersForUser($userId);
        BuildingModel::disableAllBuildingsForUser($userId);
        CheckerModel::disableAllCheckersForUser($userId);

        if (count($idsBuildings)) {
            $sql = "
                UPDATE `sdi_building`
                SET `active` = 1
                WHERE `id` IN (" . implode(',', $idsBuildings) . ")
            ";
            parent::query($sql);
            parent::execute();
        }

        if (count($idsCheckers)) {
            $sql = "
                UPDATE `sdi_building_checker`
                SET `active` = 1
                WHERE `id` IN (" . implode(',', $idsCheckers) . ")
            ";
            parent::query($sql);
            parent::execute();
        }

        if (count($idsAgents)) {
            $sql = "
                UPDATE `sdi_agent`
                SET `active` = 1
                WHERE `id` IN (" . implode(',', $idsAgents) . ")
            ";
            parent::query($sql);
            parent::execute();
        }

        if (count($idsDevelopers)) {
            $sql = "
                UPDATE `sdi_developer`
                SET `active` = 1
                WHERE `id` IN (" . implode(',', $idsDevelopers) . ")
            ";
            parent::query($sql);
            parent::execute();
        }
    }
}