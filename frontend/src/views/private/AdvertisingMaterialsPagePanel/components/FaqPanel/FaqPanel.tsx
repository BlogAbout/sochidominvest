import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IQuestion} from '../../../../../@types/IQuestion'
import QuestionService from '../../../../../api/QuestionService'
import {compareText} from '../../../../../helpers/filterHelper'
import Title from '../../../../../components/ui/Title/Title'
import FilterBase from '../../../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import classes from './FaqPanel.module.scss'

const FaqPanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterQuestion, setFilterQuestion] = useState<IQuestion[]>([])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {questions, fetching: fetchingQuestion} = useTypedSelector(state => state.questionReducer)
    const {fetchQuestionList} = useActions()

    useEffect(() => {
        if (isUpdate || !questions.length) {
            fetchQuestionList({active: [1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [questions])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!questions || !questions.length) {
            setFilterQuestion([])
        }

        if (value !== '') {
            setFilterQuestion(questions.filter((question: IQuestion) => {
                return compareText(question.name, value) || compareText(question.description, value)
            }))
        } else {
            setFilterQuestion(questions)
        }
    }

    const onClickHandler = (question: IQuestion) => {
        // Todo
    }

    const onAddHandler = () => {
        // Todo
    }

    // Редактирование
    const onEditHandler = (question: IQuestion) => {

    }

    // Удаление
    const onRemoveHandler = (question: IQuestion) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить вопрос: ${question.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (question.id) {
                            setFetching(true)

                            QuestionService.removeQuestion(question.id)
                                .then(() => {
                                    onSaveHandler()
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
    const onContextMenu = (e: React.MouseEvent, question: IQuestion) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => onEditHandler(question)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => onRemoveHandler(question)})
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <main className={classes.PartnerPanel}>
            <PageInfo title='Вопросы и ответы'/>

            <FilterBase valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Вопросы и ответы</Title>


            </div>
        </main>
    )
}

FaqPanel.displayName = 'FaqPanel'

export default FaqPanel