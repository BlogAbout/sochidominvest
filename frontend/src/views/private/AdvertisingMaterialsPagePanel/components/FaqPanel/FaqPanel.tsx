import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IQuestion} from '../../../../../@types/IQuestion'
import {IFilterBase} from '../../../../../@types/IFilter'
import QuestionService from '../../../../../api/QuestionService'
import {compareText} from '../../../../../helpers/filterHelper'
import QuestionListContainer from '../../../../../components/container/QuestionListContainer/QuestionListContainer'
import Title from '../../../../../components/ui/Title/Title'
import FilterBase from '../../../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupQuestionInfo from '../../../../../components/popup/PopupQuestionInfo/PopupQuestionInfo'
import openPopupQuestionCreate from '../../../../../components/popup/PopupQuestionCreate/PopupQuestionCreate'
import classes from './FaqPanel.module.scss'

const FaqPanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterQuestion, setFilterQuestion] = useState<IQuestion[]>([])
    const [fetching, setFetching] = useState(false)
    const [selectedType, setSelectedType] = useState<string[]>([])

    const {role} = useTypedSelector(state => state.userReducer)
    const {questions, fetching: fetchingQuestion} = useTypedSelector(state => state.questionReducer)
    const {fetchQuestionList} = useActions()

    useEffect(() => {
        if (isUpdate || !questions.length) {
            fetchQuestionList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [questions, selectedType])

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
                return (!selectedType.length || selectedType.includes(question.type)) && (compareText(question.name, value) || compareText(question.description, value))
            }))
        } else {
            setFilterQuestion(!selectedType.length ? questions : questions.filter((question: IQuestion) => selectedType.includes(question.type)))
        }
    }

    const onClickHandler = (question: IQuestion) => {
        openPopupQuestionInfo(document.body, {
            question: question
        })
    }

    const onAddHandler = () => {
        openPopupQuestionCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Редактирование
    const onEditHandler = (question: IQuestion) => {
        openPopupQuestionCreate(document.body, {
            question: question,
            onSave: () => onSaveHandler()
        })
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

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'common',
            title: 'Общие',
            icon: 'bolt',
            active: selectedType.includes('common'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'payment',
            title: 'Оплата',
            icon: 'money-bill-1-wave',
            active: selectedType.includes('payment'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'tariffs',
            title: 'Тарифы',
            icon: 'money-check',
            active: selectedType.includes('tariffs'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'other',
            title: 'Другое',
            icon: 'star',
            active: selectedType.includes('other'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.FaqPanel}>
            <PageInfo title='Вопросы и ответы'/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Вопросы и ответы</Title>

                <QuestionListContainer questions={filterQuestion}
                                       fetching={fetching || fetchingQuestion}
                                       onClick={onClickHandler.bind(this)}
                                       onEdit={onEditHandler.bind(this)}
                                       onRemove={onRemoveHandler.bind(this)}
                                       onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

FaqPanel.displayName = 'FaqPanel'

export default FaqPanel