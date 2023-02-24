import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {ICompilation} from '../../../@types/ICompilation'
import CompilationService from '../../../api/CompilationService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
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

const cx = classNames.bind(classes)

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
    const saveHandler = (isClose?: boolean) => {
        setFetching(true)

        CompilationService.saveCompilation(compilation)
            .then((response: any) => {
                setCompilation(response.data)

                props.onSave()
                if (isClose) {
                    close()
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetching(false))
    }

    return (
        <Popup className={classes.PopupCompilationCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Информация о подборке</Title>

                    <div className={classes.field}>
                        <Label text='Название'/>

                        <TextBox value={compilation.name}
                                 onChange={(e: React.MouseEvent, value: string) => setCompilation({
                                     ...compilation,
                                     name: value
                                 })}
                                 placeHolder='Введите название'
                                 error={compilation.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Описание'/>

                        <TextAreaBox value={compilation.description}
                                     onChange={(value: string) => setCompilation({
                                         ...compilation,
                                         description: value
                                     })}
                                     placeHolder='Введите описание о подборке'
                                     width='100%'
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || compilation.name.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || compilation.name.trim() === ''}
                        title='Сохранить'
                >Сохранить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupCompilationCreate.defaultProps = defaultProps
PopupCompilationCreate.displayName = 'PopupCompilationCreate'

export default function openPopupCompilationCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupCompilationCreate, popupProps, undefined, block, displayOptions)
}