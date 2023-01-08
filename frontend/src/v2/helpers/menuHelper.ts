import {RouteNames} from './routerHelper'
import {IMenuLink, ISubMenu} from '../../@types/IMenu'

export const menuMain: IMenuLink[] = [
    {
        route: RouteNames.MAIN,
        title: 'Главная'
    },
    {
        route: RouteNames.ABOUT,
        title: 'О компании'
    },
    {
        route: RouteNames.BUILDING,
        title: 'Недвижимость'
    },
    {
        route: RouteNames.RENT,
        title: 'Аренда'
    },
    {
        route: RouteNames.ARTICLE,
        title: 'Статьи'
    }
]

export const menuFooter: IMenuLink[] = [
    {
        route: RouteNames.MAIN,
        title: 'Главная'
    },
    {
        route: RouteNames.ABOUT,
        title: 'О компании'
    },
    {
        route: RouteNames.FAQ,
        title: 'Вопрос/Ответ'
    },
    {
        route: RouteNames.POLICY,
        title: 'Политика'
    },
    {
        route: RouteNames.ARTICLE,
        title: 'Статьи'
    },
]

export const menuPanel: IMenuLink[] = [
    {
        route: RouteNames.P_DESKTOP,
        title: 'Рабочий стол',
        icon: 'house',
        hasRole: []
    },
    {
        route: RouteNames.SEPARATOR,
        title: '',
        hasRole: [],
        isSeparator: true
    },
    {
        route: RouteNames.P_USER,
        title: 'Пользователи',
        icon: 'user',
        hasRole: ['director', 'administrator']
    },
    {
        route: RouteNames.P_BUILDING,
        title: 'Недвижимость',
        icon: 'building',
        hasRole: []
    },
    {
        route: RouteNames.P_ARTICLE,
        title: 'Статьи',
        icon: 'newspaper',
        hasRole: []
    },
    {
        route: RouteNames.SEPARATOR,
        title: '',
        hasRole: [],
        isSeparator: true
    },
    {
        route: RouteNames.P_FILE_MANAGER,
        title: 'Файловый менеджер',
        icon: 'photo-film',
        hasRole: []
    },
    {
        route: RouteNames.P_CATALOG,
        title: 'Каталоги',
        icon: 'folder-tree',
        hasTariff: ['base', 'business', 'effectivePlus']
    },
    {
        route: RouteNames.P_CRM,
        title: 'CRM',
        icon: 'chart-pie',
        hasTariff: ['base', 'business', 'effectivePlus']
    },
    {
        route: RouteNames.P_DOCUMENT,
        title: 'Документы',
        icon: 'book',
        hasRole: [],
        hasTariff: ['business', 'effectivePlus']
    },
    {
        route: RouteNames.P_REPORT,
        title: 'Отчеты',
        icon: 'file-excel',
        hasRole: ['director', 'administrator', 'manager']
    },
    {
        route: RouteNames.SEPARATOR,
        title: '',
        hasRole: [],
        isSeparator: true
    },
    {
        route: RouteNames.P_TOOL,
        title: 'Инструменты',
        icon: 'screwdriver-wrench',
        hasRole: ['director', 'administrator']
    },
    {
        route: RouteNames.P_ADMINISTRATION,
        title: 'Администрирование',
        icon: 'gear',
        hasRole: ['director', 'administrator']
    },
    {
        route: RouteNames.P_SUPPORT,
        title: 'Поддержка',
        icon: 'question',
        hasRole: []
    },
]

export const subMenuCatalog: ISubMenu[] = [
    {
        href: RouteNames.P_DEVELOPER,
        title: 'Застройщики',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Предоставляет функционал управления застройщиками',
        hasTariff: ['base', 'business', 'effectivePlus']
    },
    {
        href: RouteNames.P_AGENT,
        title: 'Агентства',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Предоставляет функционал управления агентствами',
        hasTariff: ['base', 'business', 'effectivePlus']
    },
    {
        href: RouteNames.P_POST,
        title: 'Должности',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Организация должностей для структуризации сотрудников',
        hasRole: ['director', 'administrator']
    },
    {
        href: RouteNames.P_COMPILATION,
        title: 'Подборки',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Подборки объектов недвижимости, статей и других наборов для последующей рассылки',
        hasRole: ['director', 'administrator', 'manager']
    },
    {
        href: RouteNames.P_WIDGET,
        title: 'Виджеты',
        disabled: true,
        icon: '',
        type: 'catalog',
        description: 'Создание дополнительных виджетов для главной страницы сайта',
        hasRole: ['director', 'administrator', 'manager']
    },
    {
        href: RouteNames.P_BANNER,
        title: 'Баннеры',
        disabled: true,
        icon: '',
        type: 'catalog',
        description: 'Функционал управления и публикации собственных рекламных баннеров для привлечения клиентов и заработка',
        hasTariff: ['effectivePlus']
    },
    {
        href: RouteNames.P_QUESTION,
        title: 'F.A.Q.',
        disabled: false,
        icon: '',
        type: 'catalog',
        description: 'Управление списками вопросов и ответов для помощи пользователям',
        hasRole: ['director', 'administrator', 'manager']
    },
    {
        href: RouteNames.P_BP,
        title: 'Бизнес-процессы',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Организация бизнес-процессов для поддержания деятельности компании и проведения сделок',
        hasTariff: ['base', 'business', 'effectivePlus']
    },
    {
        href: RouteNames.P_BOOKING,
        title: 'Бронирование',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Функционал организации бронирования и аренды объектов недвижимости',
        hasRole: ['director', 'administrator', 'manager']
    },
    {
        href: RouteNames.P_PAYMENT,
        title: 'Платежи и транзакции',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Управление платежами и транзакциями, производимыми пользователями',
        hasTariff: ['base', 'business', 'effectivePlus']
    },
    {
        href: RouteNames.P_USER_EXTERNAL,
        title: 'Внешние пользователи',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Каталог управления внешними (не зарегистрированными) пользователями',
        hasRole: ['director', 'administrator', 'manager']
    },
    {
        href: RouteNames.P_MAILING,
        title: 'Рассылки',
        disabled: false,
        icon: '',
        type: 'crm',
        description: 'Функционал управления рассылками почтовых и браузерных уведомлений для пользователей',
        hasRole: ['director', 'administrator']
    },
    {
        href: RouteNames.P_PARTNER,
        title: 'Спонсоры и партнеры',
        disabled: true,
        icon: '',
        type: 'crm',
        description: 'Средства работы с партнерами и спонсорами, заработок на партнерстве',
        hasTariff: ['effectivePlus']
    }
]