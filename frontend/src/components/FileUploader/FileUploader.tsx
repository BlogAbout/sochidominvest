import React, {useRef, useState} from 'react'
import AttachmentService from '../../api/AttachmentService'
import {IAttachment} from '../../@types/IAttachment'
import Button from '../Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import classes from './FileUploader.module.scss'

interface Props {
    extension?: string
    type: 'image' | 'video' | 'document'
    disabled?: boolean
    text?: string
    showCancel?: boolean
    multi?: boolean

    onChange(file: IAttachment): void

    onCancel?(): void
}

const defaultProps: Props = {
    type: 'image',
    disabled: false,
    text: 'Загрузить',
    showCancel: false,
    multi: false,
    onChange: (file: IAttachment) => {
        console.info('FileUploader onChange', file)
    }
}

const FileUploader: React.FC<Props> = (props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [progress, setProgress] = useState(0)
    const [fetching, setFetching] = useState(false)
    const [counter, setCounter] = useState(0)
    const [countFiles, setCountFiles] = useState(0)

    let accept = ''
    let acceptText = ''

    switch (props.type) {
        case 'document':
            accept = 'image/jpeg,image/png,image/jpg,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf'
            acceptText = 'Доступны для загрузки: PNG, JPG, JPEG, DOC, DOCX, XLS, XLSX, PDF. Максимальный размер: 50 Мб.'
            break
        case 'image':
            accept = 'image/jpeg,image/png,image/jpg'
            acceptText = 'Доступны для загрузки: PNG, JPG, JPEG. Максимальный размер: 50 Мб.'
            break
        case 'video':
            accept = 'video/mp4'
            acceptText = 'Доступны для загрузки: MP4. Максимальный размер: 50 Мб.'
            break
    }

    // Загрузчик файла
    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.currentTarget.files

        if (files && files.length) {
            setCountFiles(files.length)
            setFetching(true)
            uploadFileToServer(files, 0)
        }
    }

    const uploadFileToServer = (files: FileList, index: number) => {
        if (index < countFiles) {
            setCounter(index + 1)

            AttachmentService.uploadAttachment(files[index], props.type, (event: any) => {
                setProgress(Math.round((100 * event.loaded) / event.total))
            })
                .then((response) => {
                    props.onChange(response.data)
                    uploadFileToServer(files, ++index)
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
        } else {
            setFetching(false)

            if (inputRef && inputRef.current) {
                inputRef.current.value = ''
            }
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
                       multiple={props.multi}
                />

                {progress === 0 ?
                    <div className={classes.info}>
                        <Button type='apply'
                                icon='upload'
                                onClick={() => inputRef.current?.click()}
                                disabled={props.disabled || fetching}
                                title={acceptText}
                        >{props.text}</Button>

                        {props.showCancel &&
                        <Button type='regular'
                                icon='arrow-rotate-left'
                                onClick={() => props.onCancel ? props.onCancel() : undefined}
                                disabled={props.disabled || fetching}
                                title='Отменить'
                                className='marginLeft'
                        />}
                    </div>
                    :
                    <div className={classes.progress}>
                        <span style={{width: progress + '%'}}>{progress}% ({counter}/{countFiles})</span>
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