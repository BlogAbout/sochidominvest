import React, {useRef, useState} from 'react'
import classNames from 'classnames/bind'
import {IDocument} from '../../@types/IDocument'
import DocumentService from '../../api/DocumentService'
import Button from '../Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import classes from './FileUploader.module.scss'

interface Props {
    document: IDocument
    disabled?: boolean
    text?: string

    onChange(file: IDocument | null): void
}

const defaultProps: Props = {
    document: {} as IDocument,
    disabled: false,
    text: 'Загрузить',
    onChange: (file: IDocument) => {
        console.info('FileUploader onChange', file)
    }
}

const cx = classNames.bind(classes)

const FileUploader: React.FC<Props> = (props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [progress, setProgress] = useState(0)
    const [fetching, setFetching] = useState(false)

    // const accept = 'image/jpeg,image/png,image/jpg'
    const accept = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf'
    const acceptText = 'Доступны для загрузки: DOC, DOCX, XLS, XLSX, PDF. Максимальный размер: 50 Мб.'

    // Загрузчик файла
    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const documentInfo: IDocument = {...props.document}
        const files: FileList | null = e.currentTarget.files

        if (files && files.length) {
            setFetching(true)

            DocumentService.uploadDocument(files[0], (event: any) => {
                setProgress(Math.round((100 * event.loaded) / event.total))
            })
                .then((response) => {
                    const result = response.data.split('.')

                    documentInfo.content = response.data
                    documentInfo.extension = result[1]

                    props.onChange(documentInfo)
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
                    props.document.content ?
                        <div className={classes.info}>
                            <div className={classes.type}>{props.document.type}</div>

                            <Button type='regular'
                                    icon='paperclip'
                                    onClick={() => window.open(`https://api.sochidominvest.ru/uploads/documents/${props.document.content}`, '_blank')}
                                    disabled={props.disabled || fetching}
                                    title={acceptText}
                                    className='marginLeft'
                            >Открыть</Button>

                            <Button type='apply'
                                    icon='upload'
                                    onClick={() => inputRef.current?.click()}
                                    disabled={props.disabled || fetching}
                                    title={acceptText}
                                    className='marginLeft'
                            >Заменить</Button>
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