export interface ISelector {
    key: string
    text: string
    children?: ISelector[]
    isRegistration?: boolean
    readOnly?: boolean
    hidden?: boolean
}