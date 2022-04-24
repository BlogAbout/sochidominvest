import React, {useEffect, useState} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {ICompilation} from '../../@types/ICompilation'
import CompilationService from '../../api/CompilationService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import TextBox from '../TextBox/TextBox'
import Button from '../Button/Button'
import TextAreaBox from '../TextAreaBox/TextAreaBox'
import classes from './PopupCompilationCreate.module.scss'

interface Props extends PopupProps {
    compilation?: ICompilation | null

    onSave(): void
}

const defaultProps: Props = {
    compilation: null,
    onSave: () => {
        console.info('PopupCompilationCreate onSave')
    }
}

const PopupCompilationCreate: React.FC<Props> = (props) => {
    const [compilation, setCompilation] = useState<ICompilation>(props.compilation || {
        id: null,
        author: null,
        name: '',
        description: '',
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

        CompilationService.saveCompilation(compilation)
            .then((response: any) => {
                setFetching(false)
                setCompilation(response.data)

                props.onSave()
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

    return (
        <Popup className={classes.PopupCompilationCreate}>
            <Header title={compilation.id ? 'Редактировать подборку' : 'Добавить подборку'}
                    popupId={props.id || ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <div className={classes.info}>
                        <div className={classes.field}>
                            <div className={classes.field_label}>Название</div>

                            <TextBox value={compilation.name}
                                     onChange={(e: React.MouseEvent, value: string) => setCompilation({
                                         ...compilation,
                                         name: value
                                     })}
                                     placeHolder='Введите название'
                                     error={compilation.name.trim() === ''}
                                     showRequired
                                     errorText='Поле обязательно для заполнения'
                                     icon='heading'
                            />
                        </div>

                        <div className={classes.field}>
                            <div className={classes.field_label}>Описание</div>

                            <TextAreaBox value={compilation.description}
                                         onChange={(value: string) => setCompilation({
                                             ...compilation,
                                             description: value
                                         })}
                                         placeHolder='Введите описание о подборке'
                                         icon='paragraph'
                            />
                        </div>
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || compilation.name.trim() === ''}
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

PopupCompilationCreate.defaultProps = defaultProps
PopupCompilationCreate.displayName = 'PopupCompilationCreate'

export default function openPopupCompilationCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupCompilationCreate, popupProps, undefined, block, displayOptions)
}