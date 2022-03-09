/**
 * Список статусов объектов недвижимости
 */
export const buildingStatuses = [
    {key: 'sold', text: 'Продано'}
]

/**
 * Список типов объектов недвижимости
 */
export const buildingTypes = [
    {key: 'new_building', text: 'Новостройка'},
    {key: 'secondary', text: 'Вторичная'},
    {key: 'land_plot', text: 'Земля/участок'},
    {key: 'commercial', text: 'Коммерческая'},
    {key: 'rent', text: 'Аренда'}
]

/**
 * Список классов недвижимости
 */
export const buildingClasses = [
    {key: 'business', text: 'Бизнес'},
    {key: 'comfort', text: 'Комфорт'},
    {key: 'elite', text: 'Элит'}
]

/**
 * Список типов материалов
 */
export const buildingMaterials = [
    {key: 'monolith', text: 'Монолитный'},
    {key: 'monolith-frame', text: 'Монолит-каркас'},
    {key: 'monolith-brick', text: 'Монолитно-кирпичный'}
]

/**
 * Список типов домов
 */
export const buildingFormat = [
    {key: 'multi-family', text: 'Многоквартирный'},
    {key: 'club', text: 'Клубный'}
]

/**
 * Список типов паркинга
 */
export const buildingParking = [
    {key: 'out', text: 'Отсуствует'},
    {key: 'pre-house', text: 'Придомовой'},
    {key: 'pre-house-underground', text: 'Придомовой, подземный'},
    {key: 'pre-house-closed', text: 'Придомовой, закрытый'}
]

/**
 * Список типов территории
 */
export const buildingTerritory = [
    {key: 'open', text: 'Открытая'},
    {key: 'close', text: 'Закрытая'},
    {key: 'close-protected', text: 'Закрытая охраняемая'}
]

/**
 *  Список типов подездов к дому
 */
export const buildingEntrance = [
    {key: 'asphalt', text: 'Асфальтная дорога'}
]

/**
 *  Список типов подключения газа
 */
export const buildingGas = [
    {key: 'no', text: 'Нет'},
    {key: 'yes', text: 'Да'}
]

/**
 *  Список типов отопления
 */
export const buildingHeating = [
    {key: 'electrical', text: 'Электрическое'},
    {key: 'boiler', text: 'Котельная'},
    {key: 'individual-gas-boiler', text: 'Индивидуальный газовый котел'}
]

/**
 *  Список типов подключения электричества
 */
export const buildingElectricity = [
    {key: 'no-connect', text: 'Не подключено'},
    {key: 'connect', text: 'Подключено'}
]

/**
 *  Список типов канализации
 */
export const buildingSewerage = [
    {key: 'central', text: 'Центральная'},
    {key: 'los', text: 'ЛОС'}
]

/**
 *  Список типов водоснабжения
 */
export const buildingWaterSupply = [
    {key: 'central', text: 'Центральное'}
]

/**
 * Список особенностей
 */
export const buildingAdvantages = [
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
    {key: 'cctv', text: 'Видеонаблюдение'}
]

/**
 *  Список типов отделки
 */
export const checkerFurnish = [
    {key: 'draft', text: 'черновая'},
    {key: 'repair', text: 'ремонт'}
]

/**
 *  Список типов оплаты
 */
export const paymentsList = [
    {key: 'maternal-capital', text: 'Материнский капитал'},
    {key: 'installment-plan', text: 'Рассрочка'},
    {key: 'mortgage', text: 'Ипотека'},
    {key: 'mortgage-individual', text: 'Ипотека (индивидуально)'},
    {key: 'military-mortgage', text: 'Военная ипотека'}
]

/**
 *  Список вариантов оформления покупки
 */
export const formalizationList = [
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
export const amountContract = [
    {key: 'full', text: 'Полная'},
    {key: 'partial', text: 'Неполная'}
]