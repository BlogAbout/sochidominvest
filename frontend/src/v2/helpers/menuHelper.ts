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