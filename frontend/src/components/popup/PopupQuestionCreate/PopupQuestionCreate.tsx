import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import classNames from 'classnames/bind'
import QuestionService from '../../../api/QuestionService'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IQuestion} from '../../../@types/IQuestion'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupQuestionCreate.module.scss'

interface Props extends PopupProps {
    question?: IQuestion | null

    onSave(): void
}

const defaultProps: Props = {
    question: null,
    onSave: () => {
        console.info('PopupQuestionCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupQuestionCreate: React.FC<Props> = (props) => {
    const [question, setArticle] = useState<IQuestion>(props.question || {
        id: null,
        name: '',
        description: '',
        author: null,
        type: null,
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

        QuestionService.saveQuestion(question)
            .then((response: any) => {
                setFetching(false)
                setArticle(response.data)

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

                setFetching(false)
            })
    }

    return (
        <Popup className={classes.PopupQuestionCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type={2}>Информация о вопросе</Title>

                    <div className={classes.field}>
                        <Label text='Вопрос'/>

                        <TextBox value={question.name}
                                 onChange={(e: React.MouseEvent, value: string) => setArticle({
                                     ...question,
                                     name: value
                                 })}
                                 placeHolder='Введите вопрос'
                                 error={!question.name || question.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Ответ'/>

                        <TextAreaBox value={question.description || ''}
                                     onChange={(value: string) => setArticle({
                                         ...question,
                                         description: value
                                     })}
                                     placeHolder='Введите ответ'
                                     width='100%'
                        />
                    </div>

                    <div className={classes.field}>
                        <CheckBox label='Активен'
                                  type='modern'
                                  width={110}
                                  checked={!!question.active}
                                  onChange={(e: React.MouseEvent, value: boolean) => setArticle({
                                      ...question,
                                      active: value ? 1 : 0
                                  })}
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='save'
                        icon='check-double'
                        onClick={() => saveHandler(true)}
                        disabled={fetching || question.name.trim() === '' || question.description.trim() === ''}
                        title='Сохранить и закрыть'
                />

                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || question.name.trim() === '' || question.description.trim() === ''}
                        className='marginLeft'
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

PopupQuestionCreate.defaultProps = defaultProps
PopupQuestionCreate.displayName = 'PopupQuestionCreate'

export default function openPopupQuestionCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupQuestionCreate), popupProps, undefined, block, displayOptions)
}