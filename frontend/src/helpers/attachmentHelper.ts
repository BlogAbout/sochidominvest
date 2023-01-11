import {IAttachment} from '../@types/IAttachment'
import {ISelector} from '../@types/ISelector'

export const attachmentTypes: ISelector[] = [
    {key: 'image', text: 'Изображения'},
    {key: 'video', text: 'Видео'},
    {key: 'document', text: 'Документы'}
]

export const getAttachmentTypeText = (key: string) => {
    const find = attachmentTypes.find((item: ISelector) => item.key === key)
    return find ? find.text : ''
}

export const sortAttachments = (files: IAttachment[], ids: number[]) => {
    if (files && files.length) {
        if (ids && ids.length) {
            return files.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
        }

        return files
    }

    return []
}