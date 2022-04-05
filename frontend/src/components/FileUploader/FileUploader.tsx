import React, {useRef, useState} from 'react'
import UploadService from '../../api/UploadService'
import Button from '../Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import classes from './FileUploader.module.scss'

interface Props {
    fileContent: string
    extension?: string
    type: string
    disabled?: boolean
    text?: string
    objectType?: string
    objectId?: number
    showRemove?: boolean

    onChange(content: string, extension?: string): void
}

const defaultProps: Props = {
    fileContent: '',
    type: 'document',
    disabled: false,
    text: 'Загрузить',
    showRemove: false,
    onChange: (content: string, extension?: string) => {
        console.info('FileUploader onChange', content, extension)
    }
}

const FileUploader: React.FC<Props> = (props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [progress, setProgress] = useState(0)
    const [fetching, setFetching] = useState(false)

    let accept = ''
    let acceptText = ''

    switch (props.type) {
        case 'document':
            accept = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf'
            acceptText = 'Доступны для загрузки: DOC, DOCX, XLS, XLSX, PDF. Максимальный размер: 50 Мб.'
            break
        case 'image':
            accept = 'image/jpeg,image/png,image/jpg'
            acceptText = 'Доступны для загрузки: PNG, JPG, JPEG. Максимальный размер: 50 Мб.'
            break
        case 'video':
            accept = 'video/webm'
            acceptText = 'Доступны для загрузки: WEBM. Максимальный размер: 50 Мб.'
            break
    }

    // Загрузчик файла
    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.currentTarget.files

        if (files && files.length) {
            setFetching(true)

            UploadService.uploadFile(files[0], props.type, (event: any) => {
                setProgress(Math.round((100 * event.loaded) / event.total))
            }, props.objectType, props.objectId)
                .then((response) => {
                    const result = response.data.split('.')

                    props.onChange(response.data, result[result.length - 1])
                })
                .catch((error) => {
                    console.error('Ошибка загрузки файла', error)

                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
                .finally(() => {
                    setProgress(0)
                    setFetching(false)
                })
        }

        if (inputRef && inputRef.current) {
            inputRef.current.value = ''
        }
    }

    const renderInput = () => {
        return (
            <div className={classes.field}>
                <input type='file'
                       accept={accept}
                       disabled={props.disabled}
                       onChange={uploadFileHandler.bind(this)}
                       ref={inputRef}
                />

                {progress === 0 ?
                    props.fileContent ?
                        <div className={classes.info}>
                            <div className={classes.type}>{props.extension}</div>

                            <Button type='regular'
                                    icon='paperclip'
                                    onClick={() => window.open(`https://api.sochidominvest.ru/uploads/${props.fileContent}`, '_blank')}
                                    disabled={props.disabled || fetching}
                                    className='marginLeft'
                            >Открыть</Button>

                            <Button type='apply'
                                    icon='upload'
                                    onClick={() => inputRef.current?.click()}
                                    disabled={props.disabled || fetching}
                                    title={acceptText}
                                    className='marginLeft'
                            >Заменить</Button>

                            {props.showRemove &&
                            <Button type='apply'
                                    icon='xmark'
                                    onClick={() => props.onChange('', '')}
                                    disabled={props.disabled || fetching}
                                    title={acceptText}
                                    className='marginLeft'
                            />}
                        </div>
                        :
                        <Button type='apply'
                                icon='upload'
                                onClick={() => inputRef.current?.click()}
                                disabled={props.disabled || fetching}
                                title={acceptText}
                        >{props.text}</Button>
                    :
                    <div className={classes.progress}>
                        <span style={{width: progress + '%'}}>{progress}%</span>
                    </div>
                }
            </div>
        )
    }

    return (
        <div className={classes.FileUploader}>
            {renderInput()}
        </div>
    )
}

FileUploader.defaultProps = defaultProps
FileUploader.displayName = 'FileUploader'

export default FileUploader