import React, {useEffect, useState} from 'react'
import DocumentService from '../../api/DocumentService'
import {PopupProps} from '../../@types/IPopup'
import {IDocument} from '../../@types/IDocument'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import CheckBox from '../CheckBox/CheckBox'
import FileUploader from '../FileUploader/FileUploader'
import classes from './PopupDocumentCreate.module.scss'

interface Props extends PopupProps {
    document?: IDocument | null
    objectId?: number
    objectType?: string

    onSave(document: IDocument): void
}

const defaultProps: Props = {
    document: null,
    onSave: (document: IDocument) => {
        console.info('PopupDocumentCreate onSave', document)
    }
}

const PopupDocumentCreate: React.FC<Props> = (props) => {
    const [documentInfo, setDocumentInfo] = useState<IDocument>(props.document || {
        id: null,
        name: '',
        objectId: props.objectId || null,
        objectType: props.objectType || null,
        type: '',
        content: '',
        active: 1
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        setFetching(true)

        DocumentService.saveDocument(documentInfo)
            .then((response: any) => {
                setFetching(false)
                setDocumentInfo(response.data)

                props.onSave(response.data)
                close()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
    }

    const changeUploadFile = (document: IDocument) => {
        setDocumentInfo(document)
    }

    return (
        <Popup className={classes.PopupDocumentCreate}>
            <Header title={documentInfo.id ? 'Редактировать документ' : 'Добавить документ'}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <div className={classes.field}>
                        <div className={classes.field_label}>Название</div>

                        <TextBox value={documentInfo.name}
                                 onChange={(e: React.MouseEvent, value: string) => setDocumentInfo({
                                     ...documentInfo,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={documentInfo.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 icon='heading'
                        />
                    </div>

                    <div className={classes.field}>
                        <div className={classes.field_label}>Файл</div>

                        <FileUploader document={documentInfo}
                                      onChange={changeUploadFile.bind(this)}
                                      text='Загрузить файл'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  checked={!!documentInfo.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setDocumentInfo({
                                      ...documentInfo,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || documentInfo.name.trim() === ''}
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupDocumentCreate.defaultProps = defaultProps
PopupDocumentCreate.displayName = 'PopupDocumentCreate'

export default function openPopupDocumentCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupDocumentCreate, popupProps, undefined, block, displayOptions)
}