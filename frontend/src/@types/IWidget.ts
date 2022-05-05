export interface IWidget {
    id: number | null
    name: string
    type: string
    style: string
    page: string
    ordering: number
    active: number
    data: IWidgetData[]
}

export interface IWidgetData {
    widgetId: number | null
    objectId: number
    objectType: string
    ordering: number
}