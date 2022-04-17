import {IAttachment} from '../@types/IAttachment'

export const sortAttachments = (files: IAttachment[], ids: number[]) => {
    if (files && files.length) {
        if (ids && ids.length) {
            return files.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
        }

        return files
    }

    return []
}