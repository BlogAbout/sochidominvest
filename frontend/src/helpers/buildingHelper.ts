import {ISelector} from '../@types/ISelector'

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
    {key: 'yes', text: 'Да'}
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
    {key: 'repair', text: 'ремонт'}
]

/**
 *  Список статусов для шахматки
 */
export const checkerStatuses: ISelector[] = [
    {key: 'free', text: 'свободно'},
    {key: 'booking', text: 'бронь'},
    {key: 'assignment', text: 'переуступка'},
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