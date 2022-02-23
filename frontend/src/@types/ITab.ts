interface ITabContent {
    title: string, // Название вкладки
    count?: number, // Количество элементов (отображается в табе при включенном флаге showCount)
    icon?: string, // Иконка для вкладки заместо названия
    iconActive?: string, // Иконка для вкладки - активная
    iconError?: string, // Иконка для вкладки в виде ошибки
    render: any // Функция render с содержимым вкладки
}

export interface ITab {
    [key: string]: ITabContent
}