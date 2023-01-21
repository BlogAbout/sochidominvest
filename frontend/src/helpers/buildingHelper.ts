import {ISelector} from '../@types/ISelector'
import {IBuilding, IBuildingPassed} from '../@types/IBuilding'

/**
 * Список статусов объектов недвижимости
 */
export const buildingStatuses: ISelector[] = [
    {key: 'onSale', text: 'В продаже'},
    {key: 'sold', text: 'Продано'}
]

/**
 * Список типов объектов недвижимости
 */
export const buildingTypes: ISelector[] = [
    {key: 'building', text: 'Жилой комплекс'},
    {key: 'apartment', text: 'Квартира'},
    {key: 'house', text: 'Дом'},
    {key: 'land', text: 'Земельный участок'},
    {key: 'commerce', text: 'Коммерция'},
    {key: 'garage', text: 'Гараж, машиноместо'}
]

/**
 * Список классов недвижимости
 */
export const buildingClasses: ISelector[] = [
    {key: 'business', text: 'Бизнес'},
    {key: 'comfort', text: 'Комфорт'},
    {key: 'elite', text: 'Элит'},
    {key: 'economy', text: 'Эконом'}
]

/**
 * Список типов материалов
 */
export const buildingMaterials: ISelector[] = [
    {key: 'wood', text: 'Деревянный'},
    {key: 'monolith', text: 'Монолитный'},
    {key: 'monolith-frame', text: 'Монолит-каркас'},
    {key: 'monolith-brick', text: 'Монолитно-кирпичный'},
    {key: 'monolith-block', text: 'Монолитно-блочный'}
]

/**
 * Список типов домов
 */
export const buildingFormat: ISelector[] = [
    {key: 'multi-family', text: 'Многоквартирный'},
    {key: 'club', text: 'Клубный'}
]

/**
 * Список типов паркинга
 */
export const buildingParking: ISelector[] = [
    {key: 'out', text: 'Отсуствует'},
    {key: 'pre-house', text: 'Придомовой'},
    {key: 'pre-house-underground', text: 'Придомовой, подземный'},
    {key: 'pre-house-closed', text: 'Придомовой, закрытый'}
]

/**
 * Список типов территории
 */
export const buildingTerritory: ISelector[] = [
    {key: 'open', text: 'Открытая'},
    {key: 'close', text: 'Закрытая'},
    {key: 'close-protected', text: 'Закрытая охраняемая'}
]

/**
 *  Список типов подездов к дому
 */
export const buildingEntrance: ISelector[] = [
    {key: 'asphalt', text: 'Асфальтная дорога'},
    {key: 'gravel', text: 'Гравийная дорога'},
    {key: 'ground', text: 'Грунтовая дорога'}
]

/**
 *  Список типов подключения газа
 */
export const buildingGas: ISelector[] = [
    {key: 'no', text: 'Нет'},
    {key: 'yes', text: 'Да'},
    {key: 'balloon', text: 'Баллоны'}
]

/**
 *  Список типов отопления
 */
export const buildingHeating: ISelector[] = [
    {key: 'central', text: 'Центральное'},
    {key: 'electrical', text: 'Электрическое'},
    {key: 'boiler', text: 'Котельная'},
    {key: 'individual-gas-boiler', text: 'Индивидуальный газовый котел'}
]

/**
 *  Список типов подключения электричества
 */
export const buildingElectricity: ISelector[] = [
    {key: 'no-connect', text: 'Не подключено'},
    {key: 'connect', text: 'Подключено'}
]

/**
 *  Список типов канализации
 */
export const buildingSewerage: ISelector[] = [
    {key: 'central', text: 'Центральная'},
    {key: 'los', text: 'ЛОС'}
]

/**
 *  Список типов водоснабжения
 */
export const buildingWaterSupply: ISelector[] = [
    {key: 'borehole', text: 'Скважина'},
    {key: 'spring', text: 'Родник'},
    {key: 'central', text: 'Центральное'}
]

/**
 * Список особенностей
 */
export const buildingAdvantages: ISelector[] = [
    {key: 'landscape-design', text: 'Ландшафтный дизайн'},
    {key: 'swimming-pool', text: 'Бассейн'},
    {key: 'rest-zone', text: 'Зона отдыха'},
    {key: 'playground-children', text: 'Детская площадка'},
    {key: 'playground-sport', text: 'Спортивная площадка'},
    {key: 'spa', text: 'SPA'},
    {key: 'fountain', text: 'Фонтан'},
    {key: 'garden', text: 'Сад'},
    {key: 'sauna', text: 'Сауна'},
    {key: 'restaurant', text: 'Ресторан'},
    {key: 'checkpoint', text: 'КПП'},
    {key: 'concierge', text: 'Консьерж'},
    {key: 'elevator', text: 'Лифт'},
    {key: 'commercial-space', text: 'Коммерческие площади'},
    {key: 'cctv', text: 'Видеонаблюдение'},
    {key: 'bbq', text: 'Зона барбекю'},
    {key: 'exploited-roof', text: 'Эксплуатированная кровля'}
]

/**
 *  Список типов отделки для шахматки
 */
export const checkerFurnish: ISelector[] = [
    {key: 'draft', text: 'черновая'},
    {key: 'pre-finishing', text: 'предчистовая'},
    {key: 'repair', text: 'ремонт'}
]

/**
 *  Список статусов для шахматки
 */
export const checkerStatuses: ISelector[] = [
    {key: 'free', text: 'свободно'},
    {key: 'booking', text: 'бронь'},
    {key: 'assignment', text: 'переуступка'},
    {key: 'action', text: 'акция'},
    {key: 'sold', text: 'продано'}
]

/**
 *  Список типов оплаты
 */
export const paymentsList: ISelector[] = [
    {key: 'mortgage', text: 'Ипотека'},
    {key: 'mortgage-individual', text: 'Ипотека (индивидуально)'},
    {key: 'military-mortgage', text: 'Военная ипотека'},
    {key: 'maternal-capital', text: 'Материнский капитал'},
    {key: 'installment-plan', text: 'Рассрочка'},
    {key: 'cash', text: 'Наличный расчёт'},
    {key: 'cashless', text: 'Безналичный расчёт'}
]

/**
 *  Список вариантов оформления покупки
 */
export const formalizationList: ISelector[] = [
    {key: 'justice', text: 'Юстиция'},
    {key: 'contract-sale', text: 'Договор купли-продажи'},
    {key: 'loan-agreement', text: 'Договор займа'},
    {key: 'fz-214', text: 'ФЗ-214'},
    {key: 'preliminary-agreement', text: 'Предварительный договор'},
    {key: 'investment-agreement', text: 'Договор инвестирования'}
]

/**
 *  Список вариантов сумм в договоре
 */
export const amountContract: ISelector[] = [
    {key: 'full', text: 'Полная'},
    {key: 'partial', text: 'Неполная'}
]

export const districtList: ISelector[] = [
    {
        key: 'Центральный район',
        text: 'Центральный район',
        children: [
            {key: 'Донская', text: 'Донская'},
            {key: 'Завокзальный', text: 'Завокзальный'},
            {key: 'Заречный', text: 'Заречный'},
            {key: 'КСМ', text: 'КСМ'},
            {key: 'Макаренко', text: 'Макаренко'},
            {key: 'Мамайка низ', text: 'Мамайка низ'},
            {key: 'Мамайка верх', text: 'Мамайка верх'},
            {key: 'Новый Сочи', text: 'Новый Сочи'},
            {key: 'Клубничная', text: 'Клубничная'},
            {key: 'Центр', text: 'Центр'}
        ]
    },
    {
        key: 'Хостинский район',
        text: 'Хостинский район',
        children: [
            {key: 'Ахун', text: 'Ахун'},
            {key: 'Бытха', text: 'Бытха'},
            {key: 'Кудепста пос.', text: 'Кудепста пос.'},
            {key: 'Мацеста', text: 'Мацеста'},
            {key: 'Пластунка', text: 'Пластунка'},
            {key: 'Приморье', text: 'Приморье'},
            {key: 'Раздольное', text: 'Раздольное'},
            {key: 'Светлана низ', text: 'Светлана низ'},
            {key: 'Светлана верх', text: 'Светлана верх'},
            {key: 'Соболевка', text: 'Соболевка'},
            {key: 'Фабрициуса', text: 'Фабрициуса'},
            {key: 'Хоста', text: 'Хоста'},
            {key: 'Транспортная', text: 'Транспортная'}
        ]
    },
    {
        key: 'Адлерский район',
        text: 'Адлерский район',
        children: [
            {key: 'Адлер-центр', text: 'Адлер-центр'},
            {key: 'Блиново', text: 'Блиново'},
            {key: 'Веселое село', text: 'Веселое село'},
            {key: 'Голубые Дали', text: 'Голубые Дали'},
            {key: 'Красная Поляна пос.', text: 'Красная Поляна пос.'},
            {key: 'Курортный городок', text: 'Курортный городок'},
            {key: 'Мирный', text: 'Мирный'},
            {key: 'Молдовка село', text: 'Молдовка село'},
            {key: 'Орел-Изумруд село', text: 'Орел-Изумруд село'},
            {key: 'Южные культуры', text: 'Южные культуры'},
            {key: 'Имеретинская низменность', text: 'Имеретинская низменность'}
        ]
    },
    {
        key: 'Лазаревский район',
        text: 'Лазаревский район',
        children: [
            {key: 'Лоо пос.', text: 'Лоо пос.'},
            {key: 'Дагомыс пос.', text: 'Дагомыс пос.'},
            {key: 'Лазаревское пос.', text: 'Лазаревское пос.'},
        ]
    },
    {
        key: 'Туапсе',
        text: 'Туапсе',
        children: [
            {key: 'Туапсе', text: 'Туапсе'}
        ]
    },
    {
        key: 'Крым',
        text: 'Крым',
        children: [
            {key: 'Крым', text: 'Крым'}
        ]
    }
]

/**
 *  Список типов аренды
 */
export const rentTypes: ISelector[] = [
    {key: 'long', text: 'Долгосрочная'},
    {key: 'short', text: 'Посуточно'}
]

export const getDistrictText = (district?: string | null, districtZone?: string | null) => {
    let districtText = ''

    if (district && district.trim() !== '') {
        const districtInfo = districtList.find((item: ISelector) => item.key === district)

        if (districtInfo) {
            districtText = districtInfo.text

            if (districtZone && districtInfo.children) {
                const districtZoneInfo = districtInfo.children.find((item: ISelector) => item.key === districtZone)

                if (districtZoneInfo) {
                    districtText += ' / ' + districtZoneInfo.text
                }
            }
        }
    }

    return districtText
}

export const getPassedText = (passed?: IBuildingPassed) => {
    let passedText = ''

    if (passed) {
        if (passed.is) {
            passedText = 'Сдан'

            if (passed.quarter || passed.year) {
                passedText += ': '

                if (passed.quarter) {
                    passedText += passed.quarter + ' квартал '
                }

                if (passed.year) {
                    passedText += passed.year
                }
            }
        } else if (passed.quarter || passed.year) {

        } else {
            passedText = 'Не сдан'
        }
    } else {
        passedText = 'Не сдан'
    }

    return passedText
}

export const getAboutBlockTitle = (type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage') => {
    let titleAbout = ''

    switch (type) {
        case 'building':
            titleAbout = 'О жилом комплексе'
            break
        case 'apartment':
            titleAbout = 'О квартире'
            break
        case 'house':
            titleAbout = 'О доме'
            break
        case 'land':
            titleAbout = 'О земельном участке'
            break
        case 'commerce':
            titleAbout = 'О коммерции'
            break
        case 'garage':
            titleAbout = 'О гараже, машиноместе'
            break
    }

    return titleAbout
}

export const getBuildingStatusesText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingStatuses.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingTypesText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingClassesText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingClasses.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingMaterialsText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingMaterials.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingFormatText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingFormat.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingEntranceText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingEntrance.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingParkingText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingParking.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingTerritoryText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingTerritory.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingGasText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingGas.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingHeatingText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingHeating.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingElectricityText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingElectricity.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingSewerageText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingSewerage.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingWaterSupplyText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = buildingWaterSupply.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingAmountContractText = (key: string | null | undefined) => {
    if (!key) {
        return ''
    }

    const find = amountContract.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const checkBuildingByRangeCost = (building: IBuilding, filters: any) => {
    if (!filters.buildingCost || (filters.buildingCost.min === 0 && filters.buildingCost.max === 0)) {
        return true
    }

    if (filters.buildingCost.min > 0 && filters.buildingCost.max > 0) {
        if (building.type !== 'building' && building.cost && building.cost >= filters.buildingCost.min && building.cost <= filters.buildingCost.max) {
            return true
        } else if (building.type === 'building' && building.costMin && building.costMax && building.costMin >= filters.buildingCost.min && building.costMax <= filters.buildingCost.max) {
            return true
        }
    } else if (filters.buildingCost.min > 0) {
        if (building.type !== 'building' && building.cost && building.cost >= +filters.buildingCost.min) {
            return true
        } else if (building.type === 'building' && building.costMin && building.costMin >= +filters.buildingCost.min) {
            return true
        }
    } else if (filters.buildingCost.max > 0) {
        if (building.type !== 'building' && building.cost && building.cost <= filters.buildingCost.max) {
            return true
        } else if (building.type === 'building' && building.costMax && building.costMax <= filters.buildingCost.max) {
            return true
        }
    } else {
        return false
    }

    return false
}

export const checkBuildingByRangeArea = (building: IBuilding, filters: any) => {
    if (!filters.buildingArea || (filters.buildingArea.min === 0 && filters.buildingArea.max === 0)) {
        return true
    }

    if (filters.buildingArea.min > 0 && filters.buildingArea.max > 0) {
        if (building.type !== 'building' && building.area && building.area >= filters.buildingArea.min && building.area <= filters.buildingArea.max) {
            return true
        } else if (building.type === 'building' && building.areaMin && building.areaMax && building.areaMin >= filters.buildingArea.min && building.areaMax <= filters.buildingArea.max) {
            return true
        }
    } else if (filters.buildingArea.min > 0) {
        if (building.type !== 'building' && building.area && building.area >= filters.buildingArea.min) {
            return true
        } else if (building.type === 'building' && building.areaMin && building.areaMin >= filters.buildingArea.min) {
            return true
        }
    } else if (filters.buildingArea.max > 0) {
        if (building.type !== 'building' && building.area && building.area <= filters.buildingArea.max) {
            return true
        } else if (building.type === 'building' && building.areaMax && building.areaMax <= filters.buildingArea.max) {
            return true
        }
    } else {
        return false
    }

    return false
}

export const checkBuildingByDistrict = (building: IBuilding, filters: any) => {
    if (!filters.buildingDistrictZone || !filters.buildingDistrictZone.length) {
        return true
    }

    return !!(building.districtZone && filters.buildingDistrictZone.includes(building.districtZone))
}

export const getRentTypesText = (key: string) => {
    const find = rentTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const getBuildingById = (buildings: IBuilding[], id: number | null) => {
    if (!buildings.length) {
        return null
    }

    const findBuilding = buildings.find((building: IBuilding) => building.id === id)

    return findBuilding ? findBuilding : null
}

export const getBuildingNameById = (buildings: IBuilding[], id: number | null) => {
    if (!id) {
        return ''
    }

    const building = getBuildingById(buildings, id)

    return building ? building.name : 'Объект недвижимости не найден'
}