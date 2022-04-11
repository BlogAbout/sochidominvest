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
    const [uploaderType, setUploaderType] = useState('image')
    const [showUploader, setShowUploader] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [fetching, setFetching] = useState(false)
    const [files, setFiles] = useState<IAttachment[]>([])
    const [filterFiles, setFilterFiles] = useState<IAttachment[]>([])

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (isUpdate || !files.length) {
            setIsUpdate(false)
            setFetching(true)

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
    const onSave = () => {
        setIsUpdate(true)
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
                labelTitle = 'Загрузка изображений'
                break
            case 'video':
                labelTitle = 'Загрузка видео'
                break
            case 'document':
                labelTitle = 'Загрузка документов'
                break
        }

        return (
            <div className={classes.uploader}>
                <div className={classes.label}>{labelTitle}</div>

                <FileUploader type={uploaderType} onChange={onSave.bind(this)}/>

                <Button type='save' icon='arrow-rotate-left' onClick={() => setShowUploader(false)}>Отменить</Button>
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