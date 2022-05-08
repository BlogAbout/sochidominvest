import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import AttachmentService from '../../api/AttachmentService'
import {PopupProps} from '../../@types/IPopup'
import {IAttachment} from '../../@types/IAttachment'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Content, Footer, Header, Popup} from '../popup/Popup/Popup'
import FileList from '../FileList/FileList'
import Button from '../form/Button/Button'
import FileUploader from '../FileUploader/FileUploader'
import SearchBox from '../SearchBox/SearchBox'
import classes from './PopupFileManager.module.scss'

interface Props extends PopupProps {
    type: 'image' | 'video' | 'document'
    selected?: number[]
    multi?: boolean

    onSelect(selected: number[], attachments: IAttachment[]): void
}

const defaultProps: Props = {
    type: 'image',
    selected: [],
    multi: false,
    onSelect: (selected: number[], attachments: IAttachment[]) => {
        console.info('PopupFileManager onSelect', selected, attachments)
    }
}

const PopupFileManager: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)
    const [attachments, setAttachments] = useState<IAttachment[]>([])
    const [filterAttachments, setFilterAttachments] = useState<IAttachment[]>([])
    const [selected, setSelected] = useState<number[]>(props.selected || [])
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        setFetching(true)

        AttachmentService.fetchAttachments({active: [0, 1], type: props.type})
            .then((response: any) => {
                setAttachments(response.data)
            })
            .catch((error: any) => {
                console.error('error', error)

                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => {
                setFetching(false)
            })

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        search(searchText)
    }, [attachments])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение выбранных вложений
    const onSaveHandler = () => {
        let selectedAttachments: IAttachment[] = []

        if (selected.length) {
            selectedAttachments = attachments.filter((attachment: IAttachment) => selected.includes(attachment.id))
        }

        props.onSelect(selected, selectedAttachments)
        close()
    }

    // Выбор вложений
    const onSelectHandler = (attachment: IAttachment) => {
        if (props.multi) {
            if (selected.includes(attachment.id)) {
                setSelected(selected.filter((item: number) => item !== attachment.id))
            } else {
                setSelected([attachment.id, ...selected])
            }
        } else {
            props.onSelect([attachment.id], [attachment])
            close()
        }
    }

    // Загрузка файла
    const onUploadFileHandler = (updateAttachments: IAttachment[]) => {
        setAttachments([...updateAttachments, ...attachments])
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!attachments || !attachments.length) {
            setFilterAttachments([])
        }

        if (value !== '') {
            setFilterAttachments(attachments.filter((attachment: IAttachment) => {
                return (attachment.name && attachment.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) ||
                    (attachment.description && attachment.description.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) ||
                    attachment.content.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterAttachments(attachments)
        }
    }

    return (
        <Popup className={classes.PopupFileManager}>
            <Header title='Файловый менеджер' popupId={props.id || ''}/>

            <Content className={classes['popup-content']}>
                <div className={classes.uploader}>
                    <FileUploader text='Загрузить'
                                  type={props.type}
                                  onChange={onUploadFileHandler.bind(this)}
                                  multi={props.multi}
                    />

                    <SearchBox value={searchText} onChange={search.bind(this)}/>
                </div>

                <FileList files={filterAttachments}
                          selected={selected}
                          fetching={fetching}
                          onSave={() => {
                          }}
                          onSelect={onSelectHandler.bind(this)}
                />
            </Content>

            <Footer>
                {props.multi ?
                    <Button type='apply'
                            icon='check'
                            onClick={onSaveHandler.bind(this)}
                            disabled={fetching}
                    >Сохранить</Button>
                    : null
                }

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupFileManager.defaultProps = defaultProps
PopupFileManager.displayName = 'PopupFileManager'

export default function openPopupFileManager(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupFileManager), popupProps, undefined, block, displayOptions)
}