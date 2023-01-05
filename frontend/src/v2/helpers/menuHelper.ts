import {RouteNames} from '../../routes/routes'
import {IMenuLink} from '../../@types/IMenu'

export const menuMain: IMenuLink[] = [
    {
        route: RouteNames.MAIN,
        title: 'Главная'
    },
    {
        route: RouteNames.PUBLIC_ABOUT,
        title: 'О компании'
    },
    {
        route: RouteNames.PUBLIC_BUILDING,
        title: 'Недвижимость'
    },
    {
        route: RouteNames.PUBLIC_RENT,
        title: 'Аренда'
    },
    {
        route: RouteNames.PUBLIC_ARTICLE,
        title: 'Статьи'
    }
]

export const menuFooter: IMenuLink[] = [
    {
        route: RouteNames.MAIN,
        title: 'Главная'
    },
    {
        route: RouteNames.PUBLIC_ABOUT,
        title: 'О компании'
    },
    {
        route: RouteNames.PUBLIC_FAQ,
        title: 'Вопрос/Ответ'
    },
    {
        route: RouteNames.PUBLIC_POLICY,
        title: 'Политика'
    },
    {
        route: RouteNames.PUBLIC_ARTICLE,
        title: 'Статьи'
    },
]

export const menuPanel: IMenuLink[] = [
    {
        route: RouteNames.MAIN,
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
        route: RouteNames.USER,
        title: 'Пользователи',
        icon: 'user',
        hasRole: ['director', 'administrator']
    },
    {
        route: RouteNames.BUILDING,
        title: 'Недвижимость',
        icon: 'building',
        hasRole: []
    },
    {
        route: RouteNames.ARTICLE,
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
        route: RouteNames.FILE_MANAGER,
        title: 'Файловый менеджер',
        icon: 'photo-film',
        hasRole: []
    },
    {
        route: RouteNames.CRM,
        title: 'CRM',
        icon: 'folder-tree',
        hasRole: ['director', 'administrator', 'manager']
    },
    {
        route: RouteNames.DOCUMENT,
        title: 'Документы',
        icon: 'book',
        hasRole: [],
        hasTariff: ['business', 'effectivePlus']
    },
    {
        route: RouteNames.REPORT,
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
        route: RouteNames.TOOL,
        title: 'Инструменты',
        icon: 'screwdriver-wrench',
        hasRole: ['director', 'administrator']
    },
    {
        route: RouteNames.ADMINISTRATION,
        title: 'Администрирование',
        icon: 'gear',
        hasRole: ['director', 'administrator']
    },
    {
        route: RouteNames.ADVERTISING,
        title: 'Рекламные материалы',
        icon: 'rectangle-ad',
        hasRole: ['director', 'administrator']
    },
    {
        route: RouteNames.SUPPORT,
        title: 'Поддержка',
        icon: 'question',
        hasRole: []
    },
]