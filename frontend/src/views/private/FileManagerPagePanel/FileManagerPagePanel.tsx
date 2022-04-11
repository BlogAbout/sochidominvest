import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {IAttachment} from '../../../@types/IAttachment'
import AttachmentService from '../../../api/AttachmentService'
import Button from '../../../components/Button/Button'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import SearchBox from '../../../components/SearchBox/SearchBox'
import FileList from '../../../components/FileList/FileList'
import FileUploader from '../../../components/FileUploader/FileUploader'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import classes from './FileManagerPagePanel.module.scss'

const FileManagerPagePanel: React.FC = () => {
    const [uploaderType, setUploaderType] = useState<'image' | 'video' | 'document'>('image')
    const [showUploader, setShowUploader] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [fetching, setFetching] = useState(false)
    const [files, setFiles] = useState<IAttachment[]>([])
    const [filterFiles, setFilterFiles] = useState<IAttachment[]>([])

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate || !files.length) {
            setFetching(true)
            setIsUpdate(false)

            AttachmentService.fetchAttachments({active: [0, 1]})
                .then((response: any) => {
                    setFiles(response.data)
                })
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [files])

    // Обработчик изменений
    const onSave = (attachment: IAttachment) => {
        if (files && files.length) {
            const findIndex = files.findIndex((file: IAttachment) => file.id === attachment.id)

            setFiles([...files.slice(0, findIndex), attachment, ...files.slice(findIndex + 1)])
        }
    }

    // Загрузка файла
    const onUploadFile = (attachment: IAttachment) => {
        const updateFiles: IAttachment[] = [attachment, ...files]
        console.log(updateFiles)
        setFiles(updateFiles)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!files || !files.length) {
            setFilterFiles([])
        }

        if (value !== '') {
            setFilterFiles(files.filter((file: IAttachment) => {
                return file.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    file.description.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    file.content.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterFiles(files)
        }
    }

    const uploadHandler = (type: 'image' | 'video' | 'document') => {
        setUploaderType(type)
        setShowUploader(true)
    }

    // Меню выбора загрузки файла
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Изображения', onClick: () => uploadHandler('image')},
            {text: 'Видео', onClick: () => uploadHandler('video')},
            {text: 'Документы', onClick: () => uploadHandler('document')}
        ]

        openContextMenu(e, menuItems)
    }

    const renderUploader = () => {
        let labelTitle = ''

        switch (uploaderType) {
            case 'image':
                labelTitle = 'Загрузить изображения'
                break
            case 'video':
                labelTitle = 'Загрузить видео'
                break
            case 'document':
                labelTitle = 'Загрузить документы'
                break
        }

        return (
            <div className={classes.uploader}>
                <FileUploader text={labelTitle}
                              type={uploaderType}
                              onChange={onUploadFile.bind(this)}
                              onCancel={() => setShowUploader(false)}
                              showCancel
                              multi
                />
            </div>
        )
    }

    return (
        <main className={classes.BuildingPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Файловый менеджер - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type='save' icon={'image'} onClick={() => console.log('add')}>Изображения</Button>

                <Button type='save' icon={'video'} onClick={() => console.log('add')}>Видео</Button>

                <Button type='save' icon={'file'} onClick={() => console.log('add')}>Документы</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Файловый менеджер</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={onContextMenu.bind(this)}>Загрузить</Button>
                        : null
                    }
                </h1>

                {showUploader && renderUploader()}

                <FileList files={filterFiles} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

FileManagerPagePanel.displayName = 'FileManagerPagePanel'

export default FileManagerPagePanel