import React, {useState} from 'react'
import {IQuestion} from '../../../../../@types/IQuestion'
import {getQuestionTypeText} from '../../../../../helpers/questionHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import QuestionService from '../../../../../api/QuestionService'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupQuestionInfo from '../../../../../components/popup/PopupQuestionInfo/PopupQuestionInfo'
import openPopupQuestionCreate from '../../../../../components/popup/PopupQuestionCreate/PopupQuestionCreate'
import classes from './QuestionList.module.scss'

interface Props {
    list: IQuestion[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('QuestionList onSave')
    }
}

const QuestionList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)

    // Редактирование
    const onEditHandler = (question: IQuestion) => {
        openPopupQuestionCreate(document.body, {
            question: question,
            onSave: () => props.onSave()
        })
    }

    // Удаление
    const onRemoveHandler = (question: IQuestion) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить вопрос: "${question.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (question.id) {
                            setFetching(true)

                            QuestionService.removeQuestion(question.id)
                                .then(() => {
                                    props.onSave()
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
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenuHandler = (question: IQuestion, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(question)}]

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(question)})
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <List className={classes.QuestionList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.author}>Автор</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((question: IQuestion) => {
                        return (
                            <ListRow key={question.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(question, e)}
                                     onClick={() => openPopupQuestionInfo(document.body, {
                                         question: question
                                     })}
                            >
                                <ListCell className={classes.name}>{question.name}</ListCell>
                                <ListCell className={classes.author}>{question.authorName}</ListCell>
                                <ListCell className={classes.type}>{getQuestionTypeText(question.type)}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет вопросов'/>
                }
            </ListBody>
        </List>
    )
}

QuestionList.defaultProps = defaultProps
QuestionList.displayName = 'QuestionList'

export default React.memo(QuestionList)